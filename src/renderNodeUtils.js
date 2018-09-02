function px(style, styleProperty) {
  const value = style.getPropertyValue(styleProperty);
  return parseFloat(value.replace('px', ''));
}

export function getDimensions(node) {
  const style = window.getComputedStyle(node);
  const leftBorder = px(style, 'border-left-width');
  const rightBorder = px(style, 'border-right-width');
  const topBorder = px(style, 'border-top-width');
  const bottomBorder = px(style, 'border-bottom-width');
  return {
    width: node.scrollWidth + leftBorder + rightBorder,
    height: node.scrollHeight + topBorder + bottomBorder
  };
}

export function visit(node) {
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
    const childNodeClone = visit(childNode);
    copy.appendChild(childNodeClone);
  });

  return copy;
}
