export function getURLBase64(url) {
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

function px(node, styleProperty) {
  const value = window.getComputedStyle(node).getPropertyValue(styleProperty);
  return parseFloat(value.replace('px', ''));
}

export function getWidth(node) {
  const leftBorder = px(node, 'border-left-width');
  const rightBorder = px(node, 'border-right-width');
  return node.scrollWidth + leftBorder + rightBorder;
}

export function getHeight(node) {
  const topBorder = px(node, 'border-top-width');
  const bottomBorder = px(node, 'border-bottom-width');
  return node.scrollHeight + topBorder + bottomBorder;
}

export function readUrls(string) {
  const URL_REGEX = /url\(['"]?([^'"]+?)['"]?\)/g;
  const result = [];
  let match;
  while ((match = URL_REGEX.exec(string)) !== null) {
    result.push(match[1]);
  }
  return result;
}

export function makeDataURL(url, base64Data) {
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
