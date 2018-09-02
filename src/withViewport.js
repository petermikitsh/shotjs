export default svg => {
  const height = window.innerHeight * window.devicePixelRatio;
  const width = window.innerWidth * window.devicePixelRatio;

  svg.setAttribute('height', height);
  svg.setAttribute('width', width);

  const {scrollX, scrollY} = window;
  const root = svg.childNodes[0].childNodes[0];

  if (scrollX || scrollY) {
    root.style.cssText = `${root.style.cssText} position: fixed;`;
  }

  if (scrollX) {
    root.style.cssText = `${root.style.cssText} left: -${scrollX}px;`;
  }

  if (scrollY) {
    root.style.cssText = `${root.style.cssText} top: -${scrollY}px;`;
  }
};
