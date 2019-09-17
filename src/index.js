import Tooltip from 'lzb-tooltip';

import defaults from '../config/defaults';
import version from '../config/version';

import inBrowser from './utils/inBrowser';
import getActions from './utils/getActions';

class Slider {
  constructor(el, opt) {
    this.tracker = el;
    this.options = {
      ...defaults,
      ...opt,
    };
    this.thumb = this.getThumb();
    this.thubmPosition = this.getThumbPosition();
    this.value = this.initValue();
    this.offset = this.getOffset();
    this.tooltip = new Tooltip(this.thumb, {
      content: this.value,
      placement: 'right',
      container: '.demo',
    });
    this.delay = 300;
    this.init();
    this.version = version;
  }

  init() {
    const setStyle = this.setThumbStyle.bind(this);
    setStyle();
    const actions = getActions();
    const startArr = actions.start.split(' ');
    const moveArr = actions.move.split(' ');
    const endArr = actions.end.split(' ');

    startArr.forEach((type, index) => {
      this.tracker.addEventListener(type, setStyle, false);
      this.tracker.addEventListener(type, (e) => {
        e.preventDefault();
        this.tracker.addEventListener(moveArr[index], setStyle, false);
      }, false);
    });

    endArr.forEach((type, index) => {
      this.tracker.addEventListener(type, (e) => {
        e.preventDefault();
        this.setThumbStyle(e);
        this.tracker.removeEventListener(moveArr[index], setStyle, false);
      }, false);
    });
  }

  getThumb() {
    if (!this.tracker) {
      throw new Error('this.el must be exsits.');
    }

    let thumbEl = this.tracker.querySelector('.thumb');
    if (!thumbEl) {
      thumbEl = document.createElement('div');
      thumbEl.classList.add('thumb');
      this.tracker.appendChild(thumbEl);
    }
    return thumbEl;
  }

  getThumbPosition() {
    const thumbRect = this.thumb.getBoundingClientRect();

    return this.options.direction
      ? thumbRect.top + thumbRect.height / 2
      : thumbRect.left + thumbRect.width / 2;
  }

  setThumbStyle(e) {
    if (e) {
      e.preventDefault();
      this.setOffset(
        this.options.direction
          ? (e.pageY || e.touches[0].pageY)
          : (e.pageX || e.touches[0].pageX),
        e.type,
      );
    }

    if (this.options.direction) {
      this.thumb.style.transform = `translateY(${this.offset}px)`;
    } else {
      this.thumb.style.transform = `translateX(${this.offset}px)`;
    }

    window.setTimeout(() => {
      const currentValue = this.getValue();
      this.tooltip.setContent(currentValue);
    }, this.delay);
  }

  getStepUnit() {
    return this.options.step
      * (this.options.direction ? this.tracker.offsetHeight : this.tracker.offsetWidth)
      / (this.options.range.max - this.options.range.min);
  }

  getStepOffset(value) {
    const stepUnit = this.getStepUnit();
    const remainder = value % stepUnit;
    return remainder > stepUnit / 2
      ? value - remainder + stepUnit : value - remainder;
  }

  getOffset() {
    const offset = (this.value - this.options.range.min)
    * (this.options.direction ? this.tracker.offsetHeight : this.tracker.offsetWidth)
    / (this.options.range.max - this.options.range.min);
    return this.getStepOffset(offset);
  }

  setOffset(target, type) {
    const targetPosition = target;
    let distance = 0;

    if (targetPosition > this.thubmPosition) {
      distance = targetPosition - this.thubmPosition;
    }

    if (this.options.direction && distance > this.tracker.offsetHeight) {
      distance = this.tracker.offsetHeight;
    }

    if (!this.options.direction && distance > this.tracker.offsetWidth) {
      distance = this.tracker.offsetWidth;
    }

    if (type === 'mousemove' || type === 'touchmove') {
      this.offset = distance;
    } else {
      this.offset = this.getStepOffset(distance, type);
    }
  }

  initValue() {
    let validValue = this.options.value;
    if (validValue < this.options.range.min) {
      validValue = this.options.range.min;
    } else if (validValue > this.options.range.max) {
      validValue = this.options.range.max;
    }

    return validValue;
  }

  getValue() {
    const trackerRect = this.tracker.getBoundingClientRect();
    const percentOffset = this.options.direction
      ? (this.getThumbPosition() - trackerRect.top) / trackerRect.height
      : (this.getThumbPosition() - trackerRect.left) / trackerRect.width;
    const returnVal = this.options.range.min
     + (this.options.range.max - this.options.range.min) * percentOffset;
    const consult = returnVal / this.options.step;
    const remainder = returnVal % this.options.step;

    return remainder > this.options.step / 2
      ? parseInt(consult + 1, 10) * this.options.step
      : parseInt(consult, 10) * this.options.step;
  }
}

if (inBrowser) {
  window.Slider = Slider;
  window.console.log('plugin is running browser.');
}

export default Slider;
