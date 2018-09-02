import getFonts from './withFontsUtils';

let fonts;

(async () => {
  fonts = await getFonts();
})();

export default async svg => {
  if (!fonts) {
    fonts = await getFonts();
  }

  const styleElement = document.createElement('style');
  styleElement.appendChild(document.createTextNode(fonts));
  svg.appendChild(styleElement);
};
