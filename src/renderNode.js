import {getDimensions, visit} from './renderNodeUtils';

export default renderNode;

const XMLNS = 'http://www.w3.org/1999/xhtml';
const SVGNS = 'http://www.w3.org/2000/svg';

async function renderNode(node, opts) {
  const size = getDimensions(node);
  const width = size.width * window.devicePixelRatio;
  const height = size.height * window.devicePixelRatio;
  const clone = visit(node);
  clone.setAttribute('xmlns', XMLNS);

  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('height', height);
  svg.setAttribute('width', width);
  const foreignObject = document.createElementNS(SVGNS, 'foreignObject');
  foreignObject.setAttribute('x', 0);
  foreignObject.setAttribute('y', 0);
  foreignObject.setAttribute('width', '100%');
  foreignObject.setAttribute('height', '100%');
  foreignObject.appendChild(clone);
  svg.appendChild(foreignObject);

  const transforms = (opts && opts.transforms) || [];

  await Promise.all(
    transforms.map(
      async transform => (
        transform(svg, opts)
      )
    )
  );

  const serialized = new XMLSerializer()
    .serializeToString(svg)
    .replace(/#/g, '%23');
  const dataURI = `data:image/svg+xml;charset=utf-8,${serialized}`;
  const image = new Image();
  image.src = dataURI;

  return new Promise((resolve, reject) => {
    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');
      const svgWidth = parseInt(svg.getAttribute('width'), 10);
      const svgHeight = parseInt(svg.getAttribute('height'), 10);
      canvas.width = svgWidth;
      canvas.height = svgHeight;
      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.fillStyle = (opts && opts.backgroundColor) || '#FFF';
      ctx.fillRect(0, 0, parseInt(svgWidth, 10), parseInt(svgHeight, 10));
      ctx.drawImage(image, 0, 0);
      resolve(canvas.toDataURL());
    });
    image.addEventListener('error', e => (
      reject(e)
    ));
  });
}
