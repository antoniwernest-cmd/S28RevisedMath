// Keep tablet press-and-hold on activity controls from opening a browser menu.
// This does not change the activities' existing tap, pointer, or drag handlers.
(() => {
  const selector = 'button, [role="button"], [draggable], [data-token], [data-card], .frame-dot';
  const style = document.createElement('style');
  style.textContent = `
    @media (pointer: coarse) {
      html, body { overscroll-behavior-y: none !important; }
    }
    @media (pointer: coarse) {
      :is(${selector}), :is(${selector}) * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
    }
  `;
  document.head.appendChild(style);

  document.addEventListener('contextmenu', event => {
    if ((navigator.maxTouchPoints > 0 || matchMedia('(pointer: coarse)').matches) &&
        event.target instanceof Element && event.target.closest(selector)) {
      event.preventDefault();
    }
  }, true);

  // Fallback for tablet browsers that still refresh at the top despite CSS.
  // Only cancel a downward pull when no scroll container can move upward.
  let lastTouchY = null;
  document.addEventListener('touchstart', event => {
    lastTouchY = event.touches.length === 1 ? event.touches[0].clientY : null;
  }, { capture: true, passive: true });

  document.addEventListener('touchmove', event => {
    if (lastTouchY === null || event.touches.length !== 1 || !event.cancelable) return;
    const currentY = event.touches[0].clientY;
    const movingDown = currentY > lastTouchY;
    lastTouchY = currentY;
    if (!movingDown || (document.scrollingElement?.scrollTop ?? 0) > 0) return;

    for (let node = event.target; node instanceof Element; node = node.parentElement) {
      if (node.scrollTop > 0) return;
    }
    event.preventDefault();
  }, { capture: true, passive: false });

  document.addEventListener('touchend', event => {
    if (!event.touches.length) lastTouchY = null;
  }, { capture: true, passive: true });
  document.addEventListener('touchcancel', () => { lastTouchY = null; }, { capture: true, passive: true });
})();
