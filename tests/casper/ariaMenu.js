/* global casper: false, jQuery: false */

(function () {
  'use strict';

  var base_url = 'http://localhost:' + casper.cli.options.port;

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
    .start(base_url + "/tests/")
    .viewport(1024, 768)

  /**
   * Basic tests to assert that the module was executed
   */
    .then(function () {
      // Test web server connection
      this.test.assertTitle('Automated test page', 'Make sure the title is set');

      // Test if the plugin was load
      var type = this.evaluate(function () {
        return typeof jQuery.fn.ariaMenu;
      });
      this.test.assertEqual(type, 'function', 'Plugin exists');

      // Test if the css-fallback class was removed
      this.test.assertEval(function () {
        return jQuery('.css-fallback').length === 0;
      }, 'CSS-fallback was removed');

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
        this.test.assertSelectorHasText('.menuitem-focus', 'Home', 'Third parties can focus a listElement using jQuery.focus()');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'About', 'Siblings are accessible by using the TAB key');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'The Company', 'Children are accessible by using the TAB key');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'The Team', 'Siblings of sub menus are accessible by using the TAB key');
      });
    })

  /**
   * Press {tab} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Services', 'Pressing the TAB key while focusing the last listElement will focus the very next parent list element');
      });
    })

  /**
   * Press {right-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Right);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Products', 'The RIGHT ARROW key sets focus to the correct element');
      });
    })

  /**
   * Press {left-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Left);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Services', 'The LEFT ARROW key sets focus to the correct element');
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
        this.test.assertSelectorHasText('.menuitem-focus', 'Four', 'The DOWN ARROW key sets focus to the correct element');
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
        this.test.assertSelectorHasText('.menuitem-focus', 'One Service', 'The UP ARROW key sets focus to the correct element');
      });
    })

  /**
   * Press {up-arrow} and assert that the correct element is focused
   */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Up);
      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Services', 'A sub menu can be left using the ARROW keys');
      });
    })


    /**
     * Press {tab} and assert that the correct element is focused
     */
    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Tab);
    })

    /* Capture screenshot for the readme preview */
    .then(function () {
      this.wait(250, function () {
        capture('screenshots/preview.png', '.aria-menu');
      });
    })


    /* Responsive tests */
    .thenOpen(base_url + '/tests/', function () {
      this.evaluate(function () {
        jQuery('.aria-menu a:visible:first').focus();
      });
      this.wait(150, function () {
        capture('screenshots/responsive.png', '.aria-menu');
      });
    })

    /* Test third level navigation */
    .then(function(){
      this.page.sendEvent('keypress', this.page.event.key.Right);
      this.page.sendEvent('keypress', this.page.event.key.Right);
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.page.sendEvent('keypress', this.page.event.key.Down);
      this.page.sendEvent('keypress', this.page.event.key.Right);

      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Setup', 'The third navigation level can be reached using ARROW keys');
      });
    })

    /* Scale down */
    .then(function(){
      this.viewport(450, 600);
      this.wait(250, function () {
        capture('screenshots/responsive.png', '.aria-menu');
      });
    })


    .then(function () {
      this.page.sendEvent('keypress', this.page.event.key.Left);
      this.page.sendEvent('keypress', this.page.event.key.Backtab);

      this.wait(150, function () {
        capture('screenshots/focus-test.png', '.aria-menu');
        this.test.assertSelectorHasText('.menuitem-focus', 'Two Service', 'The menu works also with media queries');
      });
    })

    .run(function () {
      this.test.done();
    });
}());