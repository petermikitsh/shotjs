let x;
let y;

function update(e) {
  x = e.clientX;
  y = e.clientY;
}

function updateTouch(e) {
  x = e.touches[0].clientX;
  y = e.touches[0].clientY;
}

document.addEventListener('mousemove', update, false);
document.addEventListener('mousedown', update, false);
document.addEventListener('touchmove', updateTouch, false);
document.addEventListener('touchstart', updateTouch, false);

export function unregister() {
  document.removeEventListener('mousemove', update, false);
  document.removeEventListener('mousedown', update, false);
  document.removeEventListener('touchmove', updateTouch, false);
  document.removeEventListener('touchstart', updateTouch, false);
}

export default function cursorPosition() {
  return {
    x,
    y
  };
}
