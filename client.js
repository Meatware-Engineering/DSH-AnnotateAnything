window.__ModuleLoader__.load({ id: "dsh-annotate-anything", factory: (require) => {
var module = { exports: {} }; var exports = module.exports;
"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};

// node_modules/html-to-image/lib/util.js
var require_util = __commonJS({
  "node_modules/html-to-image/lib/util.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.isInstanceOfElement = exports2.nodeToDataURL = exports2.svgToDataURL = exports2.createImage = exports2.canvasToBlob = exports2.checkCanvasDimensions = exports2.getPixelRatio = exports2.getImageSize = exports2.getStyleProperties = exports2.toArray = exports2.delay = exports2.uuid = exports2.resolveUrl = void 0;
    function resolveUrl(url, baseUrl) {
      if (url.match(/^[a-z]+:\/\//i)) {
        return url;
      }
      if (url.match(/^\/\//)) {
        return window.location.protocol + url;
      }
      if (url.match(/^[a-z]+:/i)) {
        return url;
      }
      var doc = document.implementation.createHTMLDocument();
      var base = doc.createElement("base");
      var a = doc.createElement("a");
      doc.head.appendChild(base);
      doc.body.appendChild(a);
      if (baseUrl) {
        base.href = baseUrl;
      }
      a.href = url;
      return a.href;
    }
    exports2.resolveUrl = resolveUrl;
    exports2.uuid = /* @__PURE__ */ (function() {
      var counter = 0;
      var random = function() {
        return "0000".concat((Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
      };
      return function() {
        counter += 1;
        return "u".concat(random()).concat(counter);
      };
    })();
    function delay(ms) {
      return function(args) {
        return new Promise(function(resolve) {
          setTimeout(function() {
            return resolve(args);
          }, ms);
        });
      };
    }
    exports2.delay = delay;
    function toArray(arrayLike) {
      var arr = [];
      for (var i = 0, l = arrayLike.length; i < l; i++) {
        arr.push(arrayLike[i]);
      }
      return arr;
    }
    exports2.toArray = toArray;
    var styleProps = null;
    function getStyleProperties(options) {
      if (options === void 0) {
        options = {};
      }
      if (styleProps) {
        return styleProps;
      }
      if (options.includeStyleProperties) {
        styleProps = options.includeStyleProperties;
        return styleProps;
      }
      styleProps = toArray(window.getComputedStyle(document.documentElement));
      return styleProps;
    }
    exports2.getStyleProperties = getStyleProperties;
    function px(node, styleProperty) {
      var win = node.ownerDocument.defaultView || window;
      var val = win.getComputedStyle(node).getPropertyValue(styleProperty);
      return val ? parseFloat(val.replace("px", "")) : 0;
    }
    function getNodeWidth(node) {
      var leftBorder = px(node, "border-left-width");
      var rightBorder = px(node, "border-right-width");
      return node.clientWidth + leftBorder + rightBorder;
    }
    function getNodeHeight(node) {
      var topBorder = px(node, "border-top-width");
      var bottomBorder = px(node, "border-bottom-width");
      return node.clientHeight + topBorder + bottomBorder;
    }
    function getImageSize(targetNode, options) {
      if (options === void 0) {
        options = {};
      }
      var width = options.width || getNodeWidth(targetNode);
      var height = options.height || getNodeHeight(targetNode);
      return { width, height };
    }
    exports2.getImageSize = getImageSize;
    function getPixelRatio() {
      var ratio;
      var FINAL_PROCESS;
      try {
        FINAL_PROCESS = process;
      } catch (e) {
      }
      var val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
      if (val) {
        ratio = parseInt(val, 10);
        if (Number.isNaN(ratio)) {
          ratio = 1;
        }
      }
      return ratio || window.devicePixelRatio || 1;
    }
    exports2.getPixelRatio = getPixelRatio;
    var canvasDimensionLimit = 16384;
    function checkCanvasDimensions(canvas) {
      if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) {
        if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) {
          if (canvas.width > canvas.height) {
            canvas.height *= canvasDimensionLimit / canvas.width;
            canvas.width = canvasDimensionLimit;
          } else {
            canvas.width *= canvasDimensionLimit / canvas.height;
            canvas.height = canvasDimensionLimit;
          }
        } else if (canvas.width > canvasDimensionLimit) {
          canvas.height *= canvasDimensionLimit / canvas.width;
          canvas.width = canvasDimensionLimit;
        } else {
          canvas.width *= canvasDimensionLimit / canvas.height;
          canvas.height = canvasDimensionLimit;
        }
      }
    }
    exports2.checkCanvasDimensions = checkCanvasDimensions;
    function canvasToBlob(canvas, options) {
      if (options === void 0) {
        options = {};
      }
      if (canvas.toBlob) {
        return new Promise(function(resolve) {
          canvas.toBlob(resolve, options.type ? options.type : "image/png", options.quality ? options.quality : 1);
        });
      }
      return new Promise(function(resolve) {
        var binaryString = window.atob(canvas.toDataURL(options.type ? options.type : void 0, options.quality ? options.quality : void 0).split(",")[1]);
        var len = binaryString.length;
        var binaryArray = new Uint8Array(len);
        for (var i = 0; i < len; i += 1) {
          binaryArray[i] = binaryString.charCodeAt(i);
        }
        resolve(new Blob([binaryArray], {
          type: options.type ? options.type : "image/png"
        }));
      });
    }
    exports2.canvasToBlob = canvasToBlob;
    function createImage(url) {
      return new Promise(function(resolve, reject) {
        var img = new Image();
        img.onload = function() {
          img.decode().then(function() {
            requestAnimationFrame(function() {
              return resolve(img);
            });
          });
        };
        img.onerror = reject;
        img.crossOrigin = "anonymous";
        img.decoding = "async";
        img.src = url;
      });
    }
    exports2.createImage = createImage;
    function svgToDataURL(svg) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, Promise.resolve().then(function() {
            return new XMLSerializer().serializeToString(svg);
          }).then(encodeURIComponent).then(function(html) {
            return "data:image/svg+xml;charset=utf-8,".concat(html);
          })];
        });
      });
    }
    exports2.svgToDataURL = svgToDataURL;
    function nodeToDataURL(node, width, height) {
      return __awaiter(this, void 0, void 0, function() {
        var xmlns, svg, foreignObject;
        return __generator(this, function(_a) {
          xmlns = "http://www.w3.org/2000/svg";
          svg = document.createElementNS(xmlns, "svg");
          foreignObject = document.createElementNS(xmlns, "foreignObject");
          svg.setAttribute("width", "".concat(width));
          svg.setAttribute("height", "".concat(height));
          svg.setAttribute("viewBox", "0 0 ".concat(width, " ").concat(height));
          foreignObject.setAttribute("width", "100%");
          foreignObject.setAttribute("height", "100%");
          foreignObject.setAttribute("x", "0");
          foreignObject.setAttribute("y", "0");
          foreignObject.setAttribute("externalResourcesRequired", "true");
          svg.appendChild(foreignObject);
          foreignObject.appendChild(node);
          return [2, svgToDataURL(svg)];
        });
      });
    }
    exports2.nodeToDataURL = nodeToDataURL;
    var isInstanceOfElement = function(node, instance) {
      if (node instanceof instance)
        return true;
      var nodePrototype = Object.getPrototypeOf(node);
      if (nodePrototype === null)
        return false;
      return nodePrototype.constructor.name === instance.name || (0, exports2.isInstanceOfElement)(nodePrototype, instance);
    };
    exports2.isInstanceOfElement = isInstanceOfElement;
  }
});

// node_modules/html-to-image/lib/clone-pseudos.js
var require_clone_pseudos = __commonJS({
  "node_modules/html-to-image/lib/clone-pseudos.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.clonePseudoElements = void 0;
    var util_1 = require_util();
    function formatCSSText(style) {
      var content = style.getPropertyValue("content");
      return "".concat(style.cssText, " content: '").concat(content.replace(/'|"/g, ""), "';");
    }
    function formatCSSProperties(style, options) {
      return (0, util_1.getStyleProperties)(options).map(function(name) {
        var value = style.getPropertyValue(name);
        var priority = style.getPropertyPriority(name);
        return "".concat(name, ": ").concat(value).concat(priority ? " !important" : "", ";");
      }).join(" ");
    }
    function getPseudoElementStyle(className, pseudo, style, options) {
      var selector = ".".concat(className, ":").concat(pseudo);
      var cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
      return document.createTextNode("".concat(selector, "{").concat(cssText, "}"));
    }
    function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
      var style = window.getComputedStyle(nativeNode, pseudo);
      var content = style.getPropertyValue("content");
      if (content === "" || content === "none") {
        return;
      }
      var className = (0, util_1.uuid)();
      try {
        clonedNode.className = "".concat(clonedNode.className, " ").concat(className);
      } catch (err) {
        return;
      }
      var styleElement = document.createElement("style");
      styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
      clonedNode.appendChild(styleElement);
    }
    function clonePseudoElements(nativeNode, clonedNode, options) {
      clonePseudoElement(nativeNode, clonedNode, ":before", options);
      clonePseudoElement(nativeNode, clonedNode, ":after", options);
    }
    exports2.clonePseudoElements = clonePseudoElements;
  }
});

// node_modules/html-to-image/lib/mimes.js
var require_mimes = __commonJS({
  "node_modules/html-to-image/lib/mimes.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getMimeType = void 0;
    var WOFF = "application/font-woff";
    var JPEG = "image/jpeg";
    var mimes = {
      woff: WOFF,
      woff2: WOFF,
      ttf: "application/font-truetype",
      eot: "application/vnd.ms-fontobject",
      png: "image/png",
      jpg: JPEG,
      jpeg: JPEG,
      gif: "image/gif",
      tiff: "image/tiff",
      svg: "image/svg+xml",
      webp: "image/webp"
    };
    function getExtension(url) {
      var match = /\.([^./]*?)$/g.exec(url);
      return match ? match[1] : "";
    }
    function getMimeType(url) {
      var extension = getExtension(url).toLowerCase();
      return mimes[extension] || "";
    }
    exports2.getMimeType = getMimeType;
  }
});

// node_modules/html-to-image/lib/dataurl.js
var require_dataurl = __commonJS({
  "node_modules/html-to-image/lib/dataurl.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.resourceToDataURL = exports2.fetchAsDataURL = exports2.makeDataUrl = exports2.isDataUrl = void 0;
    function getContentFromDataUrl(dataURL) {
      return dataURL.split(/,/)[1];
    }
    function isDataUrl(url) {
      return url.search(/^(data:)/) !== -1;
    }
    exports2.isDataUrl = isDataUrl;
    function makeDataUrl(content, mimeType) {
      return "data:".concat(mimeType, ";base64,").concat(content);
    }
    exports2.makeDataUrl = makeDataUrl;
    function fetchAsDataURL(url, init, process2) {
      return __awaiter(this, void 0, void 0, function() {
        var res, blob;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, fetch(url, init)];
            case 1:
              res = _a.sent();
              if (res.status === 404) {
                throw new Error('Resource "'.concat(res.url, '" not found'));
              }
              return [4, res.blob()];
            case 2:
              blob = _a.sent();
              return [2, new Promise(function(resolve, reject) {
                var reader = new FileReader();
                reader.onerror = reject;
                reader.onloadend = function() {
                  try {
                    resolve(process2({ res, result: reader.result }));
                  } catch (error) {
                    reject(error);
                  }
                };
                reader.readAsDataURL(blob);
              })];
          }
        });
      });
    }
    exports2.fetchAsDataURL = fetchAsDataURL;
    var cache = {};
    function getCacheKey(url, contentType, includeQueryParams) {
      var key = url.replace(/\?.*/, "");
      if (includeQueryParams) {
        key = url;
      }
      if (/ttf|otf|eot|woff2?/i.test(key)) {
        key = key.replace(/.*\//, "");
      }
      return contentType ? "[".concat(contentType, "]").concat(key) : key;
    }
    function resourceToDataURL(resourceUrl, contentType, options) {
      return __awaiter(this, void 0, void 0, function() {
        var cacheKey, dataURL, content, error_1, msg;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
              if (cache[cacheKey] != null) {
                return [2, cache[cacheKey]];
              }
              if (options.cacheBust) {
                resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + (/* @__PURE__ */ new Date()).getTime();
              }
              _a.label = 1;
            case 1:
              _a.trys.push([1, 3, , 4]);
              return [4, fetchAsDataURL(resourceUrl, options.fetchRequestInit, function(_a2) {
                var res = _a2.res, result = _a2.result;
                if (!contentType) {
                  contentType = res.headers.get("Content-Type") || "";
                }
                return getContentFromDataUrl(result);
              })];
            case 2:
              content = _a.sent();
              dataURL = makeDataUrl(content, contentType);
              return [3, 4];
            case 3:
              error_1 = _a.sent();
              dataURL = options.imagePlaceholder || "";
              msg = "Failed to fetch resource: ".concat(resourceUrl);
              if (error_1) {
                msg = typeof error_1 === "string" ? error_1 : error_1.message;
              }
              if (msg) {
                console.warn(msg);
              }
              return [3, 4];
            case 4:
              cache[cacheKey] = dataURL;
              return [2, dataURL];
          }
        });
      });
    }
    exports2.resourceToDataURL = resourceToDataURL;
  }
});

// node_modules/html-to-image/lib/clone-node.js
var require_clone_node = __commonJS({
  "node_modules/html-to-image/lib/clone-node.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.cloneNode = void 0;
    var clone_pseudos_1 = require_clone_pseudos();
    var util_1 = require_util();
    var mimes_1 = require_mimes();
    var dataurl_1 = require_dataurl();
    function cloneCanvasElement(canvas) {
      return __awaiter(this, void 0, void 0, function() {
        var dataURL;
        return __generator(this, function(_a) {
          dataURL = canvas.toDataURL();
          if (dataURL === "data:,") {
            return [2, canvas.cloneNode(false)];
          }
          return [2, (0, util_1.createImage)(dataURL)];
        });
      });
    }
    function cloneVideoElement(video, options) {
      return __awaiter(this, void 0, void 0, function() {
        var canvas, ctx, dataURL_1, poster, contentType, dataURL;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (video.currentSrc) {
                canvas = document.createElement("canvas");
                ctx = canvas.getContext("2d");
                canvas.width = video.clientWidth;
                canvas.height = video.clientHeight;
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                dataURL_1 = canvas.toDataURL();
                return [2, (0, util_1.createImage)(dataURL_1)];
              }
              poster = video.poster;
              contentType = (0, mimes_1.getMimeType)(poster);
              return [4, (0, dataurl_1.resourceToDataURL)(poster, contentType, options)];
            case 1:
              dataURL = _a.sent();
              return [2, (0, util_1.createImage)(dataURL)];
          }
        });
      });
    }
    function cloneIFrameElement(iframe, options) {
      var _a;
      return __awaiter(this, void 0, void 0, function() {
        var _b;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              _c.trys.push([0, 3, , 4]);
              if (!((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) return [3, 2];
              return [4, cloneNode(iframe.contentDocument.body, options, true)];
            case 1:
              return [2, _c.sent()];
            case 2:
              return [3, 4];
            case 3:
              _b = _c.sent();
              return [3, 4];
            case 4:
              return [2, iframe.cloneNode(false)];
          }
        });
      });
    }
    function cloneSingleNode(node, options) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          if ((0, util_1.isInstanceOfElement)(node, HTMLCanvasElement)) {
            return [2, cloneCanvasElement(node)];
          }
          if ((0, util_1.isInstanceOfElement)(node, HTMLVideoElement)) {
            return [2, cloneVideoElement(node, options)];
          }
          if ((0, util_1.isInstanceOfElement)(node, HTMLIFrameElement)) {
            return [2, cloneIFrameElement(node, options)];
          }
          return [2, node.cloneNode(isSVGElement(node))];
        });
      });
    }
    var isSlotElement = function(node) {
      return node.tagName != null && node.tagName.toUpperCase() === "SLOT";
    };
    var isSVGElement = function(node) {
      return node.tagName != null && node.tagName.toUpperCase() === "SVG";
    };
    function cloneChildren(nativeNode, clonedNode, options) {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function() {
        var children;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              if (isSVGElement(clonedNode)) {
                return [2, clonedNode];
              }
              children = [];
              if (isSlotElement(nativeNode) && nativeNode.assignedNodes) {
                children = (0, util_1.toArray)(nativeNode.assignedNodes());
              } else if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) {
                children = (0, util_1.toArray)(nativeNode.contentDocument.body.childNodes);
              } else {
                children = (0, util_1.toArray)(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
              }
              if (children.length === 0 || (0, util_1.isInstanceOfElement)(nativeNode, HTMLVideoElement)) {
                return [2, clonedNode];
              }
              return [4, children.reduce(function(deferred, child) {
                return deferred.then(function() {
                  return cloneNode(child, options);
                }).then(function(clonedChild) {
                  if (clonedChild) {
                    clonedNode.appendChild(clonedChild);
                  }
                });
              }, Promise.resolve())];
            case 1:
              _c.sent();
              return [2, clonedNode];
          }
        });
      });
    }
    function cloneCSSStyle(nativeNode, clonedNode, options) {
      var targetStyle = clonedNode.style;
      if (!targetStyle) {
        return;
      }
      var sourceStyle = window.getComputedStyle(nativeNode);
      if (sourceStyle.cssText) {
        targetStyle.cssText = sourceStyle.cssText;
        targetStyle.transformOrigin = sourceStyle.transformOrigin;
      } else {
        (0, util_1.getStyleProperties)(options).forEach(function(name) {
          var value = sourceStyle.getPropertyValue(name);
          if (name === "font-size" && value.endsWith("px")) {
            var reducedFont = Math.floor(parseFloat(value.substring(0, value.length - 2))) - 0.1;
            value = "".concat(reducedFont, "px");
          }
          if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") {
            value = "block";
          }
          if (name === "d" && clonedNode.getAttribute("d")) {
            value = "path(".concat(clonedNode.getAttribute("d"), ")");
          }
          targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
        });
      }
    }
    function cloneInputValue(nativeNode, clonedNode) {
      if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLTextAreaElement)) {
        clonedNode.innerHTML = nativeNode.value;
      }
      if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLInputElement)) {
        clonedNode.setAttribute("value", nativeNode.value);
      }
    }
    function cloneSelectValue(nativeNode, clonedNode) {
      if ((0, util_1.isInstanceOfElement)(nativeNode, HTMLSelectElement)) {
        var clonedSelect = clonedNode;
        var selectedOption = Array.from(clonedSelect.children).find(function(child) {
          return nativeNode.value === child.getAttribute("value");
        });
        if (selectedOption) {
          selectedOption.setAttribute("selected", "");
        }
      }
    }
    function decorate(nativeNode, clonedNode, options) {
      if ((0, util_1.isInstanceOfElement)(clonedNode, Element)) {
        cloneCSSStyle(nativeNode, clonedNode, options);
        (0, clone_pseudos_1.clonePseudoElements)(nativeNode, clonedNode, options);
        cloneInputValue(nativeNode, clonedNode);
        cloneSelectValue(nativeNode, clonedNode);
      }
      return clonedNode;
    }
    function ensureSVGSymbols(clone, options) {
      return __awaiter(this, void 0, void 0, function() {
        var uses, processedDefs, i, use, id, exist, definition, _a, _b, nodes, ns, svg, defs, i;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
              if (uses.length === 0) {
                return [2, clone];
              }
              processedDefs = {};
              i = 0;
              _c.label = 1;
            case 1:
              if (!(i < uses.length)) return [3, 4];
              use = uses[i];
              id = use.getAttribute("xlink:href");
              if (!id) return [3, 3];
              exist = clone.querySelector(id);
              definition = document.querySelector(id);
              if (!(!exist && definition && !processedDefs[id])) return [3, 3];
              _a = processedDefs;
              _b = id;
              return [4, cloneNode(definition, options, true)];
            case 2:
              _a[_b] = _c.sent();
              _c.label = 3;
            case 3:
              i++;
              return [3, 1];
            case 4:
              nodes = Object.values(processedDefs);
              if (nodes.length) {
                ns = "http://www.w3.org/1999/xhtml";
                svg = document.createElementNS(ns, "svg");
                svg.setAttribute("xmlns", ns);
                svg.style.position = "absolute";
                svg.style.width = "0";
                svg.style.height = "0";
                svg.style.overflow = "hidden";
                svg.style.display = "none";
                defs = document.createElementNS(ns, "defs");
                svg.appendChild(defs);
                for (i = 0; i < nodes.length; i++) {
                  defs.appendChild(nodes[i]);
                }
                clone.appendChild(svg);
              }
              return [2, clone];
          }
        });
      });
    }
    function cloneNode(node, options, isRoot) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          if (!isRoot && options.filter && !options.filter(node)) {
            return [2, null];
          }
          return [2, Promise.resolve(node).then(function(clonedNode) {
            return cloneSingleNode(clonedNode, options);
          }).then(function(clonedNode) {
            return cloneChildren(node, clonedNode, options);
          }).then(function(clonedNode) {
            return decorate(node, clonedNode, options);
          }).then(function(clonedNode) {
            return ensureSVGSymbols(clonedNode, options);
          })];
        });
      });
    }
    exports2.cloneNode = cloneNode;
  }
});

// node_modules/html-to-image/lib/embed-resources.js
var require_embed_resources = __commonJS({
  "node_modules/html-to-image/lib/embed-resources.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.embedResources = exports2.shouldEmbed = exports2.embed = exports2.parseURLs = void 0;
    var util_1 = require_util();
    var mimes_1 = require_mimes();
    var dataurl_1 = require_dataurl();
    var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
    var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
    var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
    function toRegex(url) {
      var escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
      return new RegExp(`(url\\(['"]?)(`.concat(escaped, `)(['"]?\\))`), "g");
    }
    function parseURLs(cssText) {
      var urls = [];
      cssText.replace(URL_REGEX, function(raw, quotation, url) {
        urls.push(url);
        return raw;
      });
      return urls.filter(function(url) {
        return !(0, dataurl_1.isDataUrl)(url);
      });
    }
    exports2.parseURLs = parseURLs;
    function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
      return __awaiter(this, void 0, void 0, function() {
        var resolvedURL, contentType, dataURL, content, error_1;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              _a.trys.push([0, 5, , 6]);
              resolvedURL = baseURL ? (0, util_1.resolveUrl)(resourceURL, baseURL) : resourceURL;
              contentType = (0, mimes_1.getMimeType)(resourceURL);
              dataURL = void 0;
              if (!getContentFromUrl) return [3, 2];
              return [4, getContentFromUrl(resolvedURL)];
            case 1:
              content = _a.sent();
              dataURL = (0, dataurl_1.makeDataUrl)(content, contentType);
              return [3, 4];
            case 2:
              return [4, (0, dataurl_1.resourceToDataURL)(resolvedURL, contentType, options)];
            case 3:
              dataURL = _a.sent();
              _a.label = 4;
            case 4:
              return [2, cssText.replace(toRegex(resourceURL), "$1".concat(dataURL, "$3"))];
            case 5:
              error_1 = _a.sent();
              return [3, 6];
            case 6:
              return [2, cssText];
          }
        });
      });
    }
    exports2.embed = embed;
    function filterPreferredFontFormat(str, _a) {
      var preferredFontFormat = _a.preferredFontFormat;
      return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, function(match) {
        while (true) {
          var _a2 = URL_WITH_FORMAT_REGEX.exec(match) || [], src = _a2[0], format = _a2[2];
          if (!format) {
            return "";
          }
          if (format === preferredFontFormat) {
            return "src: ".concat(src, ";");
          }
        }
      });
    }
    function shouldEmbed(url) {
      return url.search(URL_REGEX) !== -1;
    }
    exports2.shouldEmbed = shouldEmbed;
    function embedResources(cssText, baseUrl, options) {
      return __awaiter(this, void 0, void 0, function() {
        var filteredCSSText, urls;
        return __generator(this, function(_a) {
          if (!shouldEmbed(cssText)) {
            return [2, cssText];
          }
          filteredCSSText = filterPreferredFontFormat(cssText, options);
          urls = parseURLs(filteredCSSText);
          return [2, urls.reduce(function(deferred, url) {
            return deferred.then(function(css) {
              return embed(css, url, baseUrl, options);
            });
          }, Promise.resolve(filteredCSSText))];
        });
      });
    }
    exports2.embedResources = embedResources;
  }
});

// node_modules/html-to-image/lib/embed-images.js
var require_embed_images = __commonJS({
  "node_modules/html-to-image/lib/embed-images.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.embedImages = void 0;
    var embed_resources_1 = require_embed_resources();
    var util_1 = require_util();
    var dataurl_1 = require_dataurl();
    var mimes_1 = require_mimes();
    function embedProp(propName, node, options) {
      var _a;
      return __awaiter(this, void 0, void 0, function() {
        var propValue, cssString;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
              if (!propValue) return [3, 2];
              return [4, (0, embed_resources_1.embedResources)(propValue, null, options)];
            case 1:
              cssString = _b.sent();
              node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
              return [2, true];
            case 2:
              return [2, false];
          }
        });
      });
    }
    function embedBackground(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var _a, _b, _c, _d;
        return __generator(this, function(_e) {
          switch (_e.label) {
            case 0:
              ;
              return [4, embedProp("background", clonedNode, options)];
            case 1:
              _a = _e.sent();
              if (_a) return [3, 3];
              return [4, embedProp("background-image", clonedNode, options)];
            case 2:
              _a = _e.sent();
              _e.label = 3;
            case 3:
              _a;
              return [4, embedProp("mask", clonedNode, options)];
            case 4:
              _d = _e.sent();
              if (_d) return [3, 6];
              return [4, embedProp("-webkit-mask", clonedNode, options)];
            case 5:
              _d = _e.sent();
              _e.label = 6;
            case 6:
              _c = _d;
              if (_c) return [3, 8];
              return [4, embedProp("mask-image", clonedNode, options)];
            case 7:
              _c = _e.sent();
              _e.label = 8;
            case 8:
              _b = _c;
              if (_b) return [3, 10];
              return [4, embedProp("-webkit-mask-image", clonedNode, options)];
            case 9:
              _b = _e.sent();
              _e.label = 10;
            case 10:
              _b;
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function embedImageNode(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var isImageElement, url, dataURL;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              isImageElement = (0, util_1.isInstanceOfElement)(clonedNode, HTMLImageElement);
              if (!(isImageElement && !(0, dataurl_1.isDataUrl)(clonedNode.src)) && !((0, util_1.isInstanceOfElement)(clonedNode, SVGImageElement) && !(0, dataurl_1.isDataUrl)(clonedNode.href.baseVal))) {
                return [
                  2
                  /*return*/
                ];
              }
              url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
              return [4, (0, dataurl_1.resourceToDataURL)(url, (0, mimes_1.getMimeType)(url), options)];
            case 1:
              dataURL = _a.sent();
              return [4, new Promise(function(resolve, reject) {
                clonedNode.onload = resolve;
                clonedNode.onerror = options.onImageErrorHandler ? function() {
                  var attributes = [];
                  for (var _i = 0; _i < arguments.length; _i++) {
                    attributes[_i] = arguments[_i];
                  }
                  try {
                    resolve(options.onImageErrorHandler.apply(options, attributes));
                  } catch (error) {
                    reject(error);
                  }
                } : reject;
                var image = clonedNode;
                if (image.decode) {
                  image.decode = resolve;
                }
                if (image.loading === "lazy") {
                  image.loading = "eager";
                }
                if (isImageElement) {
                  clonedNode.srcset = "";
                  clonedNode.src = dataURL;
                } else {
                  clonedNode.href.baseVal = dataURL;
                }
              })];
            case 2:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function embedChildren(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var children, deferreds;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              children = (0, util_1.toArray)(clonedNode.childNodes);
              deferreds = children.map(function(child) {
                return embedImages(child, options);
              });
              return [4, Promise.all(deferreds).then(function() {
                return clonedNode;
              })];
            case 1:
              _a.sent();
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    function embedImages(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (!(0, util_1.isInstanceOfElement)(clonedNode, Element)) return [3, 4];
              return [4, embedBackground(clonedNode, options)];
            case 1:
              _a.sent();
              return [4, embedImageNode(clonedNode, options)];
            case 2:
              _a.sent();
              return [4, embedChildren(clonedNode, options)];
            case 3:
              _a.sent();
              _a.label = 4;
            case 4:
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    exports2.embedImages = embedImages;
  }
});

// node_modules/html-to-image/lib/apply-style.js
var require_apply_style = __commonJS({
  "node_modules/html-to-image/lib/apply-style.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.applyStyle = void 0;
    function applyStyle(node, options) {
      var style = node.style;
      if (options.backgroundColor) {
        style.backgroundColor = options.backgroundColor;
      }
      if (options.width) {
        style.width = "".concat(options.width, "px");
      }
      if (options.height) {
        style.height = "".concat(options.height, "px");
      }
      var manual = options.style;
      if (manual != null) {
        Object.keys(manual).forEach(function(key) {
          style[key] = manual[key];
        });
      }
      return node;
    }
    exports2.applyStyle = applyStyle;
  }
});

// node_modules/html-to-image/lib/embed-webfonts.js
var require_embed_webfonts = __commonJS({
  "node_modules/html-to-image/lib/embed-webfonts.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.embedWebFonts = exports2.getWebFontCSS = void 0;
    var util_1 = require_util();
    var dataurl_1 = require_dataurl();
    var embed_resources_1 = require_embed_resources();
    var cssFetchCache = {};
    function fetchCSS(url) {
      return __awaiter(this, void 0, void 0, function() {
        var cache, res, cssText;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              cache = cssFetchCache[url];
              if (cache != null) {
                return [2, cache];
              }
              return [4, fetch(url)];
            case 1:
              res = _a.sent();
              return [4, res.text()];
            case 2:
              cssText = _a.sent();
              cache = { url, cssText };
              cssFetchCache[url] = cache;
              return [2, cache];
          }
        });
      });
    }
    function embedFonts(data, options) {
      return __awaiter(this, void 0, void 0, function() {
        var cssText, regexUrl, fontLocs, loadFonts;
        var _this = this;
        return __generator(this, function(_a) {
          cssText = data.cssText;
          regexUrl = /url\(["']?([^"')]+)["']?\)/g;
          fontLocs = cssText.match(/url\([^)]+\)/g) || [];
          loadFonts = fontLocs.map(function(loc) {
            return __awaiter(_this, void 0, void 0, function() {
              var url;
              return __generator(this, function(_a2) {
                url = loc.replace(regexUrl, "$1");
                if (!url.startsWith("https://")) {
                  url = new URL(url, data.url).href;
                }
                return [2, (0, dataurl_1.fetchAsDataURL)(url, options.fetchRequestInit, function(_a3) {
                  var result = _a3.result;
                  cssText = cssText.replace(loc, "url(".concat(result, ")"));
                  return [loc, result];
                })];
              });
            });
          });
          return [2, Promise.all(loadFonts).then(function() {
            return cssText;
          })];
        });
      });
    }
    function parseCSS(source) {
      if (source == null) {
        return [];
      }
      var result = [];
      var commentsRegex = /(\/\*[\s\S]*?\*\/)/gi;
      var cssText = source.replace(commentsRegex, "");
      var keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
      while (true) {
        var matches = keyframesRegex.exec(cssText);
        if (matches === null) {
          break;
        }
        result.push(matches[0]);
      }
      cssText = cssText.replace(keyframesRegex, "");
      var importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
      var combinedCSSRegex = "((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})";
      var unifiedRegex = new RegExp(combinedCSSRegex, "gi");
      while (true) {
        var matches = importRegex.exec(cssText);
        if (matches === null) {
          matches = unifiedRegex.exec(cssText);
          if (matches === null) {
            break;
          } else {
            importRegex.lastIndex = unifiedRegex.lastIndex;
          }
        } else {
          unifiedRegex.lastIndex = importRegex.lastIndex;
        }
        result.push(matches[0]);
      }
      return result;
    }
    function getCSSRules(styleSheets, options) {
      return __awaiter(this, void 0, void 0, function() {
        var ret, deferreds;
        return __generator(this, function(_a) {
          ret = [];
          deferreds = [];
          styleSheets.forEach(function(sheet) {
            if ("cssRules" in sheet) {
              try {
                (0, util_1.toArray)(sheet.cssRules || []).forEach(function(item, index) {
                  if (item.type === CSSRule.IMPORT_RULE) {
                    var importIndex_1 = index + 1;
                    var url = item.href;
                    var deferred = fetchCSS(url).then(function(metadata) {
                      return embedFonts(metadata, options);
                    }).then(function(cssText) {
                      return parseCSS(cssText).forEach(function(rule) {
                        try {
                          sheet.insertRule(rule, rule.startsWith("@import") ? importIndex_1 += 1 : sheet.cssRules.length);
                        } catch (error) {
                          console.error("Error inserting rule from remote css", {
                            rule,
                            error
                          });
                        }
                      });
                    }).catch(function(e) {
                      console.error("Error loading remote css", e.toString());
                    });
                    deferreds.push(deferred);
                  }
                });
              } catch (e) {
                var inline_1 = styleSheets.find(function(a) {
                  return a.href == null;
                }) || document.styleSheets[0];
                if (sheet.href != null) {
                  deferreds.push(fetchCSS(sheet.href).then(function(metadata) {
                    return embedFonts(metadata, options);
                  }).then(function(cssText) {
                    return parseCSS(cssText).forEach(function(rule) {
                      inline_1.insertRule(rule, inline_1.cssRules.length);
                    });
                  }).catch(function(err) {
                    console.error("Error loading remote stylesheet", err);
                  }));
                }
                console.error("Error inlining remote css file", e);
              }
            }
          });
          return [2, Promise.all(deferreds).then(function() {
            styleSheets.forEach(function(sheet) {
              if ("cssRules" in sheet) {
                try {
                  (0, util_1.toArray)(sheet.cssRules || []).forEach(function(item) {
                    ret.push(item);
                  });
                } catch (e) {
                  console.error("Error while reading CSS rules from ".concat(sheet.href), e);
                }
              }
            });
            return ret;
          })];
        });
      });
    }
    function getWebFontRules(cssRules) {
      return cssRules.filter(function(rule) {
        return rule.type === CSSRule.FONT_FACE_RULE;
      }).filter(function(rule) {
        return (0, embed_resources_1.shouldEmbed)(rule.style.getPropertyValue("src"));
      });
    }
    function parseWebFontRules(node, options) {
      return __awaiter(this, void 0, void 0, function() {
        var styleSheets, cssRules;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              if (node.ownerDocument == null) {
                throw new Error("Provided element is not within a Document");
              }
              styleSheets = (0, util_1.toArray)(node.ownerDocument.styleSheets);
              return [4, getCSSRules(styleSheets, options)];
            case 1:
              cssRules = _a.sent();
              return [2, getWebFontRules(cssRules)];
          }
        });
      });
    }
    function normalizeFontFamily(font) {
      return font.trim().replace(/["']/g, "");
    }
    function getUsedFonts(node) {
      var fonts = /* @__PURE__ */ new Set();
      function traverse(node2) {
        var fontFamily = node2.style.fontFamily || getComputedStyle(node2).fontFamily;
        fontFamily.split(",").forEach(function(font) {
          fonts.add(normalizeFontFamily(font));
        });
        Array.from(node2.children).forEach(function(child) {
          if (child instanceof HTMLElement) {
            traverse(child);
          }
        });
      }
      traverse(node);
      return fonts;
    }
    function getWebFontCSS(node, options) {
      return __awaiter(this, void 0, void 0, function() {
        var rules, usedFonts, cssTexts;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, parseWebFontRules(node, options)];
            case 1:
              rules = _a.sent();
              usedFonts = getUsedFonts(node);
              return [4, Promise.all(rules.filter(function(rule) {
                return usedFonts.has(normalizeFontFamily(rule.style.fontFamily));
              }).map(function(rule) {
                var baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
                return (0, embed_resources_1.embedResources)(rule.cssText, baseUrl, options);
              }))];
            case 2:
              cssTexts = _a.sent();
              return [2, cssTexts.join("\n")];
          }
        });
      });
    }
    exports2.getWebFontCSS = getWebFontCSS;
    function embedWebFonts(clonedNode, options) {
      return __awaiter(this, void 0, void 0, function() {
        var cssText, _a, _b, styleNode, sytleContent;
        return __generator(this, function(_c) {
          switch (_c.label) {
            case 0:
              if (!(options.fontEmbedCSS != null)) return [3, 1];
              _a = options.fontEmbedCSS;
              return [3, 5];
            case 1:
              if (!options.skipFonts) return [3, 2];
              _b = null;
              return [3, 4];
            case 2:
              return [4, getWebFontCSS(clonedNode, options)];
            case 3:
              _b = _c.sent();
              _c.label = 4;
            case 4:
              _a = _b;
              _c.label = 5;
            case 5:
              cssText = _a;
              if (cssText) {
                styleNode = document.createElement("style");
                sytleContent = document.createTextNode(cssText);
                styleNode.appendChild(sytleContent);
                if (clonedNode.firstChild) {
                  clonedNode.insertBefore(styleNode, clonedNode.firstChild);
                } else {
                  clonedNode.appendChild(styleNode);
                }
              }
              return [
                2
                /*return*/
              ];
          }
        });
      });
    }
    exports2.embedWebFonts = embedWebFonts;
  }
});

// node_modules/html-to-image/lib/index.js
var require_lib = __commonJS({
  "node_modules/html-to-image/lib/index.js"(exports2) {
    "use strict";
    var __awaiter = exports2 && exports2.__awaiter || function(thisArg, _arguments, P, generator) {
      function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
          resolve(value);
        });
      }
      return new (P || (P = Promise))(function(resolve, reject) {
        function fulfilled(value) {
          try {
            step(generator.next(value));
          } catch (e) {
            reject(e);
          }
        }
        function rejected(value) {
          try {
            step(generator["throw"](value));
          } catch (e) {
            reject(e);
          }
        }
        function step(result) {
          result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
      });
    };
    var __generator = exports2 && exports2.__generator || function(thisArg, body) {
      var _ = { label: 0, sent: function() {
        if (t[0] & 1) throw t[1];
        return t[1];
      }, trys: [], ops: [] }, f, y, t, g;
      return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
      }), g;
      function verb(n) {
        return function(v) {
          return step([n, v]);
        };
      }
      function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return { value: op[0] ? op[1] : void 0, done: true };
      }
    };
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getFontEmbedCSS = exports2.toBlob = exports2.toJpeg = exports2.toPng = exports2.toPixelData = exports2.toCanvas = exports2.toSvg = void 0;
    var clone_node_1 = require_clone_node();
    var embed_images_1 = require_embed_images();
    var apply_style_1 = require_apply_style();
    var embed_webfonts_1 = require_embed_webfonts();
    var util_1 = require_util();
    function toSvg(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, width, height, clonedNode, datauri;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
              return [4, (0, clone_node_1.cloneNode)(node, options, true)];
            case 1:
              clonedNode = _b.sent();
              return [4, (0, embed_webfonts_1.embedWebFonts)(clonedNode, options)];
            case 2:
              _b.sent();
              return [4, (0, embed_images_1.embedImages)(clonedNode, options)];
            case 3:
              _b.sent();
              (0, apply_style_1.applyStyle)(clonedNode, options);
              return [4, (0, util_1.nodeToDataURL)(clonedNode, width, height)];
            case 4:
              datauri = _b.sent();
              return [2, datauri];
          }
        });
      });
    }
    exports2.toSvg = toSvg;
    function toCanvas(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, width, height, svg, img, canvas, context, ratio, canvasWidth, canvasHeight;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
              return [4, toSvg(node, options)];
            case 1:
              svg = _b.sent();
              return [4, (0, util_1.createImage)(svg)];
            case 2:
              img = _b.sent();
              canvas = document.createElement("canvas");
              context = canvas.getContext("2d");
              ratio = options.pixelRatio || (0, util_1.getPixelRatio)();
              canvasWidth = options.canvasWidth || width;
              canvasHeight = options.canvasHeight || height;
              canvas.width = canvasWidth * ratio;
              canvas.height = canvasHeight * ratio;
              if (!options.skipAutoScale) {
                (0, util_1.checkCanvasDimensions)(canvas);
              }
              canvas.style.width = "".concat(canvasWidth);
              canvas.style.height = "".concat(canvasHeight);
              if (options.backgroundColor) {
                context.fillStyle = options.backgroundColor;
                context.fillRect(0, 0, canvas.width, canvas.height);
              }
              context.drawImage(img, 0, 0, canvas.width, canvas.height);
              return [2, canvas];
          }
        });
      });
    }
    exports2.toCanvas = toCanvas;
    function toPixelData(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var _a, width, height, canvas, ctx;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = (0, util_1.getImageSize)(node, options), width = _a.width, height = _a.height;
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _b.sent();
              ctx = canvas.getContext("2d");
              return [2, ctx.getImageData(0, 0, width, height).data];
          }
        });
      });
    }
    exports2.toPixelData = toPixelData;
    function toPng(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var canvas;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _a.sent();
              return [2, canvas.toDataURL()];
          }
        });
      });
    }
    exports2.toPng = toPng;
    function toJpeg(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var canvas;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _a.sent();
              return [2, canvas.toDataURL("image/jpeg", options.quality || 1)];
          }
        });
      });
    }
    exports2.toJpeg = toJpeg;
    function toBlob(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        var canvas, blob;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, toCanvas(node, options)];
            case 1:
              canvas = _a.sent();
              return [4, (0, util_1.canvasToBlob)(canvas)];
            case 2:
              blob = _a.sent();
              return [2, blob];
          }
        });
      });
    }
    exports2.toBlob = toBlob;
    function getFontEmbedCSS(node, options) {
      if (options === void 0) {
        options = {};
      }
      return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [2, (0, embed_webfonts_1.getWebFontCSS)(node, options)];
        });
      });
    }
    exports2.getFontEmbedCSS = getFontEmbedCSS;
  }
});

// src/region.cjs
var require_region = __commonJS({
  "src/region.cjs"(exports2, module2) {
    "use strict";
    function createRegionTools() {
      function clipRect2(rect, width, height, minimum = 1) {
        if (!rect || ![rect.x, rect.y, rect.width, rect.height, width, height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0 || width <= 0 || height <= 0) return null;
        const x = Math.max(0, Math.min(width, rect.x));
        const y = Math.max(0, Math.min(height, rect.y));
        const right = Math.max(0, Math.min(width, rect.x + rect.width));
        const bottom = Math.max(0, Math.min(height, rect.y + rect.height));
        if (right - x < minimum || bottom - y < minimum) return null;
        return { x, y, width: right - x, height: bottom - y };
      }
      function dragRect(start, end, width, height, minimum = 4) {
        return clipRect2({
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x),
          height: Math.abs(end.y - start.y)
        }, width, height, minimum);
      }
      function pixelRect(rect, viewport, image) {
        const box = clipRect2(rect, viewport.width, viewport.height);
        if (!box || ![image.width, image.height].every(Number.isFinite) || image.width <= 0 || image.height <= 0) return null;
        const sx = image.width / viewport.width, sy = image.height / viewport.height;
        const x = Math.floor(box.x * sx), y = Math.floor(box.y * sy);
        return {
          x,
          y,
          width: Math.ceil((box.x + box.width) * sx) - x,
          height: Math.ceil((box.y + box.height) * sy) - y
        };
      }
      function installRegionPicker2(target, options) {
        let drag = null;
        const swallow = (event) => {
          event.preventDefault();
          event.stopImmediatePropagation();
        };
        const cancel = () => {
          const previous = drag;
          drag = null;
          if (previous) {
            try {
              previous.target.releasePointerCapture(previous.id);
            } catch (_) {
            }
            options.preview(null);
          }
          return !!previous;
        };
        const down = (event) => {
          if (options.ignore(event)) return;
          swallow(event);
          if (event.button !== 0 || event.isPrimary === false || options.blocked()) return;
          cancel();
          drag = { x: event.clientX, y: event.clientY, id: event.pointerId, target: event.target, moved: false };
          try {
            event.target.setPointerCapture(event.pointerId);
          } catch (_) {
          }
        };
        const move = (event) => {
          if (!drag || drag.id !== event.pointerId) return;
          swallow(event);
          if (event.buttons === 0) {
            cancel();
            return;
          }
          if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) >= 4) drag.moved = true;
          if (!drag.moved) return;
          const bounds = options.bounds();
          options.preview(dragRect(drag, { x: event.clientX, y: event.clientY }, bounds.width, bounds.height, 1));
        };
        const up = (event) => {
          if (!drag || drag.id !== event.pointerId) return;
          swallow(event);
          const start = drag;
          const moved = start.moved || Math.hypot(event.clientX - start.x, event.clientY - start.y) >= 4;
          const bounds = options.bounds();
          const rect = dragRect(drag, { x: event.clientX, y: event.clientY }, bounds.width, bounds.height);
          cancel();
          if (moved) {
            if (rect) options.select(rect);
          } else options.click(start);
        };
        const lost = (event) => {
          if (drag && drag.id === event.pointerId) cancel();
        };
        const listeners = { pointerdown: down, pointermove: move, pointerup: up, pointercancel: lost, lostpointercapture: lost };
        Object.entries(listeners).forEach(([name, handler]) => target.addEventListener(name, handler, true));
        return { cancel, isDragging: () => !!drag?.moved, destroy() {
          cancel();
          Object.entries(listeners).forEach(([name, handler]) => target.removeEventListener(name, handler, true));
        } };
      }
      return { clipRect: clipRect2, dragRect, pixelRect, installRegionPicker: installRegionPicker2 };
    }
    module2.exports = { ...createRegionTools(), createRegionTools };
  }
});

// src/capture.cjs
var require_capture = __commonJS({
  "src/capture.cjs"(exports2, module2) {
    "use strict";
    var { toPng, toSvg } = require_lib();
    var { clipRect: clipRect2, pixelRect } = require_region();
    var MAX_SHOT_AREA = 25e5;
    var UI2 = "[data-annot-ui]";
    var CaptureError2 = class extends Error {
      constructor(code) {
        super(code);
        this.code = code;
      }
    };
    function captureErrorKey2(error) {
      const keys = {
        invalid: "captureInvalid",
        tooLarge: "captureTooLarge",
        assets: "captureAssets",
        protected: "captureProtected",
        decode: "captureDecode",
        changed: "captureChanged",
        guestUnavailable: "captureGuestUnavailable",
        guest: "captureGuestFailed"
      };
      return "error." + (keys[error?.code] || (error?.name === "SecurityError" ? "captureProtected" : "captureFailed"));
    }
    function boundedSnapshot(rect) {
      const included = /* @__PURE__ */ new Set([document.documentElement, document.body]);
      const marker = "data-annot-layout-" + Math.random().toString(36).slice(2);
      for (const node of document.querySelectorAll("body *")) {
        if (node.closest(UI2)) continue;
        const b = node.getBoundingClientRect();
        if (b.width <= 0 || b.height <= 0 || b.right <= rect.x || b.left >= rect.x + rect.width || b.bottom <= rect.y || b.top >= rect.y + rect.height) continue;
        for (let ancestor = node; ancestor; ancestor = ancestor.parentElement) included.add(ancestor);
      }
      const layouts = [];
      for (const parent of included) {
        parent.setAttribute(marker, String(layouts.length));
        const omitted = [];
        Array.from(parent.childNodes).forEach((node, index) => {
          if (node.nodeType !== 1 || included.has(node)) return;
          const style = getComputedStyle(node);
          let css = "";
          for (const key of [
            "display",
            "position",
            "inset",
            "inset-block",
            "inset-inline",
            "width",
            "height",
            "min-width",
            "max-width",
            "min-height",
            "max-height",
            "box-sizing",
            "margin",
            "padding",
            "border-width",
            "border-style",
            "flex",
            "order",
            "align-self",
            "justify-self",
            "grid-area",
            "float",
            "clear",
            "vertical-align",
            "aspect-ratio",
            "writing-mode",
            "font-size",
            "line-height",
            "transform",
            "transform-origin",
            "translate",
            "rotate",
            "scale",
            "zoom"
          ]) {
            css += key + ":" + style.getPropertyValue(key) + ";";
          }
          omitted.push({ index, css });
        });
        layouts.push({ parent, omitted });
      }
      return {
        filter: (node) => node.nodeType !== 1 || included.has(node),
        restore: () => layouts.forEach(({ parent }) => parent.removeAttribute(marker)),
        fill(svg) {
          layouts.forEach(({ omitted }, id) => {
            const parent = svg.querySelector("[" + marker + '="' + id + '"]');
            if (!parent) return;
            omitted.forEach(({ index, css }) => {
              const placeholder = svg.createElementNS("http://www.w3.org/1999/xhtml", "div");
              placeholder.style.cssText = css;
              Object.assign(placeholder.style, {
                visibility: "hidden",
                background: "none",
                mask: "none",
                webkitMask: "none",
                borderImageSource: "none",
                listStyleImage: "none",
                filter: "none"
              });
              parent.insertBefore(placeholder, parent.childNodes[index] || null);
            });
            parent.removeAttribute(marker);
          });
        }
      };
    }
    async function cropDataUrl(data, rect, viewport) {
      const image = new Image();
      image.src = data;
      try {
        await image.decode();
      } catch (_) {
        throw new CaptureError2("decode");
      }
      const crop = pixelRect(rect, viewport, { width: image.naturalWidth, height: image.naturalHeight });
      if (!crop) throw new CaptureError2("invalid");
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 1600 / Math.max(crop.width, crop.height));
      canvas.width = Math.max(1, Math.round(crop.width * scale));
      canvas.height = Math.max(1, Math.round(crop.height * scale));
      canvas.getContext("2d").drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    }
    async function captureDom2(el) {
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) throw new CaptureError2("invalid");
      if (rect.width * rect.height > MAX_SHOT_AREA) throw new CaptureError2("tooLarge");
      const ratio = Math.min(2, Math.max(0.25, 1200 / Math.max(rect.width, rect.height)));
      try {
        return await toPng(el, { pixelRatio: ratio, skipFonts: true, cacheBust: false, filter: (node) => !node.matches?.(UI2) });
      } catch (error) {
        throw new CaptureError2(error?.name === "SecurityError" ? "protected" : "assets");
      }
    }
    async function captureHostRegion2(rect) {
      const viewport = { width: window.innerWidth, height: window.innerHeight };
      const box = clipRect2(rect, viewport.width, viewport.height, 4);
      if (!box) throw new CaptureError2("invalid");
      if (box.width * box.height > MAX_SHOT_AREA) throw new CaptureError2("tooLarge");
      const snapshot = boundedSnapshot(box);
      const marker = "data-annot-scroll-" + Math.random().toString(36).slice(2);
      const scrollers = [];
      const positioned = [];
      for (const node of document.querySelectorAll("*")) {
        if (!node.closest(UI2) && (node.scrollTop || node.scrollLeft)) {
          node.setAttribute(marker, String(scrollers.length));
          scrollers.push({ node, x: node.scrollLeft, y: node.scrollTop, width: node.scrollWidth, height: node.scrollHeight });
        }
      }
      for (const node of document.querySelectorAll("*")) {
        if (node.closest(UI2) || !scrollers.some((entry) => entry.node.contains(node))) continue;
        if (!["fixed", "sticky"].includes(getComputedStyle(node).position)) continue;
        node.setAttribute(marker + "-position", String(positioned.length));
        positioned.push({ node, rect: node.getBoundingClientRect() });
      }
      let data;
      try {
        data = await toSvg(document.documentElement, {
          width: viewport.width,
          height: viewport.height,
          skipFonts: true,
          cacheBust: false,
          filter: snapshot.filter
        });
      } catch (error) {
        throw new CaptureError2(error?.name === "SecurityError" ? "protected" : "assets");
      } finally {
        snapshot.restore();
        scrollers.forEach(({ node }) => node.removeAttribute(marker));
        positioned.forEach(({ node }) => node.removeAttribute(marker + "-position"));
      }
      const svg = new DOMParser().parseFromString(decodeURIComponent(data.slice(data.indexOf(",") + 1)), "image/svg+xml");
      if (svg.querySelector("parsererror")) throw new CaptureError2("decode");
      snapshot.fill(svg);
      for (const [index, scroll] of scrollers.entries()) {
        const node = svg.querySelector("[" + marker + '="' + index + '"]');
        if (!node) continue;
        const inner = svg.createElementNS("http://www.w3.org/1999/xhtml", "div");
        for (const key of [
          "display",
          "flexDirection",
          "flexWrap",
          "alignItems",
          "alignContent",
          "justifyContent",
          "justifyItems",
          "gap",
          "gridTemplateColumns",
          "gridTemplateRows",
          "gridAutoColumns",
          "gridAutoRows",
          "gridAutoFlow",
          "padding",
          "writingMode"
        ]) inner.style[key] = node.style[key];
        while (node.firstChild) inner.appendChild(node.firstChild);
        Object.assign(inner.style, {
          position: "relative",
          top: "0",
          left: "0",
          margin: "0",
          border: "0",
          width: scroll.width + "px",
          height: scroll.height + "px",
          boxSizing: "border-box",
          overflow: "visible",
          transform: `translate(${-scroll.x}px, ${-scroll.y}px)`
        });
        Object.assign(node.style, { display: "block", padding: "0", paddingBlock: "0", paddingInline: "0", overflow: "hidden" });
        node.appendChild(inner);
      }
      for (const [index, entry] of positioned.entries()) {
        const node = svg.querySelector("[" + marker + '-position="' + index + '"]');
        if (!node) continue;
        const placeholder = node.cloneNode(true);
        placeholder.style.visibility = "hidden";
        placeholder.removeAttribute(marker + "-position");
        placeholder.querySelectorAll("[" + marker + "-position]").forEach((child) => child.removeAttribute(marker + "-position"));
        node.replaceWith(placeholder);
        const { x, y, width, height } = entry.rect;
        const values = {
          position: "absolute",
          inset: `${y}px auto auto ${x}px`,
          insetBlock: `${y}px auto`,
          insetInline: `${x}px auto`,
          margin: "0",
          marginBlock: "0",
          marginInline: "0",
          width: width + "px",
          inlineSize: width + "px",
          height: height + "px",
          blockSize: height + "px",
          boxSizing: "border-box",
          transform: "none"
        };
        for (const [key, value] of Object.entries(values)) node.style.setProperty(key.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase()), value, "important");
        svg.querySelector("foreignObject").firstElementChild.appendChild(node);
      }
      data = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(new XMLSerializer().serializeToString(svg));
      return cropDataUrl(data, box, viewport);
    }
    async function captureGuest2(wv, rect, expected) {
      if (!wv || typeof wv.capturePage !== "function") throw new CaptureError2("guestUnavailable");
      const prepare = `window.__dshAnnotate && window.__dshAnnotate.prepareCapture(${JSON.stringify(expected || null)})`;
      try {
        const viewport = await wv.executeJavaScript(prepare);
        if (!viewport) throw new CaptureError2("changed");
        const dx = expected && Number.isFinite(expected.x) ? expected.x - viewport.x : 0;
        const dy = expected && Number.isFinite(expected.y) ? expected.y - viewport.y : 0;
        const moved = { x: rect.x + dx, y: rect.y + dy, width: rect.width, height: rect.height };
        const box = clipRect2(moved, viewport.width, viewport.height, 2);
        if (!box) throw new CaptureError2("changed");
        if (box.width * box.height > MAX_SHOT_AREA) throw new CaptureError2("tooLarge");
        const image = await wv.capturePage();
        const shot = await cropDataUrl(image.toDataURL(), box, viewport);
        const valid = await wv.executeJavaScript(`window.__dshAnnotate && window.__dshAnnotate.captureValid(${JSON.stringify(viewport)})`);
        if (!valid) throw new CaptureError2("changed");
        return shot;
      } catch (error) {
        if (error instanceof CaptureError2) throw error;
        throw new CaptureError2("guest");
      } finally {
        try {
          await wv.executeJavaScript("window.__dshAnnotate && window.__dshAnnotate.finishCapture()");
        } catch (_) {
        }
      }
    }
    module2.exports = { CaptureError: CaptureError2, captureErrorKey: captureErrorKey2, cropDataUrl, captureDom: captureDom2, captureHostRegion: captureHostRegion2, captureGuest: captureGuest2 };
  }
});

// src/lib.cjs
var require_lib2 = __commonJS({
  "src/lib.cjs"(exports2, module2) {
    "use strict";
    function clip2(text, max) {
      const limit = max === void 0 ? 140 : max;
      const value = String(text === void 0 || text === null ? "" : text).replace(/\s+/g, " ").trim();
      return value.length > limit ? value.slice(0, limit - 1) + "\u2026" : value;
    }
    function cssEscape(value) {
      if (typeof CSS !== "undefined" && CSS && typeof CSS.escape === "function") return CSS.escape(String(value));
      return String(value).replace(/[^a-zA-Z0-9_-]/g, (ch) => "\\" + ch);
    }
    function elementLabel(el) {
      if (!el || typeof el.getAttribute !== "function") return "";
      const read = (name) => {
        try {
          return el.getAttribute(name);
        } catch (_error) {
          return null;
        }
      };
      const text = el.innerText !== void 0 && el.innerText !== null ? el.innerText : el.textContent;
      const parts = [read("aria-label"), read("title"), read("alt"), read("placeholder"), text].map((part) => clip2(part, 90)).filter((part) => part !== "");
      const unique = parts.filter((part, index) => parts.indexOf(part) === index);
      if (unique.length > 0) return unique[0];
      return el.tagName ? String(el.tagName).toLowerCase() : "";
    }
    function selectorOf(el, depth) {
      const limit = depth === void 0 ? 4 : depth;
      const parts = [];
      let node = el;
      while (node && node.nodeType === 1 && parts.length < limit) {
        let part = String(node.tagName).toLowerCase();
        const id = node.getAttribute && node.getAttribute("id");
        if (id) {
          parts.unshift(part + "#" + cssEscape(id));
          break;
        }
        const classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
        if (classes.length > 0) part += "." + classes.map(cssEscape).join(".");
        const parent = node.parentElement;
        if (parent) {
          const siblings = Array.prototype.filter.call(parent.children, (child) => child.tagName === node.tagName);
          if (siblings.length > 1) part += ":nth-of-type(" + (siblings.indexOf(node) + 1) + ")";
        }
        parts.unshift(part);
        node = node.parentElement;
      }
      return parts.join(" > ");
    }
    function rectOf(el) {
      if (!el || typeof el.getBoundingClientRect !== "function") return null;
      const rect = el.getBoundingClientRect();
      return {
        x: Math.round(rect.left),
        y: Math.round(rect.top),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    }
    function describeElement2(el) {
      if (!el) return null;
      return {
        tag: String(el.tagName || "").toLowerCase(),
        label: elementLabel(el),
        text: clip2(el.innerText !== void 0 && el.innerText !== null ? el.innerText : el.textContent, 200),
        selector: selectorOf(el),
        rect: rectOf(el)
      };
    }
    function dataUrlToBytes2(dataUrl) {
      const text = String(dataUrl);
      const comma = text.indexOf(",");
      if (comma < 0) throw new Error("not a data URL");
      const meta = text.slice(0, comma);
      if (!/;base64/i.test(meta)) throw new Error("not base64");
      const binary = atob(text.slice(comma + 1));
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return { mediaType: meta.slice(5).split(";")[0] || "image/png", bytes };
    }
    function formatAnnotations2(items, t) {
      const lines = [t("prompt.head", { count: items.length })];
      items.forEach((item, index) => {
        const label = item.desc && item.desc.label ? item.desc.label : item.desc && item.desc.tag || "";
        lines.push(t("prompt.item", { index: index + 1, label, comment: String(item.comment || "").trim() || "\u2014" }));
        if (item.kind === "region" && item.desc && item.desc.rect) lines.push(t("prompt.region", { surface: item.desc.surface, ...item.desc.rect }));
        if (item.desc && item.desc.selector) lines.push(t("prompt.where", { selector: item.desc.selector, tag: item.desc.tag }));
      });
      return lines.join("\n");
    }
    module2.exports = {
      clip: clip2,
      cssEscape,
      elementLabel,
      selectorOf,
      rectOf,
      describeElement: describeElement2,
      dataUrlToBytes: dataUrlToBytes2,
      formatAnnotations: formatAnnotations2
    };
  }
});

// src/guest.cjs
var require_guest = __commonJS({
  "src/guest.cjs"(exports2, module2) {
    "use strict";
    var { createRegionTools } = require_region();
    var MARK2 = "__DSH_ANNOTATE__";
    var GUEST_INSTALL2 = `(function () {
  var MARK = '${MARK2}';
  var tools = (${createRegionTools.toString()})();
  var installRegionPicker = tools.installRegionPicker;
  var revision = 0;
  var instance = Math.random().toString(36).slice(2);
  var capturing = false;
  function viewport() { return { width: innerWidth, height: innerHeight, x: scrollX, y: scrollY, revision: revision, instance: instance }; }
  function emit(payload) { console.log(MARK + JSON.stringify(payload)); }
  function hide() { box.style.display = 'none'; label.style.display = 'none'; }
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  var HIT = 'position:fixed;pointer-events:none;border:2px solid __ACCENT__;background:color-mix(in srgb,__ACCENT__ 16%,transparent);border-radius:3px;z-index:2147483647;display:none;box-sizing:border-box';
  var LABEL = 'position:fixed;pointer-events:none;background:__ACCENT__;color:__ON_ACCENT__;font:11px/1.5 -apple-system,system-ui,sans-serif;padding:1px 6px;border-radius:3px;z-index:2147483647;display:none;white-space:nowrap;max-width:60vw;overflow:hidden;text-overflow:ellipsis';
  var layer = document.createElement('div');
  layer.setAttribute('data-dsh-annotate', '1');
  layer.style.cssText = 'position:fixed;inset:0;z-index:2147483646;background:transparent;pointer-events:none';
  var box = document.createElement('div');
  box.style.cssText = HIT;
  var label = document.createElement('div');
  label.style.cssText = LABEL;
  function clip(value, max) {
    var text = String(value == null ? '' : value).replace(/\\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max - 1) + '\u2026' : text;
  }
  function describe(el) {
    var read = function (name) { try { return el.getAttribute(name); } catch (error) { return null; } };
    var text = el.innerText != null ? el.innerText : el.textContent;
    var label = clip(read('aria-label') || read('title') || read('alt') || read('placeholder') || text, 90);
    var parts = [];
    var node = el;
    var depth = 0;
    while (node && node.nodeType === 1 && depth < 4) {
      var part = String(node.tagName).toLowerCase();
      if (node.getAttribute && node.getAttribute('id')) { parts.unshift(part + '#' + node.getAttribute('id')); break; }
      var classes = node.classList ? Array.prototype.slice.call(node.classList, 0, 2) : [];
      if (classes.length) part += '.' + classes.join('.');
      var parent = node.parentElement;
      if (parent) {
        var same = Array.prototype.filter.call(parent.children, function (child) { return child.tagName === node.tagName; });
        if (same.length > 1) part += ':nth-of-type(' + (same.indexOf(node) + 1) + ')';
      }
      parts.unshift(part);
      node = node.parentElement;
      depth += 1;
    }
    var rect = el.getBoundingClientRect();
    return {
      tag: String(el.tagName).toLowerCase(),
      label: label,
      text: clip(text, 200),
      selector: parts.join(' > '),
      rect: { x: Math.round(rect.left), y: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) }
    };
  }
  function hit(x, y) {
    var list = document.elementsFromPoint(x, y);
    for (var i = 0; i < list.length; i += 1) {
      var el = list[i];
      if (el === layer || el === box || el === label) continue;
      if (el.closest && el.closest('[data-dsh-annotate]')) continue;
      return el;
    }
    return null;
  }
  /** Scroll offsets of every scrollable ancestor: regions follow content without assuming an element moves. */
  function scrollChain(el) {
    var chain = [];
    var root = document.scrollingElement || document.documentElement;
    for (var node = el; node; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) {
        chain.push({ el: node, top: node.scrollTop, left: node.scrollLeft });
      }
    }
    var known = chain.some(function (entry) { return entry.el === root; });
    if (!known) chain.push({ el: root, top: root.scrollTop, left: root.scrollLeft });
    return chain;
  }
  function chainDelta(entry) {
    var chain = entry.chain || [];
    var dx = 0; var dy = 0;
    for (var i = 0; i < chain.length; i += 1) {
      if (!chain[i].el.isConnected) return null;
      dx -= chain[i].el.scrollLeft - chain[i].left;
      dy -= chain[i].el.scrollTop - chain[i].top;
    }
    return { dx: dx, dy: dy };
  }
  function regionNow(entry) {
    var width = Math.round(entry.region.width);
    var height = Math.round(entry.region.height);
    // Scroll offsets are stable even when the page recycles the element under
    // the selection; element movement covers transform-based scrolling.
    var delta = chainDelta(entry);
    if (delta && (Math.abs(delta.dx) > 1 || Math.abs(delta.dy) > 1)) {
      return { x: Math.round(entry.region.x + delta.dx), y: Math.round(entry.region.y + delta.dy), width: width, height: height };
    }
    if (entry.el && entry.el.isConnected && entry.base) {
      var bounds = entry.el.getBoundingClientRect();
      var movedX = bounds.left - entry.base.left;
      var movedY = bounds.top - entry.base.top;
      if (Math.abs(movedX) > 1 || Math.abs(movedY) > 1) {
        return { x: Math.round(entry.region.x + movedX), y: Math.round(entry.region.y + movedY), width: width, height: height };
      }
    }
    if (delta) return { x: Math.round(entry.region.x + delta.dx), y: Math.round(entry.region.y + delta.dy), width: width, height: height };
    return null;
  }
  function show(el) {
    if (!el) { box.style.display = 'none'; label.style.display = 'none'; return; }
    var rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) { box.style.display = 'none'; label.style.display = 'none'; return; }
    box.style.display = 'block';
    box.style.left = rect.left + 'px';
    box.style.top = rect.top + 'px';
    box.style.width = rect.width + 'px';
    box.style.height = rect.height + 'px';
    var info = describe(el);
    label.textContent = info.tag + (info.label ? ' \xB7 ' + clip(info.label, 48) : '');
    label.style.display = 'block';
    var below = rect.top + 20 < window.innerHeight;
    label.style.left = Math.max(2, Math.min(rect.left, window.innerWidth - 220)) + 'px';
    label.style.top = (below ? rect.top + 2 : Math.max(2, rect.top - 20)) + 'px';
  }
  var frozen = false;
  var frozenEl = null;
  var scrollFrame = 0;
  var picker;
  var picks = [];
  var pickSeq = 0;
  function reportMoves() {
    if (!picks.length) return;
    picks = picks.filter(function (entry) { return entry.region || (entry.el && entry.el.isConnected); });
    for (var i = 0; i < picks.length; i += 1) {
      var entry = picks[i];
      var bounds = entry.region ? null : entry.el.getBoundingClientRect();
      var rect = entry.region
        ? regionNow(entry)
        : { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
      if (!rect) continue;
      var last = picks[i].last;
      if (last && last.x === rect.x && last.y === rect.y && last.width === rect.width && last.height === rect.height) continue;
      picks[i].last = rect;
      emit({ kind: 'move', id: picks[i].id, rect: rect, viewport: viewport() });
    }
  }
  var monitorFrame = 0;
  function monitor() {
    monitorFrame = requestAnimationFrame(monitor);
    if (picks.length) reportMoves();
  }
  function reportScroll() {
    revision += 1;
    if (picker) picker.cancel();
    hide();
    if (frozen && frozenEl && frozenEl.isConnected) show(frozenEl);
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(function () {
      scrollFrame = 0;
      try { console.log(MARK + JSON.stringify({ kind: 'scroll', x: window.scrollX, y: window.scrollY, revision: revision })); } catch (error) {}
      reportMoves();
    });
  }
  window.addEventListener('scroll', reportScroll, true);
  window.addEventListener('resize', reportScroll, true);
  function onHover(event) {
    if (frozen || capturing || picker.isDragging()) return;
    if (event.target instanceof Element && event.target.closest('[data-dsh-annotate]')) return;
    show(hit(event.clientX, event.clientY));
  }
  function onDown(event) { event.preventDefault(); event.stopImmediatePropagation(); }
  function onClick(event) { event.preventDefault(); event.stopImmediatePropagation(); }
  function onContext(event) { event.preventDefault(); }
  document.addEventListener('mousemove', onHover, true);
  document.addEventListener('mousedown', onDown, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('contextmenu', onContext, true);
  var cursorStyle = document.createElement('style');
  cursorStyle.setAttribute('data-dsh-annotate', '1');
  cursorStyle.textContent = 'html,html *{cursor:crosshair !important}';
  document.documentElement.appendChild(cursorStyle);
  function pickElement(point) {
    if (frozen || capturing) return;
    var el = hit(point.x, point.y);
    if (!el) return;
    frozen = true;
    frozenEl = el;
    var id = instance + ':' + String(++pickSeq);
    picks.push({ id: id, el: el });
    var info = describe(el);
    info.kind = 'pick';
    info.id = id;
    info.viewport = viewport();
    info.scroll = { x: window.scrollX, y: window.scrollY };
    try { console.log(MARK + JSON.stringify(info)); } catch (error) {}
  }
  picker = installRegionPicker(document, {
    ignore: function () { return false; },
    blocked: function () { return frozen || capturing; },
    bounds: viewport,
    click: pickElement,
    preview: function (rect) {
      hide();
      if (!rect) return;
      Object.assign(box.style, { display: 'block', left: rect.x + 'px', top: rect.y + 'px', width: rect.width + 'px', height: rect.height + 'px' });
    },
    select: function (rect) {
      frozen = true;
      var id = instance + ':r' + String(++pickSeq);
      var anchor = hit(rect.x + rect.width / 2, rect.y + rect.height / 2) || hit(rect.x + 2, rect.y + 2);
      if (anchor) {
        var bounds = anchor.getBoundingClientRect();
        picks.push({ id: id, el: anchor, region: rect, chain: scrollChain(anchor),
          base: { left: bounds.left, top: bounds.top },
          offset: { dx: rect.x - bounds.left, dy: rect.y - bounds.top } });
      }
      emit({ kind: 'region', id: id, rect: rect, viewport: viewport(), scroll: { x: scrollX, y: scrollY } });
    }
  });
  function onKey(event) {
    if (event.key !== 'Escape') return;
    event.preventDefault(); event.stopImmediatePropagation();
    if (!picker.cancel()) emit({ kind: 'escape' });
  }
  function onBlur() { picker.cancel(); }
  window.addEventListener('keydown', onKey, true);
  window.addEventListener('blur', onBlur);
  document.documentElement.appendChild(box);
  document.documentElement.appendChild(label);
  document.documentElement.appendChild(layer);
  monitorFrame = requestAnimationFrame(monitor);
  window.__dshAnnotate = {
    freeze: function () { frozen = true; picker.cancel(); },
    prepareCapture: async function (expected) {
      var now = viewport();
      if (expected && !['width', 'height', 'instance'].every(function (key) { return now[key] === expected[key]; })) return null;
      capturing = true; hide();
      await new Promise(function (resolve) { requestAnimationFrame(function () { requestAnimationFrame(resolve); }); });
      return window.__dshAnnotate && window.__dshAnnotate.captureValid(now) ? now : null;
    },
    captureValid: function (expected) {
      var now = viewport();
      return !!expected && ['width', 'height', 'instance'].every(function (key) { return now[key] === expected[key]; });
    },
    finishCapture: function () { capturing = false; if (!frozen) hide(); },
    resume: function () {
      frozen = false;
      picker.cancel();
      frozenEl = null;
      box.style.display = 'none';
      label.style.display = 'none';
    },
    scroll: reportScroll,
    /** Current viewport rects of every tracked pick, for host-side polling. */
    geometry: function () {
      var out = [];
      for (var i = 0; i < picks.length; i += 1) {
        var entry = picks[i];
        var rect;
        if (entry.region) rect = regionNow(entry);
        else if (entry.el && entry.el.isConnected) {
          var bounds = entry.el.getBoundingClientRect();
          rect = { x: Math.round(bounds.left), y: Math.round(bounds.top), width: Math.round(bounds.width), height: Math.round(bounds.height) };
        }
        if (rect) out.push({ id: entry.id, rect: rect });
      }
      return out;
    },
    destroy: function () {
      picker.destroy();
      cancelAnimationFrame(monitorFrame);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('mousemove', onHover, true);
      document.removeEventListener('mousedown', onDown, true);
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('contextmenu', onContext, true);
      picks = [];
      try { layer.remove(); box.remove(); label.remove(); cursorStyle.remove(); } catch (error) {}
      window.removeEventListener('scroll', reportScroll, true);
      window.removeEventListener('resize', reportScroll, true);
      window.__dshAnnotate = null;
    }
  };
  emit({ kind: 'ready', x: scrollX, y: scrollY, revision: revision });
  return true;
})()`;
    var GUEST_FREEZE2 = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.freeze) window.__dshAnnotate.freeze();
  return true;
})()`;
    var GUEST_RESUME2 = `(function () {
  if (window.__dshAnnotate && window.__dshAnnotate.resume) window.__dshAnnotate.resume();
  return true;
})()`;
    var GUEST_REMOVE2 = `(function () {
  if (window.__dshAnnotate) { try { window.__dshAnnotate.destroy(); } catch (error) {} }
  window.__dshAnnotate = null;
  return true;
})()`;
    module2.exports = { MARK: MARK2, GUEST_INSTALL: GUEST_INSTALL2, GUEST_REMOVE: GUEST_REMOVE2, GUEST_FREEZE: GUEST_FREEZE2, GUEST_RESUME: GUEST_RESUME2 };
  }
});

// src/client.cjs
var React = require("react");
var { CaptureError, captureErrorKey, captureDom, captureHostRegion, captureGuest } = require_capture();
var { clipRect, installRegionPicker } = require_region();
var { describeElement, dataUrlToBytes, formatAnnotations, clip } = require_lib2();
var { MARK, GUEST_INSTALL, GUEST_REMOVE, GUEST_FREEZE, GUEST_RESUME } = require_guest();
var NS = "annotateAnything";
var UI = "[data-annot-ui]";
var CSS2 = `
.dsh-annot-trigger{position:relative;display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer;flex:none}
.dsh-annot-trigger__badge{position:absolute;top:-2px;right:-3px;min-width:13px;height:13px;padding:0 3px;border-radius:7px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:600 9px/13px system-ui,sans-serif;text-align:center}
.dsh-annot-trigger:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.dsh-annot-trigger--active{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent);color:var(--dsw-alias-brand-primary)}
.dsh-annot-layer{position:fixed;inset:0;z-index:9000;pointer-events:none}
.dsh-annot-bar{position:fixed;bottom:14px;top:auto;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:10px;padding:6px 8px 6px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 6px 24px rgba(0,0,0,.18);font:12px/1.4 system-ui,-apple-system,sans-serif;pointer-events:auto;max-width:min(760px,92vw)}
.dsh-annot-bar__hint{color:var(--dsw-alias-label-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dsh-annot-bar__count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;padding:0 5px;border-radius:9px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font-weight:600}
.dsh-annot-btn{appearance:none;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:7px;padding:4px 10px;font:12px/1.3 inherit;cursor:pointer;white-space:nowrap}
.dsh-annot-btn:hover:enabled{background:var(--dsw-alias-bg-layer-2)}
.dsh-annot-btn:disabled{opacity:.5;cursor:default}
.dsh-annot-btn--primary{border-color:transparent;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff)}
.dsh-annot-btn--primary:hover:enabled{filter:brightness(1.06)}
.dsh-annot-btn--danger{color:var(--dsw-alias-state-error-primary)}
.dsh-annot-hover{position:fixed;pointer-events:none;border:2px solid var(--dsw-alias-brand-primary);background:color-mix(in srgb,var(--dsw-alias-brand-primary) 14%,transparent);border-radius:3px;box-sizing:border-box}
.dsh-annot-hover__tag{position:fixed;pointer-events:none;max-width:60vw;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:1px 6px;border-radius:4px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:11px/1.5 system-ui,-apple-system,sans-serif}
.dsh-annot-outline{position:fixed;pointer-events:none;border:2px dashed var(--dsw-alias-brand-primary);border-radius:3px;opacity:.85;box-sizing:border-box}
.dsh-annot-pin{position:fixed;pointer-events:auto;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:11px;background:var(--dsw-alias-button-primary-fill,var(--dsw-alias-brand-primary));color:var(--dsw-alias-label-primary-foreground,#fff);font:600 12px/1 system-ui,-apple-system,sans-serif;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28)}
.dsh-annot-card{position:fixed;width:300px;pointer-events:auto;padding:10px;display:flex;flex-direction:column;gap:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);box-shadow:0 10px 30px rgba(0,0,0,.22);font:12px/1.45 system-ui,-apple-system,sans-serif}
.dsh-annot-card__title{font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__input{width:100%;box-sizing:border-box;resize:vertical;min-height:64px;padding:6px 8px;border-radius:7px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit}
.dsh-annot-card__input:focus{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:0}
.dsh-annot-card__where{color:var(--dsw-alias-label-secondary);font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dsh-annot-card__rows{display:flex;gap:6px;justify-content:flex-end}
.dsh-annot-error{position:fixed;bottom:62px;left:50%;transform:translateX(-50%);pointer-events:none;max-width:80vw;padding:6px 12px;border-radius:8px;background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-label-primary-foreground,#fff);font:12px/1.4 system-ui,-apple-system,sans-serif}
`;
var ICON = React.createElement(
  "svg",
  { viewBox: "0 0 16 16", width: 16, height: 16, "aria-hidden": true, focusable: false },
  React.createElement("path", {
    d: "M2.5 2.5h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8l-3 2.5V11.5H2.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinejoin: "round"
  }),
  React.createElement("circle", { cx: 8, cy: 6.5, r: 1.6, fill: "currentColor" })
);
function createStore() {
  let state = { active: false, sessionId: void 0, count: 0 };
  const listeners = /* @__PURE__ */ new Set();
  return {
    get: () => state,
    set(patch) {
      state = Object.assign({}, state, patch);
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }
  };
}
function boxOf(rect) {
  if (!rect) return null;
  const x = rect.x !== void 0 ? rect.x : rect.left;
  const y = rect.y !== void 0 ? rect.y : rect.top;
  const width = rect.width;
  const height = rect.height;
  if (![x, y, width, height].every(Number.isFinite) || width < 1 || height < 1) return null;
  return { x, y, width, height };
}
function Trigger({ props, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  React.useEffect(() => {
    store.set({ sessionId: props && props.sessionId });
  }, [props && props.sessionId]);
  return React.createElement(
    "button",
    {
      type: "button",
      "data-annot-ui": "trigger",
      className: "dsh-annot-trigger" + (state.active ? " dsh-annot-trigger--active" : ""),
      title: state.count > 0 ? t("trigger.titleCount", { count: state.count }) : t("trigger.title"),
      "aria-label": t("trigger.title"),
      "aria-pressed": state.active,
      onClick: () => store.set({ active: !state.active })
    },
    ICON,
    state.count > 0 && !state.active ? React.createElement("span", { className: "dsh-annot-trigger__badge" }, String(state.count)) : null
  );
}
function Overlay({ ctx, store, t }) {
  const state = React.useSyncExternalStore(store.subscribe, store.get, store.get);
  const [hover, setHover] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [draft, setDraftState] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [, setTick] = React.useState(0);
  const draftRef = React.useRef(null);
  const itemsRef = React.useRef(items);
  const scrollRef = React.useRef(/* @__PURE__ */ new Map());
  const guestsRef = React.useRef([]);
  const busyRef = React.useRef(busy);
  busyRef.current = busy;
  const regionPickerRef = React.useRef(null);
  const setDraft = (value) => {
    draftRef.current = value;
    setDraftState(value);
  };
  draftRef.current = draft;
  itemsRef.current = items;
  React.useEffect(() => {
    store.set({ count: items.length });
  }, [items.length]);
  React.useEffect(() => {
    if (!error) return void 0;
    const timer = setTimeout(() => setError(""), 8e3);
    return () => clearTimeout(timer);
  }, [error]);
  const isActive = state.active;
  const pickAt = (x, y) => {
    const list = document.elementsFromPoint(x, y);
    for (const el of list) {
      if (el instanceof Element && el.closest(UI)) continue;
      return el;
    }
    return null;
  };
  const guestScroll = (wv) => scrollRef.current.get(wv) || { x: 0, y: 0 };
  const guestViewportRect = (wv, docRect, viewport) => {
    const outer = wv.getBoundingClientRect();
    const scroll = guestScroll(wv);
    const sx = viewport ? outer.width / viewport.width : 1;
    const sy = viewport ? outer.height / viewport.height : 1;
    return {
      x: outer.left + (docRect.x - scroll.x) * sx,
      y: outer.top + (docRect.y - scroll.y) * sy,
      width: docRect.width * sx,
      height: docRect.height * sy
    };
  };
  const guestLiveRect = (wv, rect, viewport) => {
    const outer = wv.getBoundingClientRect();
    const sx = viewport && viewport.width > 0 ? outer.width / viewport.width : 1;
    const sy = viewport && viewport.height > 0 ? outer.height / viewport.height : 1;
    return { x: outer.left + rect.x * sx, y: outer.top + rect.y * sy, width: rect.width * sx, height: rect.height * sy };
  };
  const scrollChainOf = (el) => {
    const chain = [];
    const root = document.scrollingElement || document.documentElement;
    for (let node = el; node; node = node.parentElement) {
      if (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) {
        chain.push({ el: node, top: node.scrollTop, left: node.scrollLeft });
      }
    }
    if (!chain.some((entry) => entry.el === root)) chain.push({ el: root, top: root.scrollTop, left: root.scrollLeft });
    return chain;
  };
  const regionRectOf = (value) => {
    if (!value || value.kind !== "region" || !value.rect) return null;
    const chain = value.scrollChain;
    if (chain) {
      let dx = 0;
      let dy = 0;
      let intact = true;
      for (const entry of chain) {
        if (!entry.el.isConnected) {
          intact = false;
          break;
        }
        dx -= entry.el.scrollLeft - entry.left;
        dy -= entry.el.scrollTop - entry.top;
      }
      if (intact) return { x: value.rect.x + dx, y: value.rect.y + dy, width: value.rect.width, height: value.rect.height };
    }
    const anchor = value.anchorEl;
    const offset = value.anchorOffset;
    if (anchor && anchor.isConnected && offset) {
      const bounds = anchor.getBoundingClientRect();
      return { x: bounds.left + offset.dx, y: bounds.top + offset.dy, width: value.rect.width, height: value.rect.height };
    }
    return value.rect;
  };
  const itemRect = (item) => {
    if (item.kind === "region" && !item.wv) return regionRectOf(item);
    if (item.wv && item.liveRect) return guestLiveRect(item.wv, item.liveRect, item.guestViewport);
    if (item.wv && item.docRect) return guestViewportRect(item.wv, item.docRect, item.guestViewport);
    if (item.wv && item.guestRect) {
      const outer = item.wv.getBoundingClientRect();
      return { x: outer.left + item.guestRect.x, y: outer.top + item.guestRect.y, width: item.guestRect.width, height: item.guestRect.height };
    }
    if (item.el && item.el.isConnected) {
      const rect = item.el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    }
    return item.rect || null;
  };
  const draftRectOf = (value) => {
    if (!value) return null;
    if (value.kind === "region" && !value.wv) return regionRectOf(value);
    if (value.wv && value.liveRect) return guestLiveRect(value.wv, value.liveRect, value.guestViewport);
    if (value.wv && value.docRect) return guestViewportRect(value.wv, value.docRect, value.guestViewport);
    if (value.el && value.el.isConnected) {
      const rect = value.el.getBoundingClientRect();
      return { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    }
    return value.rect || null;
  };
  const applyGuestGeometry = (wv, list) => {
    const byId = new Map(list.map((entry) => [entry.id, entry.rect]));
    setItems((prev) => {
      let changed = false;
      const next = prev.map((entry) => {
        if (entry.wv !== wv || !entry.guestId) return entry;
        const rect = byId.get(entry.guestId);
        const current = entry.liveRect;
        if (!rect || current && current.x === rect.x && current.y === rect.y && current.width === rect.width && current.height === rect.height) return entry;
        changed = true;
        return Object.assign({}, entry, { liveRect: rect });
      });
      return changed ? next : prev;
    });
    const draft2 = draftRef.current;
    if (draft2 && draft2.wv === wv && draft2.guestId) {
      const rect = byId.get(draft2.guestId);
      if (rect && (!draft2.liveRect || draft2.liveRect.x !== rect.x || draft2.liveRect.y !== rect.y || draft2.liveRect.width !== rect.width || draft2.liveRect.height !== rect.height)) {
        setDraft(Object.assign({}, draft2, { liveRect: rect }));
      }
    }
  };
  const signalGuests = (code) => {
    for (const pair of guestsRef.current) {
      try {
        const pending = pair[0].executeJavaScript(code);
        if (pending && typeof pending.catch === "function") pending.catch(() => {
        });
      } catch (_error) {
      }
    }
  };
  const capture = async (item) => {
    let shot = null;
    try {
      shot = item.wv ? await captureGuest(item.wv, item.guestRect, item.guestViewport) : await captureDom(item.el);
    } catch (failure) {
      setError(t(captureErrorKey(failure)));
    }
    if (!shot) return;
    setItems((prev) => prev.map((entry) => entry.id === item.id ? Object.assign({}, entry, { shot }) : entry));
  };
  const openDraft = (payload) => {
    setError("");
    setDraft(payload);
  };
  const openRegion = (rect, wv, viewport, guestId) => {
    if (draftRef.current || busyRef.current) return;
    const anchor = wv ? null : pickAt(rect.x + rect.width / 2, rect.y + rect.height / 2);
    const anchorRect = anchor ? anchor.getBoundingClientRect() : null;
    const current = {
      id: "a" + Math.random().toString(36).slice(2),
      kind: "region",
      desc: { label: t("region.label"), rect, surface: wv ? "browser" : "harness" },
      rect: wv ? null : rect,
      wv: wv || null,
      guestRect: wv ? rect : null,
      guestId: guestId || null,
      liveRect: wv ? rect : null,
      anchorEl: anchorRect ? anchor : null,
      anchorOffset: anchorRect ? { dx: rect.x - anchorRect.left, dy: rect.y - anchorRect.top } : null,
      scrollChain: anchorRect ? scrollChainOf(anchor) : null,
      guestViewport: viewport,
      comment: "",
      shot: null,
      capturePending: true,
      docRect: wv ? { ...rect, x: rect.x + viewport.x, y: rect.y + viewport.y } : null
    };
    openDraft(current);
    setHover(null);
    const pending = wv ? captureGuest(wv, rect, viewport) : captureHostRegion(rect);
    pending.then((shot) => {
      if (draftRef.current?.id !== current.id || !store.get().active) return;
      if (!shot) throw new CaptureError("changed");
      setDraft({ ...draftRef.current, shot, capturePending: false });
    }).catch((failure) => {
      if (draftRef.current?.id !== current.id) return;
      setDraft({ ...draftRef.current, capturePending: false });
      setError(t(captureErrorKey(failure)));
    });
  };
  const openGuestPick = (wv, payload) => {
    if (draftRef.current) return;
    const scroll = payload.scroll || { x: 0, y: 0 };
    scrollRef.current.set(wv, scroll);
    const docRect = {
      x: payload.rect.x + scroll.x,
      y: payload.rect.y + scroll.y,
      width: payload.rect.width,
      height: payload.rect.height
    };
    openDraft({
      id: "a" + Math.random().toString(36).slice(2),
      desc: { tag: payload.tag, label: payload.label, text: payload.text, selector: payload.selector, rect: payload.rect },
      el: null,
      wv,
      guestId: payload.id,
      liveRect: payload.rect,
      guestRect: payload.rect,
      guestViewport: payload.viewport,
      docRect,
      rect: null,
      comment: "",
      shot: null,
      editing: false
    });
  };
  const saveDraft = () => {
    const current = draftRef.current;
    if (!current || current.capturePending || current.kind === "region" && !current.shot) return;
    const exists = itemsRef.current.some((entry) => entry.id === current.id);
    if (exists) {
      setItems((prev) => prev.map((entry) => entry.id === current.id ? Object.assign({}, entry, { comment: current.comment }) : entry));
    } else {
      const item = { ...current, editing: false };
      setItems(itemsRef.current.concat([item]));
      if (!item.shot) capture(item).catch(() => {
      });
    }
    setDraft(null);
  };
  const removeItem = (id) => {
    setItems((prev) => prev.filter((entry) => entry.id !== id));
    setDraft(null);
  };
  const stop = (event) => {
    if (event.target instanceof Element && event.target.closest(UI)) return;
    event.preventDefault();
    event.stopPropagation();
  };
  React.useEffect(() => {
    if (!isActive) return void 0;
    const onMove = (event) => {
      if (regionPickerRef.current?.isDragging() || draftRef.current || busyRef.current) return;
      if (event.target instanceof Element && event.target.closest(UI)) return;
      const el = pickAt(event.clientX, event.clientY);
      if (!el) {
        setHover(null);
        return;
      }
      if (String(el.tagName).toLowerCase() === "webview") {
        setHover(null);
        return;
      }
      const rect = el.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) {
        setHover(null);
        return;
      }
      setHover({ x: rect.left, y: rect.top, width: rect.width, height: rect.height, desc: describeElement(el) });
    };
    const pickElement = ({ x, y }) => {
      if (draftRef.current || busyRef.current) return;
      const el = pickAt(x, y);
      if (!el) return;
      if (String(el.tagName).toLowerCase() === "webview") {
        setError(t("error.guestHint"));
        return;
      }
      openDraft({
        id: "a" + Math.random().toString(36).slice(2),
        desc: describeElement(el),
        el,
        wv: null,
        guestRect: null,
        rect: null,
        comment: "",
        shot: null,
        editing: false
      });
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (regionPickerRef.current?.cancel()) return;
      const current = draftRef.current;
      if (current) {
        if (current.editing || current.capturePending) setDraft(null);
        else saveDraft();
        return;
      }
      store.set({ active: false });
    };
    const invalidate = () => {
      regionPickerRef.current?.cancel();
      if (draftRef.current?.capturePending) setDraft(null);
      setHover(null);
      setTick((value) => value + 1);
    };
    const onScroll = (event) => {
      if (event.target instanceof Element && event.target.closest(UI)) return;
      invalidate();
    };
    const picker = installRegionPicker(document, {
      ignore: (event) => event.target instanceof Element && !!event.target.closest(UI),
      blocked: () => !!draftRef.current || busyRef.current,
      bounds: () => ({ width: innerWidth, height: innerHeight }),
      preview: setHover,
      click: pickElement,
      select: (rect) => {
        const overlapsGuest = Array.from(document.querySelectorAll("webview")).some((wv) => {
          const b = wv.getBoundingClientRect();
          return rect.x < b.right && rect.x + rect.width > b.left && rect.y < b.bottom && rect.y + rect.height > b.top;
        });
        if (overlapsGuest) {
          setError(t("error.guestHint"));
          return;
        }
        openRegion(rect);
      }
    });
    regionPickerRef.current = picker;
    const onBlur = () => picker.cancel();
    window.addEventListener("blur", onBlur);
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("mousedown", stop, true);
    document.addEventListener("pointerdown", stop, true);
    document.addEventListener("click", stop, true);
    document.addEventListener("keydown", onKey, true);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll, true);
    const guests = [];
    const install = () => {
      for (const wv of Array.from(document.querySelectorAll("webview"))) {
        const rect = wv.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        try {
          const pending = wv.executeJavaScript(guestInstallScript());
          if (pending && typeof pending.catch === "function") pending.catch(() => {
          });
        } catch (_error) {
        }
        const onMessage = (...args) => {
          const message = args.map((value) => typeof value === "string" ? value : value && value.message).find((value) => typeof value === "string" && value.indexOf(MARK) === 0);
          if (!message) return;
          try {
            const payload = JSON.parse(message.slice(MARK.length));
            if (payload?.kind === "escape") {
              onKey({ key: "Escape", preventDefault() {
              }, stopImmediatePropagation() {
              } });
              return;
            }
            if (payload && ["scroll", "ready"].includes(payload.kind)) {
              if (payload.kind === "scroll") invalidate();
              scrollRef.current.set(wv, { x: Number(payload.x) || 0, y: Number(payload.y) || 0 });
              setTick((value) => value + 1);
              return;
            }
            if (payload && payload.kind === "move") {
              const id = typeof payload.id === "string" ? payload.id : "";
              const rect3 = payload.rect;
              const viewport2 = payload.viewport;
              if (!id || !rect3 || !viewport2) return;
              const next = { id, rect: rect3, viewport: viewport2 };
              setItems((prev) => prev.some((entry) => entry.guestId === id) ? prev.map((entry) => entry.guestId === id ? Object.assign({}, entry, { liveRect: next.rect, guestViewport: next.viewport }) : entry) : prev);
              if (draftRef.current && draftRef.current.guestId === id) {
                setDraft(Object.assign({}, draftRef.current, { liveRect: next.rect, guestViewport: next.viewport }));
              }
              return;
            }
            if (!payload || !["pick", "region"].includes(payload.kind)) return;
            const viewport = payload.viewport;
            if (!viewport || typeof viewport.instance !== "string" || !["width", "height", "x", "y", "revision"].every((key) => Number.isFinite(viewport[key]))) return;
            const rect2 = clipRect(payload.rect, viewport.width, viewport.height, payload.kind === "region" ? 4 : 2);
            if (!rect2) return;
            scrollRef.current.set(wv, { x: viewport.x, y: viewport.y });
            if (payload.kind === "region") {
              openRegion(rect2, wv, viewport, payload.id);
              return;
            }
            openGuestPick(wv, {
              tag: clip(payload.tag, 40),
              label: clip(payload.label, 90),
              text: clip(payload.text, 200),
              selector: clip(payload.selector, 300),
              rect: rect2,
              scroll: { x: viewport.x, y: viewport.y },
              viewport
            });
          } catch (_error) {
          }
        };
        wv.addEventListener("console-message", onMessage);
        wv.addEventListener("did-start-navigation", invalidate);
        guests.push([wv, onMessage]);
      }
      guestsRef.current = guests;
    };
    const uninstall = () => {
      for (const pair of guests) {
        try {
          pair[0].removeEventListener("console-message", pair[1]);
          pair[0].removeEventListener("did-start-navigation", invalidate);
          const pending = pair[0].executeJavaScript(GUEST_REMOVE);
          if (pending && typeof pending.catch === "function") pending.catch(() => {
          });
        } catch (_error) {
        }
      }
      guests.length = 0;
      guestsRef.current = [];
    };
    install();
    const poll = setInterval(() => {
      for (const pair of guests) {
        const wv = pair[0];
        if (wv.__annotPolling) continue;
        const rect = wv.getBoundingClientRect();
        if (rect.width < 4 || rect.height < 4) continue;
        wv.__annotPolling = true;
        try {
          const pending = wv.executeJavaScript("window.__dshAnnotate && window.__dshAnnotate.geometry ? window.__dshAnnotate.geometry() : null");
          Promise.resolve(pending).then((list) => {
            if (Array.isArray(list) && list.length) applyGuestGeometry(wv, list);
          }).catch(() => {
          }).finally(() => {
            wv.__annotPolling = false;
          });
        } catch (_error) {
          wv.__annotPolling = false;
        }
      }
    }, 120);
    return () => {
      clearInterval(poll);
      picker.destroy();
      regionPickerRef.current = null;
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("mousedown", stop, true);
      document.removeEventListener("pointerdown", stop, true);
      document.removeEventListener("click", stop, true);
      document.removeEventListener("keydown", onKey, true);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll, true);
      uninstall();
    };
  }, [isActive, store, t]);
  React.useEffect(() => {
    if (!isActive) {
      setDraft(null);
      setHover(null);
    }
  }, [isActive]);
  React.useEffect(() => {
    if (!isActive) return;
    signalGuests(draft ? GUEST_FREEZE : GUEST_RESUME);
  }, [draft, isActive]);
  const send = async () => {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const conversation = ctx.get("conversation");
      const sessions = ctx.get("sessions");
      const sessionId = state.sessionId;
      const session = sessionId && sessions ? (sessions.binding(sessionId) || {}).session : void 0;
      if (!conversation || !session) throw new Error(t("error.noSession"));
      const resolved = [];
      for (let index = 0; index < itemsRef.current.length; index += 1) {
        const item = itemsRef.current[index];
        let shot = item.shot;
        let captureFailure;
        if (!shot && item.kind !== "region") {
          try {
            shot = item.wv ? await captureGuest(item.wv, item.guestRect, item.guestViewport) : await captureDom(item.el);
          } catch (failure) {
            captureFailure = failure;
            shot = null;
          }
        }
        resolved.push(Object.assign({}, item, { shot, captureFailure }));
      }
      const failed = resolved.find((item) => !item.shot);
      if (failed) {
        setError(t(captureErrorKey(failed.captureFailure)));
        return;
      }
      const files = [];
      resolved.forEach((item, index) => {
        if (!item.shot) return;
        const decoded = dataUrlToBytes(item.shot);
        files.push(new File([decoded.bytes], "annotation-" + (index + 1) + ".png", { type: decoded.mediaType }));
      });
      let shell = null;
      try {
        shell = conversation.input && sessionId ? conversation.input.shell(sessionId) : null;
      } catch (_error) {
        shell = null;
      }
      const typed = shell && shell.snapshot ? String(shell.snapshot.draft || "").trim() : "";
      const annotations = formatAnnotations(resolved, t);
      const text = typed ? typed + "\n\n" + annotations : annotations;
      if (typeof conversation.createDrafts !== "function" || typeof conversation.sendSession !== "function") {
        throw new Error(t("error.unsupportedApi"));
      }
      const drafts = conversation.createDrafts(sessionId, files, false) || [];
      const result = await conversation.sendSession(session, text, drafts.map((entry) => entry.id), "queue");
      if (!result || result.kind !== "success") throw new Error(t("error.sendFailed"));
      if (typed && shell) {
        try {
          shell.setDraft("");
        } catch (_error) {
        }
      }
      setItems([]);
      store.set({ active: false });
    } catch (failure) {
      setError(String(failure && failure.message || failure));
    } finally {
      setBusy(false);
    }
  };
  if (!isActive) return null;
  const children = [];
  children.push(
    React.createElement(
      "div",
      { key: "bar", "data-annot-ui": "bar", className: "dsh-annot-bar" },
      React.createElement("span", { className: "dsh-annot-bar__hint" }, t(draft ? draft.capturePending ? "bar.capturing" : "bar.hintDraft" : "bar.hint")),
      React.createElement("span", { className: "dsh-annot-bar__count" }, String(items.length)),
      ...items.flatMap((item, index) => item.kind === "region" && boxOf(itemRect(item)) === null ? [
        React.createElement("button", {
          key: item.id,
          className: "dsh-annot-btn",
          disabled: busy || !!draft,
          title: item.comment || t("pin.empty"),
          "aria-label": t("pin.edit", { index: index + 1 }),
          onClick: () => openDraft({ ...item, editing: true })
        }, String(index + 1))
      ] : []),
      items.length > 0 ? React.createElement("button", { key: "clear", className: "dsh-annot-btn dsh-annot-btn--danger", onClick: () => setItems([]) }, t("bar.clear")) : null,
      React.createElement("button", { key: "send", className: "dsh-annot-btn dsh-annot-btn--primary", disabled: items.length === 0 || busy || !!draft, onClick: send }, busy ? t("bar.sending") : t("bar.send", { count: items.length })),
      React.createElement("button", { key: "close", className: "dsh-annot-btn", onClick: () => {
        setDraft(null);
        store.set({ active: false });
      } }, t("bar.close"))
    )
  );
  const frozen = draft && !(draft.wv && draft.kind !== "region") ? boxOf(draftRectOf(draft)) : null;
  if (draft && frozen) {
    const label = clip(draft.desc && (draft.desc.label || draft.desc.tag) || "", 60);
    children.push(React.createElement("div", { key: "frozen", className: "dsh-annot-hover", style: { left: frozen.x, top: frozen.y, width: frozen.width, height: frozen.height } }));
    children.push(
      React.createElement(
        "div",
        { key: "frozentag", className: "dsh-annot-hover__tag", style: { left: Math.max(4, frozen.x), top: frozen.y + 2 < 24 ? frozen.y + 2 : frozen.y - 18 } },
        (draft.desc && draft.desc.tag || "") + (label ? " \xB7 " + label : "")
      )
    );
  }
  if (hover && !draft) {
    const label = clip(hover.desc && (hover.desc.label || hover.desc.tag) || "", 60);
    children.push(React.createElement("div", { key: "hover", className: "dsh-annot-hover", style: { left: hover.x, top: hover.y, width: hover.width, height: hover.height } }));
    children.push(
      React.createElement(
        "div",
        { key: "hovertag", className: "dsh-annot-hover__tag", style: { left: Math.max(4, hover.x), top: hover.y + 2 < 24 ? hover.y + 2 : hover.y - 18 } },
        (hover.desc ? hover.desc.tag : "") + (label ? " \xB7 " + label : "")
      )
    );
  }
  items.forEach((item, index) => {
    const rect = boxOf(itemRect(item));
    if (!rect) return;
    children.push(
      React.createElement("div", {
        key: "outline-" + item.id,
        className: "dsh-annot-outline",
        style: { left: rect.x, top: rect.y, width: rect.width, height: rect.height }
      })
    );
    children.push(
      React.createElement(
        "button",
        {
          key: "pin-" + item.id,
          "data-annot-ui": "pin",
          className: "dsh-annot-pin",
          style: { left: Math.max(0, rect.x - 11), top: Math.max(0, rect.y - 11) },
          title: item.comment || t("pin.empty"),
          disabled: busy,
          onClick: () => openDraft(Object.assign({}, item, { editing: true }))
        },
        String(index + 1)
      )
    );
  });
  if (draft) {
    const rect = boxOf(draftRectOf(draft)) || { x: 40, y: 60, width: 0, height: 0 };
    const width = 300;
    const left = Math.max(8, Math.min(rect.x, (window.innerWidth || 1200) - width - 8));
    const below = rect.y + rect.height + 8;
    const top = below + 210 > (window.innerHeight || 800) ? Math.max(8, rect.y - 210) : below;
    children.push(
      React.createElement(
        "div",
        { key: "card", "data-annot-ui": "card", className: "dsh-annot-card", style: { left, top } },
        React.createElement("div", { className: "dsh-annot-card__title" }, clip(draft.desc && (draft.desc.label || draft.desc.tag) || "", 70)),
        React.createElement("textarea", {
          className: "dsh-annot-card__input",
          autoFocus: true,
          rows: 3,
          placeholder: t("card.placeholder"),
          value: draft.comment,
          onChange: (event) => setDraft(Object.assign({}, draftRef.current, { comment: event.target.value }))
        }),
        React.createElement("div", { className: "dsh-annot-card__where" }, draft.kind === "region" ? t("prompt.region", { surface: draft.desc.surface, ...draft.desc.rect }) : draft.desc && draft.desc.selector || ""),
        React.createElement(
          "div",
          { className: "dsh-annot-card__rows" },
          React.createElement("button", { key: "cancel", className: "dsh-annot-btn", onClick: () => setDraft(null) }, t("card.cancel")),
          draft.editing ? React.createElement("button", { key: "delete", className: "dsh-annot-btn dsh-annot-btn--danger", onClick: () => removeItem(draft.id) }, t("card.delete")) : null,
          React.createElement("button", { key: "save", className: "dsh-annot-btn dsh-annot-btn--primary", disabled: !!draft.capturePending || draft.kind === "region" && !draft.shot, onClick: saveDraft }, t("card.save"))
        )
      )
    );
  }
  if (error) children.push(React.createElement("div", { key: "error", "data-annot-ui": "error", className: "dsh-annot-error" }, error));
  return React.createElement("div", { "data-annot-ui": "layer", className: "dsh-annot-layer" }, children);
}
function guestInstallScript() {
  const root = getComputedStyle(document.documentElement);
  const read = (name, fallback) => (root.getPropertyValue(name) || "").trim() || fallback;
  const accent = read("--dsw-alias-button-primary-fill", read("--dsw-alias-brand-primary", "#3b82f6"));
  const onAccent = read("--dsw-alias-label-primary-foreground", "#fff");
  return GUEST_INSTALL.split("__ACCENT__").join(accent).split("__ON_ACCENT__").join(onAccent);
}
function apply(ctx) {
  ctx.effect(() => {
    if (typeof document === "undefined") return void 0;
    const marker = "dsh-annotate-anything/client.css";
    if (document.querySelector('style[data-plugin-css="' + marker + '"]') === null) {
      const style = document.createElement("style");
      style.dataset.plugin = "dsh-annotate-anything";
      style.dataset.pluginCss = marker;
      style.textContent = CSS2;
      document.head.appendChild(style);
    }
    return () => {
      const style = document.querySelector('style[data-plugin-css="' + marker + '"]');
      if (style) style.remove();
    };
  }, "annotate-anything: styles");
  ctx.effect(() => ctx.locale.register(NS, { en: DICT_EN, ru: DICT_RU }), "annotate-anything: dictionaries");
  const t = ctx.locale.bind(NS);
  const store = createStore();
  ctx.slots.inject(
    "conversation.input.left",
    () => ctx.slots.register(
      { name: "conversation.input.left", id: "annotate-anything-trigger", order: 95, locale: NS, label: () => t("trigger.title") },
      (props) => React.createElement(Trigger, { props, store, t })
    )
  );
  ctx.slots.inject(
    "shell.overlay",
    () => ctx.slots.register(
      { name: "shell.overlay", id: "annotate-anything-overlay", order: 400 },
      () => React.createElement(Overlay, { ctx, store, t })
    )
  );
}
var DICT_EN = {
  "trigger.title": "Annotate",
  "trigger.titleCount": "Annotate \u2014 {count} kept",
  "bar.hint": "Click an element or drag a region",
  "region.label": "Selected region",
  "bar.capturing": "Capturing\u2026",
  "prompt.region": "   {surface} region (CSS px): x={x}, y={y}, width={width}, height={height}",
  "bar.hintDraft": "Describe the annotation",
  "bar.send": "Send {count}",
  "bar.clear": "Clear",
  "bar.sending": "Sending\u2026",
  "bar.close": "Close",
  "card.placeholder": "What should change here?",
  "card.save": "Add",
  "card.cancel": "Cancel",
  "card.delete": "Delete",
  "pin.empty": "No comment",
  "pin.edit": "Edit annotation {index}",
  "error.noSession": "Open a chat before sending annotations",
  "error.sendFailed": "The annotations were not sent",
  "error.unsupportedApi": "This Harness version does not support sending image drafts. Update Harness before sending.",
  "error.captureFailed": "The screenshot could not be rendered. Select the content again.",
  "error.captureInvalid": "The selection is outside the visible page or is too small. Select it again.",
  "error.captureTooLarge": "The selection exceeds 2.5 million CSS pixels. Select a smaller area.",
  "error.captureAssets": "An image or style in this selection could not be rendered. Check that the page resources have loaded.",
  "error.captureProtected": "This selection contains protected or cross-origin canvas/video pixels that DOM capture cannot read.",
  "error.captureDecode": "The browser could not decode the screenshot. Some page content may be unsupported.",
  "error.captureChanged": "The page moved, resized or navigated during capture. Select the area again.",
  "error.captureGuestUnavailable": "This Browser tab does not expose screenshot capture. Reopen annotation mode or update Harness.",
  "error.captureGuestFailed": "The Browser tab could not capture its viewport. Check that it is still open.",
  "error.guestHint": "Click inside the page content, not on the tab frame",
  "prompt.head": "Annotations from the app UI ({count}):",
  "prompt.item": "{index}. {label} \u2014 {comment}",
  "prompt.where": "   element: {selector}",
  "meta.title": "Annotate anything",
  "meta.description": "Point at any part of the interface, comment on it, and send annotated screenshots to the chat."
};
var DICT_RU = {
  "trigger.title": "\u0410\u043D\u043D\u043E\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C",
  "trigger.titleCount": "\u0410\u043D\u043D\u043E\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u2014 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u043E {count}",
  "bar.hint": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0438\u043B\u0438 \u0432\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u043F\u0435\u0440\u0435\u0442\u0430\u0441\u043A\u0438\u0432\u0430\u043D\u0438\u0435\u043C",
  "region.label": "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u043D\u0430\u044F \u043E\u0431\u043B\u0430\u0441\u0442\u044C",
  "bar.capturing": "\u0421\u043D\u0438\u043C\u043E\u043A\u2026",
  "prompt.region": "   \u041E\u0431\u043B\u0430\u0441\u0442\u044C {surface} (CSS px): x={x}, y={y}, \u0448\u0438\u0440\u0438\u043D\u0430={width}, \u0432\u044B\u0441\u043E\u0442\u0430={height}",
  "bar.hintDraft": "\u041E\u043F\u0438\u0448\u0438\u0442\u0435, \u0447\u0442\u043E \u0437\u0434\u0435\u0441\u044C \u043D\u0435 \u0442\u0430\u043A",
  "bar.send": "\u041E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C ({count})",
  "bar.clear": "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C",
  "bar.sending": "\u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430\u2026",
  "bar.close": "\u0417\u0430\u043A\u0440\u044B\u0442\u044C",
  "card.placeholder": "\u0427\u0442\u043E \u0437\u0434\u0435\u0441\u044C \u043F\u043E\u043F\u0440\u0430\u0432\u0438\u0442\u044C?",
  "card.save": "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C",
  "card.cancel": "\u041E\u0442\u043C\u0435\u043D\u0430",
  "card.delete": "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
  "pin.empty": "\u0411\u0435\u0437 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u044F",
  "pin.edit": "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u0430\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u044E {index}",
  "error.noSession": "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0447\u0430\u0442, \u0447\u0442\u043E\u0431\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0430\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u0438",
  "error.sendFailed": "\u0410\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u0438 \u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C",
  "error.unsupportedApi": "\u042D\u0442\u0430 \u0432\u0435\u0440\u0441\u0438\u044F Harness \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0443 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439 \u0447\u0435\u0440\u0435\u0437 drafts. \u041E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 Harness.",
  "error.captureFailed": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u0440\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442. \u0412\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0437\u0430\u043D\u043E\u0432\u043E.",
  "error.captureInvalid": "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0432\u043D\u0435 \u0432\u0438\u0434\u0438\u043C\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u0438\u043B\u0438 \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u043C\u0430\u043B\u043E. \u0412\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E.",
  "error.captureTooLarge": "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0435\u0442 2,5 \u043C\u0438\u043B\u043B\u0438\u043E\u043D\u0430 CSS-\u043F\u0438\u043A\u0441\u0435\u043B\u0435\u0439. \u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043C\u0435\u043D\u044C\u0448\u0443\u044E \u043E\u0431\u043B\u0430\u0441\u0442\u044C.",
  "error.captureAssets": "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u0440\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0438\u043B\u0438 \u0441\u0442\u0438\u043B\u044C \u0432 \u0432\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0438. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0443 \u0440\u0435\u0441\u0443\u0440\u0441\u043E\u0432 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B.",
  "error.captureProtected": "\u0412\u044B\u0434\u0435\u043B\u0435\u043D\u0438\u0435 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0437\u0430\u0449\u0438\u0449\u0451\u043D\u043D\u044B\u0435 \u043F\u0438\u043A\u0441\u0435\u043B\u0438 canvas/\u0432\u0438\u0434\u0435\u043E, \u043A\u043E\u0442\u043E\u0440\u044B\u0435 DOM-\u0437\u0430\u0445\u0432\u0430\u0442 \u043D\u0435 \u043C\u043E\u0436\u0435\u0442 \u043F\u0440\u043E\u0447\u0438\u0442\u0430\u0442\u044C.",
  "error.captureDecode": "\u0411\u0440\u0430\u0443\u0437\u0435\u0440 \u043D\u0435 \u0441\u043C\u043E\u0433 \u0434\u0435\u043A\u043E\u0434\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442. \u0427\u0430\u0441\u0442\u044C \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0433\u043E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B \u043C\u043E\u0436\u0435\u0442 \u043D\u0435 \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0442\u044C\u0441\u044F.",
  "error.captureChanged": "\u0412\u043E \u0432\u0440\u0435\u043C\u044F \u0441\u043D\u0438\u043C\u043A\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430 \u043F\u0440\u043E\u043A\u0440\u0443\u0442\u0438\u043B\u0430\u0441\u044C, \u0438\u0437\u043C\u0435\u043D\u0438\u043B\u0430 \u0440\u0430\u0437\u043C\u0435\u0440 \u0438\u043B\u0438 \u043F\u0435\u0440\u0435\u0448\u043B\u0430 \u043F\u043E \u0441\u0441\u044B\u043B\u043A\u0435. \u0412\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u043E\u0431\u043B\u0430\u0441\u0442\u044C \u0437\u0430\u043D\u043E\u0432\u043E.",
  "error.captureGuestUnavailable": "\u042D\u0442\u0430 \u0432\u043A\u043B\u0430\u0434\u043A\u0430 Browser \u043D\u0435 \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u043B\u044F\u0435\u0442 API \u0441\u043D\u0438\u043C\u043A\u043E\u0432. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0430\u043D\u043D\u043E\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u0437\u0430\u043D\u043E\u0432\u043E \u0438\u043B\u0438 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u0435 Harness.",
  "error.captureGuestFailed": "\u0412\u043A\u043B\u0430\u0434\u043A\u0430 Browser \u043D\u0435 \u0441\u043C\u043E\u0433\u043B\u0430 \u0441\u043D\u044F\u0442\u044C \u0432\u0438\u0434\u0438\u043C\u0443\u044E \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435, \u0447\u0442\u043E \u043E\u043D\u0430 \u0435\u0449\u0451 \u043E\u0442\u043A\u0440\u044B\u0442\u0430.",
  "error.guestHint": "\u041D\u0430\u0436\u043C\u0438\u0442\u0435 \u043D\u0430 \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u043C\u043E\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B, \u0430 \u043D\u0435 \u043D\u0430 \u0440\u0430\u043C\u043A\u0443 \u0432\u043A\u043B\u0430\u0434\u043A\u0438",
  "prompt.head": "\u0410\u043D\u043D\u043E\u0442\u0430\u0446\u0438\u0438 \u043A \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0443 ({count}):",
  "prompt.item": "{index}. {label} \u2014 {comment}",
  "prompt.where": "   \u044D\u043B\u0435\u043C\u0435\u043D\u0442: {selector}",
  "meta.title": "\u0410\u043D\u043D\u043E\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0447\u0442\u043E \u0443\u0433\u043E\u0434\u043D\u043E",
  "meta.description": "\u0412\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u043B\u044E\u0431\u043E\u0439 \u044D\u043B\u0435\u043C\u0435\u043D\u0442 \u0438\u043D\u0442\u0435\u0440\u0444\u0435\u0439\u0441\u0430, \u043E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u043A\u043E\u043C\u043C\u0435\u043D\u0442\u0430\u0440\u0438\u0439 \u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u0441\u043A\u0440\u0438\u043D\u0448\u043E\u0442\u044B \u0441 \u043F\u043E\u043C\u0435\u0442\u043A\u0430\u043C\u0438 \u0432 \u0447\u0430\u0442."
};
module.exports = { name: "dsh-annotate-anything", inject: ["slots", "locale"], apply };

return module.exports;
} });
