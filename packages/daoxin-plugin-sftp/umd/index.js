;(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : ((global = typeof globalThis !== 'undefined' ? globalThis : global || self),
      (global['daoxin-plugin-sftp'] = factory()))
})(this, function () {
  'use strict'

  var index = {
    name: 'daoxin-plugin-sftp',
    version: '0.0.1'
  }

  return index
})
