import React from 'react';
import ReactDOM from 'react-dom';
import ShotJS from '../src';

const appNode = document.createElement('div');
appNode.setAttribute('id', 'app');
document.body.append(appNode);

const App = () => (
  <div style={{backgroundColor: '#ff0'}}>
    <h1 style={{color: 'red'}}>Shot.js Example</h1>
  </div>
);

ReactDOM.render(<App/>, appNode, postRender);

async function postRender() {
  const shotJS = new ShotJS();
  await shotJS.init();
  const result = await shotJS.renderNode(document.getElementById('app'));
  const img = new Image();
  img.src = result;
  img.style.maxWidth = '100%';
  document.body.appendChild(img);
}
