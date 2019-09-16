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
    start: 'touchstart',
    move: 'touchmove',
    end: 'touchend',
  };
}

export default getActions;
