import {
  readUrls,
  getURLBase64,
  makeDataURL,
  getWidth,
  getHeight
} from './helpers';

export default class ShotJS {
  constructor(opts) {
    this.fonts = null;
    this.backgroundColor = (opts && opts.backgroundColor) || '#FFF';
  }

  // Initialize @font-face rules to inline
  async init() {
    const sheets = [...document.styleSheets];
    const rules = sheets.reduce((rules, sheet) => {
      return [
        ...rules,
        ...[...sheet.cssRules]
          .filter(rule => (rule.type === CSSRule.FONT_FACE_RULE))
          .map(rule => rule.cssText)
      ];
    }, []);

    // Inline all url(...) content
    const inlinedRules = await Promise.all(rules.map(async rule => {
      const url = readUrls(rule)[0];
      const base64Content = await getURLBase64(url);
      const inlinedURL = makeDataURL(url, base64Content);
      return rule.replace(url, inlinedURL);
    }));

    this.fonts = inlinedRules.join(' ');
  }

  async renderNode(node) {
    const width = (getWidth(node) + 1) * window.devicePixelRatio;
    const height = (getHeight(node) + 1) * window.devicePixelRatio;
    const clone = this.visit(node);
    clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

    if (this.fonts) {
      const styleElement = document.createElement('style');
      styleElement.appendChild(document.createTextNode(this.fonts));
      clone.appendChild(styleElement);
    }

    const serializedNode = new XMLSerializer().serializeToString(clone);
    const dataURI = `data:image/svg+xml;charset=utf-8,
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <foreignObject x="0" y="0" width="100%" height="100%">
          ${serializedNode.replace(/#/g, '%23')}
        </foreignObject>
      </svg>`.replace(/\s\s+/g, '');
    const image = new Image();
    image.src = dataURI;

    return new Promise((resolve, reject) => {
      image.addEventListener('load', () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        ctx.fillStyle = this.backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0);
        resolve(canvas.toDataURL());
      });
      image.addEventListener('error', e => (
        reject(e)
      ));
    });
  }

  visit(node) {
    // Shallow clone
    const copy = node.cloneNode(false);

    if (node instanceof SVGElement) {
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    }

    if (node instanceof Element) {
      const newStyles = window.getComputedStyle(node);
      copy.style.cssText = newStyles.cssText;
      copy.style.font = newStyles.font;
    }

    [...node.childNodes].forEach(childNode => {
      const childNodeClone = this.visit(childNode);
      copy.appendChild(childNodeClone);
    });

    return copy;
  }
}
