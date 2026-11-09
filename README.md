# DSH AnnotateAnything

A small, unofficial **DeepSeek Harness** plugin for pointing at interface elements,
adding comments, and sending their screenshots into the current conversation.
English and Russian UI are included. Licensed under MIT.

## What it does

- Adds an **Annotate** button beside the conversation input.
- Highlights elements under the pointer. Click to annotate an element, or hold
  the primary pointer button and drag to select a rectangle automatically.
- Captures only the selected visible rectangle, with no annotation controls in the PNG.
- Lets you add several comments, then edit or delete them via numbered pins.
- Sends a numbered comment list and one cropped PNG per selection. Elements
  include CSS selectors; arbitrary regions include viewport coordinates in CSS pixels.
- Supports selecting page elements inside the Desktop Browser panel when its
  Electron `webview` exposes `executeJavaScript` and `capturePage`.

This is a client-side plugin with an empty Host entry point, not a browser extension
or a standalone screenshot utility. The pins are UI controls; the attached PNGs
are crops, not full-page images with pins painted over them.

## Install from GitHub

npm publication is **not required**. For Desktop:

1. Launch DeepSeek Harness Desktop once to initialize its profile.
2. Use the `dsh` command installed by Desktop through **Manage dsh Command…**.
   An npm-installed `dsh` cannot manage the Desktop profile. If needed, install
   or repair the command, then open a new terminal.
3. Let active tasks finish and fully quit Desktop before running the command below.
   Closing its window is not enough.

```sh
dsh plugin --profile desktop add github:Meatware-Engineering/DSH-AnnotateAnything
```

Reopen Desktop, then open **Plugins** and enable AnnotateAnything if necessary.
Follow Harness’s restart instructions if prompted.

For a separately managed Web profile, use `--profile web` instead. Desktop and Web
profiles have separate plugin installations.

See the [official Desktop CLI instructions](https://github.com/deepseek-ai/deepseek-harness/blob/master/apps/desktop/README.md#bundled-command-runtime).

The repository includes the generated `client.js`, so consumers do not need to
build it. `private: true` prevents accidental npm publication; it does not make
GitHub source private or prevent installation from GitHub.

To work on a local checkout instead (the same Desktop command, first-launch,
full-quit, and reopen requirements apply):

```sh
npm ci
npm run check
dsh plugin --profile desktop add "link:$(pwd)"
```

Run the last command from this directory. Rebuild and reload Harness after editing.
Do not install both a linked copy and a GitHub copy under competing package names.

## Use

1. Open the conversation you want to send screenshots to.
2. Click **Annotate**. Click a highlighted element, or hold the primary button
   and drag a visible rectangle in any direction. There is no mode switch.
   In Desktop Browser, start the gesture inside the page.
3. Wait for the region screenshot, enter a comment and click **Add**. Repeat for
   other elements or regions; both kinds can be mixed in the same submission.
4. Click a numbered pin to edit/delete its comment.
5. Click **Send** to submit the annotations to the current conversation.

**Esc** cancels a drag first, then dismisses the current editor, or leaves
annotation mode if neither is open. Movement below 4 CSS pixels counts as an
element click. At 4 CSS pixels of movement, the gesture becomes a region selection.
A region smaller than 4 CSS pixels in either dimension is discarded; a cancelled
or too-thin drag never falls back to selecting an element. Pointer cancellation, loss of capture, window blur, scroll
or resize cancels an unfinished drag. **Close** clears pending annotations.
Finish or discard annotations before
switching conversations. Opening annotation mode again after a guest navigation
reinstalls its page selection overlay. Saved region images do not change after
scrolling: their stale outlines disappear, and numbered buttons in the toolbar
keep their comments available for editing or deletion.

## Requirements and limitations

- Requires the Harness Web client, including `slots`, `locale`, `conversation`,
  `sessions`, `conversation.input.left`, and `shell.overlay`.
- Requires image-draft APIs `conversation.createDrafts` and `sendSession`.
  Unsupported versions show an error instead of silently sending text only.
- React is provided by Harness through its client module loader. `html-to-image`
  is bundled; no separate capture service or API key is needed.
- Desktop guest-page capture relies on Electron APIs. An ordinary browser cannot
  use those APIs; cross-origin iframe contents are not generally accessible.
- Host screenshots are DOM reconstructions, not OS screenshots. Video, protected
  content, cross-origin resources, canvas and unusual CSS may not reproduce.
  Fonts are not embedded. Selected host regions above 2.5 million CSS pixels are
  rejected; choose a smaller visible selection. Region PNGs are bounded to 1600
  pixels on their longest edge. A region cannot span both Harness and a guest page;
  select inside one surface at a time.
- **Regions** are captured immediately after release, before the comment is saved.
  A failed or invalidated region capture must be selected again; Send never silently
  recaptures different page content. Scroll, resize or navigation during capture
  cancels it. Dynamic content can still change while a screenshot is being rendered.
- **Elements** retain capture on Add and retry on Send. Keep their content visible
  until capture finishes. Guest captures reject a changed viewport or page instance;
  remove and reselect an invalidated element.
- Guest selections operate in the main document, not nested cross-origin frames.
  Newly opened guest tabs require leaving and re-entering annotation mode.
- If any screenshot fails, sending stops and the annotations stay available.
- This is an early 0.1.0 plugin. No broad Harness version/OS compatibility matrix
  or end-to-end Desktop certification is claimed.

## Privacy

There is no independent analytics backend. Pressing **Send** submits selected
screenshots, comments and element labels/selectors through Harness to the chosen
conversation and its configured model provider. They may contain private page
content. Inspect selections and avoid passwords, tokens and other secrets.
Host region capture reconstructs the document locally before cropping; only the
selected crop is submitted. DOM rendering may request images/styles from the page,
including resources outside the selected rectangle.
Guest-page metadata is untrusted page content, not instructions to the assistant.

## Development and verification

Node.js 22+ is recommended for development. The committed lockfile pins build
packages. The runtime artifact is `client.js`, loaded via `window.__ModuleLoader__`.

```sh
npm ci
npm run check
npm pack --dry-run
```

The automated tests cover geometry validation, reversed/clipped drags, pointer
cancellation, raster coordinate conversion, mixed prompt formatting, guest script
parsing and package entry points. They are not a real Harness UI test.

Optional Chromium integration checks exercise the actual React overlay, host DOM
crops (including scrolling and fixed content), guest scripts, scaled guest geometry,
and ordered PNG attachments through a mocked conversation service. Install test
tools outside this checkout, then run:

```sh
npm install --prefix /tmp/annotate-test-tools playwright react react-dom
/tmp/annotate-test-tools/node_modules/.bin/playwright install chromium
NODE_PATH=/tmp/annotate-test-tools/node_modules node test/browser.cjs
```

`CHROMIUM_EXECUTABLE` can select an already installed Chromium. PNG evidence is
written to a fresh OS temporary directory. The Chromium guest bridge simulates
Electron APIs; it does not certify every Desktop version.

The optional native test runs a separate Electron app with its own temporary
profile and a local test page. It checks actual `webview.executeJavaScript` and
`capturePage` at 100%, 150% and 200% zoom, including PNG edge pixels:

```sh
npm install --prefix /tmp/annotate-test-tools electron@44.7.0
NODE_PATH=/tmp/annotate-test-tools/node_modules node test/electron.cjs
```

It briefly opens a test window and closes it afterward. The user's Harness sessions
are not connected to this test. Before a release, verify in Harness:
selection, Add/edit/delete, multiple screenshots, Send, failed capture, Esc/Close,
reopening the overlay, guest navigation, and switching conversations. Do not use
real secrets in screenshots or send to an unrelated conversation during testing.

## Files

- `src/client.cjs`: UI, capture and conversation integration.
- `src/guest.cjs`: Browser-panel guest selection scripts.
- `src/lib.cjs`: formatting/selector/data-URL helpers.
- `src/region.cjs`: shared pointer selection and validated geometry.
- `src/capture.cjs`: host snapshots and raster cropping for both surfaces.
- `client.js`: committed build output.
- `index.js`: empty Host plugin.
- `cordis.patch.yml`: bundle registration.
- `test/`: Node test runner checks.
- `THIRD_PARTY_NOTICES.md`: bundled html-to-image MIT notice.

## Harness references

- [Architecture, profiles and Desktop](https://github.com/deepseek-ai/deepseek-harness/blob/master/docs/architecture.md)
- [Plugin Manager and supported install sources](https://github.com/deepseek-ai/deepseek-harness/blob/master/packages/boot/plugin-manager/README.md)

GitHub installs are suitable for an early plugin. An npm release is optional and
helps later with discoverability and registry-based version updates in Plugin
Manager. This repository does not publish to npm automatically.
