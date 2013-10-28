/** Copyright (c) 2013 Jan Nicklas Released under MIT license */

/* global define: false, jQuery: true */
/* jshint sub:true */

// RequireJS amd factory
// http://stackoverflow.com/questions/10918063/how-to-make-a-jquery-plugin-loadable-with-requirejs#answer-11890239
(function (factory) {
  'use strict';
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Run without AMD
    factory(jQuery);
  }
}(function ($) {
  'use strict';
  // src/ariaMenu.js <%= code %>
}));