(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.Dialog = factory());
}(this, (function () { 'use strict';

  var pc = (function () {
    console.log('我是pc Component');
  });

  var h5 = (function () {
    console.log('我是h5 Component');
  });

  var index$2 = (function () {
    console.log('我是组件');
    pc();
    h5();
  });

  return index$2;

})));
