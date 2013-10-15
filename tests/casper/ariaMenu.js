/* global casper: false, jQuery: false */

(function () {
  'use strict';

  /**
   * Capture a screenshot with all child elements
   *
   * @param filename
   * @param selector
   * @returns {*}
   */
  function capture(filename, selector) {
    var rect = casper.evaluate(function (selector) {
      var target = jQuery(selector),
        offset = target.offset(),
        width = target.outerWidth(),
        height = target.outerHeight();
      target.find('*:visible').filter(function () {
        return jQuery(this).css('position') === 'absolute';
      }).each(function () {
          var childOffset = jQuery(this).offset();
          var childWidth = childOffset.left - offset.left + jQuery(this).outerWidth(),
            childHeight = childOffset.top - offset.top + jQuery(this).outerHeight();
          width = Math.max(width, childWidth);
          height = Math.max(height, childHeight);
          offset.top = Math.min(offset.top, childOffset.top);
          offset.left = Math.min(offset.left, childOffset.left);
        });
      offset.width = width;
      offset.height = height;
      return offset;
    }, selector);
    return casper.capture(filename, rect);
  }


  casper
    .start('http://localhost:' + casper.cli.options.port)
    .viewport(1024, 768)

  /**
   * Basic tests to assert that the module was executed
   */
    .then(function () {
      // Test web server connection
      this.test.assertTitle('CSS Dropdown Menus', 'Make sure the title is set');

      // Test if the plugin was load
      var type = this.evaluate(function () {
        return typeof jQuery.fn.ariaMenu;
      });
      this.test.assertEqual(type, 'function', 'Plugin exists');

      // Test if the css-fallback class was removed
      this.test.assertEval(function () {
        return jQuery('.css-fallback').length === 0;
      }, 'CSS-fallback was deactivated');

    })

  /**
   * Focus the first element with javascript
   */
    .then(function () {
      capture('screenshots/closed.png', '.aria-menu');
      this.evaluate(function () {
        jQuery('.aria-menu a:visible:first').focus();
      });
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Home');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'About');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'The Company');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'The Team');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Services');
      });
    })

  /**
   * Press {right-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Right);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Products');
      });
    })

  /**
   * Press {left-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Left);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Services');
      });
    })

  /**
   * Press {down-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Four');
      });
    })

  /**
   * Press {up-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Up);
      this.page.sendEvent('keypress', this.page.event.key.Up);
      this.page.sendEvent('keypress', this.page.event.key.Up);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'One Service');
      });
    })

  /**
   * Press {up-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Up);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Services');
      });
    })

    .run(function () {
      this.test.done();
    });
}());