## shotjs

Performant screenshots in the browser

⚡ Lightweight: **<5KB** Minifed and GZipped\
🔧 Ships as **CommonJS**, **ESModule**, and **browser** builds\
🏎 **~20ms** initialization, **<200ms** to make a screenshot

### Usage

```js
import ShotJS from 'shotjs';
const shotJS = new ShotJS({backgroundColor: '#FFF'});
await shotJS.init();
const node = document.getElementById('app');
const imageSrc = await shotJS.renderNode(node);
const img = new Image();
img.src = imageSrc;
document.body.appendChild(img);
```

### Notes

- Make sure all external stylesheets are specified with the `crossOrigin` attribute. It's necessary for accessing CSS rules at runtime.

### How this works

The target DOM node is reconstructed inside a `<canvas>` node in memory.

### Credit

Heavily influenced by [dom-to-image](https://github.com/tsayen/dom-to-image) and [ccapture.js](https://github.com/spite/ccapture.js).
