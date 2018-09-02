/*
 * This function inspects all stylesheets, grabs all @font-face
 * rules, and replaces all url(...) references with a Data URL:
 * a serialized, base-64 encoded version of the font.
 *
 * E.g.,
 *
 * @font-face {
 *  font-family: 'Roboto';
 *  src: url(https://fonts.gstatic.com/.../Roboto.woff2)
 * }
 *
 * =>
 *
 * @font-face {
 *   font-family: 'Roboto';
 *   src: url(data:application/font-woff;base64,...base64serialization...)
 * }
 */
export default async function () {
  const sheets = [...document.styleSheets];
  const rules = sheets.reduce((fontFaceRules, sheet) => {
    let cssRules;
    try {
      cssRules = sheet.cssRules;
    } catch (e) {
      return fontFaceRules;
    }
    return [
      ...fontFaceRules,
      ...[...cssRules]
        .filter(rule => (rule.type === CSSRule.FONT_FACE_RULE))
        .map(rule => rule.cssText)
    ];
  }, []);

  const inlinedRules = await Promise.all(
    rules.map(async rule => {
      const urls = readUrls(rule);
      const urlsBase64 = await Promise.all(
        urls.map(async url => (
          getURLBase64(url)
        ))
      );

      let newRule = rule;

      urls.forEach((url, index) => {
        const dataURL = makeDataURL(url, urlsBase64[index]);
        newRule = newRule.replace(url, dataURL);
      });
      return newRule;
    })
  );

  return inlinedRules.join(' ');
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
