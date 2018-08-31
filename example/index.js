import React from 'react';
import ReactDOM from 'react-dom';

const appNode = document.createElement('div');
appNode.setAttribute('id', 'app');
document.body.append(appNode);

const App = () => (
  <div style={{backgroundColor: '#ff0'}}>
    <h1 style={{color: 'red'}}>Shot.js Example</h1>
  </div>
);

ReactDOM.render(<App/>, appNode, done);

async function fonts() {
  function getFontFaceRules(stylesheets) {
    return stylesheets.reduce((rules, stylesheet) => {
      const fontFaceRules = [...stylesheet.cssRules].filter(rule => (
        rule.type === CSSRule.FONT_FACE_RULE
      ));
      return [...rules, ...fontFaceRules];
    }, []);
  }
  const cssFontFaceRules = getFontFaceRules([...document.styleSheets]);

  // Array of @font-face { ... }
  const rules = cssFontFaceRules.map(rule => rule.cssText);

  // Inline all url(...) content
  const result = await Promise.all(rules.map(async rule => {
    const url = readUrls(rule)[0];
    const urlContent = await get(url);
    const inlinedURL = makeDataURL(url, urlContent);
    return rule.replace(url, inlinedURL);
  }));

  return result.join(' ');
}

function readUrls(string) {
  const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;
  const result = [];
  let match;
  while ((match = URL_REGEX.exec(string)) !== null) {
    result.push(match[1]);
  }
  return result;
}

function makeDataURL(url, base64Data) {
  const WOFF = 'application/font-woff';
  const JPEG = 'image/jpeg';
  const mimes = {
    woff: WOFF,
    woff2: WOFF,
    ttf: 'application/font-truetype',
    eot: 'application/vnd.ms-fontobject',
    png: 'image/png',
    jpg: JPEG,
    jpeg: JPEG,
    gif: 'image/gif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml'
  };

  const match = /\.([^./]*?)$/g.exec(url);
  let mimeType = '';

  if (match) {
    const extension = match[1].toLowerCase();
    mimeType = mimes[extension];
  }

  return `data:${mimeType};base64,${base64Data}`;
}

function get(url) {
  return new Promise((resolve => {
    const request = new XMLHttpRequest();

    request.onreadystatechange = done;
    request.responseType = 'blob';
    request.open('GET', url, true);
    request.send();

    function done() {
      if (request.readyState !== 4) {
        return;
      }

      if (request.status !== 200) {
        return;
      }

      const encoder = new FileReader();
      encoder.onloadend = function () {
        const content = encoder.result.split(/,/)[1];
        resolve(content);
      };
      encoder.readAsDataURL(request.response);
    }
  }));
}

function getWidth(node) {
  const leftBorder = px(node, 'border-left-width');
  const rightBorder = px(node, 'border-right-width');
  return node.scrollWidth + leftBorder + rightBorder;
}

function getHeight(node) {
  const topBorder = px(node, 'border-top-width');
  const bottomBorder = px(node, 'border-bottom-width');
  return node.scrollHeight + topBorder + bottomBorder;
}

function px(node, styleProperty) {
  const value = window.getComputedStyle(node).getPropertyValue(styleProperty);
  return parseFloat(value.replace('px', ''));
}

async function toURI(node) {
  const width = (getWidth(node) + 1) * window.devicePixelRatio;
  const height = (getHeight(node) + 1) * window.devicePixelRatio;
  const clone = visit(node);

  // Add css to clone
  const doc = document.implementation.createHTMLDocument('');
  const styleElement = document.createElement('style');
  styleElement.appendChild(document.createTextNode(await fonts()));
  doc.body.appendChild(styleElement);
  clone.appendChild(styleElement);

  const serializedNode = new XMLSerializer().serializeToString(clone);
  const dataURI = `data:image/svg+xml;charset=utf-8,
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject x="0" y="0" width="100%" height="100%">
        ${serializedNode}
      </foreignObject>
    </svg>`.replace(/\s\s+/g, '');
  const image = new Image();
  image.src = dataURI;

  return new Promise(resolve => {
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(image, 0, 0);
      resolve(canvas.toDataURL());
    });
  });
}

function visit(node) {
  // Shallow clone
  const copy = node.cloneNode(false);

  if (node instanceof Element) {
    const newStyles = window.getComputedStyle(node);
    copy.style.cssText = newStyles.cssText;
    copy.style.font = newStyles.font;
  }

  // Visit all of this node's children.
  if (node.childNodes.length > 0) {
    [...node.childNodes].forEach(childNode => {
      const childNodeClone = visit(childNode);
      copy.appendChild(childNodeClone);
    });
  }

  return copy;
}

function done() {
  toURI(document.getElementById('app'))
    .then(result => {
      const img = new Image();
      img.src = result;
      img.style.maxWidth = '100%';
      document.body.appendChild(img);
    });
}
