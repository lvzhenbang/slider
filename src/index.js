import Tooltip from 'lzb-tooltip';

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
    this.tooltip = new Tooltip(this.thumb, {
      content: this.value,
      placement: 'right',
      container: '.demo',
    });
    this.init();
    this.version = version;
  }

  init() {
    const setStyle = this.setThumbStyle.bind(this);
    setStyle();
    this.tracker.addEventListener('mousedown', setStyle, false);
    this.tracker.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.tracker.addEventListener('mousemove', setStyle, false);
    }, false);

    this.tracker.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.tracker.removeEventListener('mousemove', setStyle, false);
    }, false);
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
    this.tooltip.setContent(currentValue);
  }

  getStepUnit() {
    return this.options.step * this.tracker.offsetWidth
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
    * this.tracker.offsetWidth
    / (this.options.range.max - this.options.range.min);
    return this.getStepOffset(offset);
  }

  setOffset(target) {
    const targetPosition = target;
    let distance = 0;

    if (targetPosition > this.thubmPosition) {
      distance = targetPosition - this.thubmPosition;
    }

    if (distance > this.tracker.offsetWidth) {
      distance = this.tracker.offsetWidth;
    }

    this.offset = this.getStepOffset(distance);
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
