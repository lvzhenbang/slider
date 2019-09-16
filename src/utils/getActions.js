function getActions() {
  if (window.navigator.pointerEnabled) {
    return {
      start: 'pointerdown',
      move: 'pointermove',
      end: 'pointerup',
    };
  }

  if (window.navigator.msPointerEnabled) {
    return {
      start: 'MSPointerDown',
      move: 'MSPointerMove',
      end: 'MSPointerUp',
    };
  }

  return {
    start: 'mousedown touchstart',
    move: 'mousemove touchmove',
    end: 'mouseup touchend',
  };
}

export default getActions;
