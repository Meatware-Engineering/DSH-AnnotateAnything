'use strict';
// Point only at a disposable, separately launched Harness profile (see README).
const { chromium } = require('playwright');
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const assert = require('node:assert/strict');
const address = new URL(process.env.HARNESS_TEST_URL || 'http://invalid');
if (!['127.0.0.1','localhost','[::1]'].includes(address.hostname)) throw new Error('HARNESS_TEST_URL must identify a disposable local Harness');
const asset = http.createServer((request,response)=>{
 response.setHeader('content-type','image/png');
 response.end(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64'));
});
(async()=>{
 await new Promise(resolve=>asset.listen(0,'127.0.0.1',resolve));
 const launch={headless:true}; if(process.env.CHROMIUM_EXECUTABLE)launch.executablePath=process.env.CHROMIUM_EXECUTABLE;
 const browser=await chromium.launch(launch);
 try {
  const page=await browser.newPage({viewport:{width:1200,height:900}});
  await page.addInitScript(()=>{
   const original=HTMLCanvasElement.prototype.toDataURL;
   HTMLCanvasElement.prototype.toDataURL=function(...args){
    const result=original.apply(this,args);
    if(this.width===260&&this.height===160)window.testCapture=result;
    return result;
   };
  });
  await page.addLocatorHandler(page.getByRole('dialog'), async () => {
   const dialog=page.getByRole('dialog').last();
   const next=dialog.getByRole('button',{name:'Continue',exact:true});
   if(await next.count())await next.click();else await dialog.getByRole('button').first().click();
  });
  await page.goto(address.href);
  await page.getByRole('button',{name:'Annotate',exact:true}).waitFor();
  const tainted=await page.evaluate(async(port)=>{
   const proof=document.createElement('div');proof.id='proof';proof.style.cssText='position:fixed;left:500px;top:250px;width:300px;height:200px;background:rgb(15,170,90);z-index:100';document.body.appendChild(proof);
   const image=new Image();image.src='http://127.0.0.1:'+port+'/image.png';await image.decode();
   const canvas=document.createElement('canvas');canvas.id='outside-selection';canvas.width=100;canvas.height=100;canvas.style.cssText='position:fixed;left:20px;top:150px;width:100px;height:100px;z-index:100';canvas.getContext('2d').drawImage(image,0,0);document.body.appendChild(canvas);
   try{canvas.toDataURL();return false;}catch(error){return error.name==='SecurityError';}
  },asset.address().port);
  assert.equal(tainted,true);
  await page.getByRole('button',{name:'Annotate',exact:true}).click();
  async function drag(a,b){await page.mouse.move(...a);await page.mouse.down();await page.mouse.move(...b,{steps:4});await page.mouse.up();}
  await drag([780,430],[520,270]);
  await page.getByRole('button',{name:'Add',exact:true}).click({trial:true});
  assert.equal(await page.locator('.dsh-annot-error').count(),0);
  const result=await page.evaluate(async()=>{
   const image=new Image();image.src=window.testCapture;await image.decode();const c=document.createElement('canvas');c.width=image.naturalWidth;c.height=image.naturalHeight;const g=c.getContext('2d');g.drawImage(image,0,0);
   return {url:window.testCapture,width:c.width,height:c.height,samples:[[0,0],[259,0],[0,159],[259,159]].map(([x,y])=>[...g.getImageData(x,y,1,1).data])};
  });
  assert.equal(result.width,260);assert.equal(result.height,160);
  result.samples.forEach(sample=>assert.deepEqual(sample,[15,170,90,255]));
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.mouse.click(600,300);
  await page.locator('.dsh-annot-card__where').filter({hasText:'#proof'}).waitFor();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  // Protected pixels inside the requested crop must fail clearly, without losing the comment.
  await drag([25,155],[95,225]);
  await page.locator('.dsh-annot-error').filter({hasText:'protected or cross-origin canvas'}).waitFor();
  await page.getByPlaceholder('What should change here?').fill('keep this comment');
  assert.equal(await page.getByRole('button',{name:'Add',exact:true}).isDisabled(),true);
  assert.equal(await page.getByPlaceholder('What should change here?').inputValue(),'keep this comment');
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await drag([520,270],[780,430]);
  await page.getByRole('button',{name:'Add',exact:true}).click({trial:true});
  assert.equal(await page.locator('.dsh-annot-error').count(),0);
  const output=fs.mkdtempSync(path.join(os.tmpdir(),'annotate-runtime-'));
  fs.writeFileSync(path.join(output,'host-region.png'),Buffer.from(result.url.split(',')[1],'base64'));
  await page.screenshot({path:path.join(output,'runtime.png')});
  console.log('PASS actual Harness: shipped bundle, click/drag, cropped PNG, unrelated tainted canvas, actionable protected-content error, comment retention, recovery');
  console.log('Runtime evidence: '+output);
 } finally {await browser.close();asset.close();}
})().catch(error=>{asset.close();console.error(error);process.exitCode=1;});
