import React from 'react';
import ReactDOM from 'react-dom';
import {renderNode, withViewport, withCursor, withFonts} from '../src';

const appNode = document.createElement('div');
appNode.setAttribute('id', 'app');
document.body.append(appNode);

const App = () => (
  <div style={{height: '200vh', width: '200vw', background: 'linear-gradient(to bottom, #000000 0%, #ffffff 100%)'}}>
    <h1 style={{color: 'red'}}>Shot.js Example</h1>
    <button type="button" onClick={renderImage}>Capture Image</button>
  </div>
);

ReactDOM.render(<App/>, appNode);

async function renderImage() {
  const node = document.getElementById('app');
  const p0 = performance.now();
  const result = await renderNode(node, {
    transforms: [
      withViewport,
      withCursor,
      withFonts
    ]
  });
  const p1 = performance.now();
  console.log('p1 - p0', p1 - p0);
  const img = new Image();
  img.src = result;
  img.style.maxWidth = '100%';
  document.body.innerHTML = '';
  document.body.appendChild(img);
  window.scrollTo(0, 0);
}
