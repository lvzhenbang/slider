import defaults from '../config/defaults';
import version from '../config/version';

import inBrowser from './utils/inBrowser';

class Slider {
  constructor(el, opt) {
    this.tracker = el;
    this.options = {
      ...defaults,
      ...opt,
    };
    this.thumb = this.tracker.querySelector('.thumb');
    this.thubmPosition = this.getThumbPosition();
    this.value = this.initValue();
    this.offset = this.getOffset();
    this.opening = false;
    this.init();
    this.version = version;
  }

  init() {
    this.setThumbStyle();
    this.tracker.addEventListener('mousedown', this.setThumbStyle.bind(this));

    this.thumb.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.thumb.addEventListener('mousemove', this.setThumbStyle.bind(this));
    });

    this.thumb.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.thumb.removeEventListener('mousemove', this.setThumbStyle.bind(this));
    });
  }

  getThumbPosition() {
    const thumbRect = this.thumb.getBoundingClientRect();

    return thumbRect.left + thumbRect.width / 2;
  }

  setThumbStyle(e) {
    if (e) {
      e.preventDefault();
      this.setOffset(e.pageX);
    }
    this.thumb.style.transform = `translateX(${this.offset}px)`;
    const currentValue = this.getValue();
console.log(currentValue)
  }

  getOffset() {
    return (this.value - this.options.range.min)
     * this.tracker.offsetWidth
     / (this.options.range.max - this.options.range.min);
  }

  setOffset(target) {
    const targetPosition = target;
    const distance = (targetPosition > this.thubmPosition) ? (targetPosition - this.thubmPosition) : 0;
    this.offset = distance > this.tracker.offsetWidth ? this.tracker.offsetWidth : distance;
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
    const percentOffset = (this.getThumbPosition() - trackerRect.left) / trackerRect.width;
    return this.options.range.min
      + (this.options.range.max - this.options.range.min) * percentOffset;
  }
}

if (inBrowser) {
  window.Slider = Slider;
  window.console.log('plugin is running browser.');
}

export default Slider;