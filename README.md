## shotjs

Screenshots in the browser with useful addons

⚡ Lightweight: **<5KB** Minifed and GZipped\
🔧 Ships as **CommonJS**, **ESModule**, and **UMD** (`window.ShotJS`) builds\
🏎 **~20ms** initialization, **<200ms** to make a screenshot

### Usage

#### Basic

```js
import {renderNode} from 'shotjs';
const img = new Image();
img.src = await renderNode(document.body);
document.body.appendChild(img);
```

#### Advanced

```
import {renderNode, withFonts, withCursor, withViewport} from 'shotjs';
const img = new Image();
img.src = await renderNode(document.body, {
  backgroundColor: 'transparent',
  transforms: [withFonts, withCursor, withViewport]
});
document.body.appendChild(img);
```

### APIs

#### init `() => Promise(object)`

Performs optional pre-processing. Pass the result of this function to `renderNode` as opts.

#### renderNode `(node::HTMLElement, opts::Object) => Promise(String)`

Converts a HTMLElement `node` to a PNG DataURL.

The shape of Object `opts` is:

```
{
  backgroundColor::String,
  transforms::Array<Function>
}
```

`backgroundColor`: Defaults to `#FFF`.

`transforms`: Functions you can use to augment the snapshot. Transforms recieve an SVG node that can be modified. Transforms can be sync or async.

#### withFonts `(SVGSVGElement, opts) => Promise`

Render your screenshot with web fonts. All external stylesheets that import fonts must be specified with the `crossOrigin` attribute.

#### withCursor `(SVGSVGElement, opts) => void`

Paints a cursor at the user's cursor location when the screenshot occurred.

#### withViewport `(SVGSVGElement, opts) => void`

Limit your snapshot to the viewport (the visible portion of the webpage).

### How this works

The target DOM node is reconstructed inside a `<canvas>` node in memory.

## Development

```
npm install
npm start
```

### Credit

Heavily influenced by [dom-to-image](https://github.com/tsayen/dom-to-image) and [ccapture.js](https://github.com/spite/ccapture.js).
