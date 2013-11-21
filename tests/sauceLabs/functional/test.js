/* global define:false, console:false */
/* functional testing
 * @see https://github.com/theintern/intern/blob/master/tests/functional/basic.js
 */
define([
  'intern!object',
  'intern/chai!assert',
  'dojo/node!wd',
  'require'
], function (registerSuite, assert, wd, require) {
  'use strict';

  var selectors = {
    menu: function () {
      return 'ul.aria-menu';
    },
    listItem: function (index) {
      var indexes = Array.prototype.slice.call(arguments);
      var selector = '.aria-menu > li:nth-child(' + indexes[0] + ')';
      for (var i = 1; i < indexes.length; i++) {
        selector += ' > ul > li:nth-child(' + indexes[i] + ')';
      }
      return selector;
    },
    listItemSubMenu: function (index) {
      return selectors.listItem.apply(this, arguments) + " > ul";
    },
    focusedListItem: function (index) {
      return selectors.listItem.apply(this, arguments) + ".menuitem-focus";
    },
    listItemLink: function (index) {
      return selectors.listItem.apply(this, arguments) + " > a";
    },
    focusedListItemLink: function () {
      return selectors.focusedListItem.apply(this, arguments) + " > a";
    }
  };

  var asserts = {
    activeText: function (promisedWebDriver, text, description) {
      return function () {
        return promisedWebDriver
          .active()
          .text()
          .then(function (linkText) {
            assert.equal(linkText, text, description);
          })
          .end();
      };
    }
  };

  /**
   * Log helper
   *
   * @param msg
   * @returns {Function}
   */
  function log(msg) {
    return function () {
      console.log(msg);
    };
  }

  /**
   * Click an element
   *
   * @param promisedWebDriver
   * @param selector
   */
  function clickAtSelector(promisedWebDriver, selector) {
    return function () {
      return promisedWebDriver
        .elementByCss(selector)
        .click()
        .end();
    };
  }

  /**
   * Close the browser and update the SauceLabs job status
   * Usage:
   * promisedWebDriver.always(shutdown(promisedWebDriver));
   */
  function shutdown(promisedWebDriver, dfd) {
    return function (err) {
      console.log("Shutting down");
      promisedWebDriver.sauceJobStatus(err === undefined);
      promisedWebDriver.quit();
      if (err) {
        dfd.resolve();
        if (err && err.message) {
          console.log(err.message);
        }
      } else {
        dfd.reject();
      }
      // Log JAVA trace
      if (err && err.cause && err.cause.value && err.cause.value.stackTrace) {
        var trace = err.cause.value.stackTrace;
        var classNames = [];
        for (var i = 0; i < trace.length; i++) {
          var className = trace[i].className;
          if (!className.match(/^(java|sun)/)) {
            classNames.push(className);
          }
        }
        console.log("Trace:" + "\n" + classNames.join("\n"));
      }
      assert.equal(err, undefined);
    };
  }

  var tests = {
    'touch': function (promisedWebDriver) {
      var baseUrl = "";
      // Run the test
      return promisedWebDriver
        .then(log("Touch test"))
        .get(require.toUrl('test.html'))
        .url()
        .then(function (url) {
          baseUrl = url;
        })
        // Wait for initialization
        .then(log('Wait for menu to load'))
        .waitForElementByCss(selectors.menu())

        .then(log('Click at "Services" and wait'))
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 3)))
        .wait(150)

        .then(log('Validate url'))
        .url()
        .then(function (url) {
          assert.equal(baseUrl, url, "No new page was opened");
        })
        .waitForVisibleByCss(selectors.listItemSubMenu(1, 3))

        // Move to a sub menu element
        .then(log('Click at "Three Service" and wait'))
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 3, 3)))
        .waitForVisibleByCss(selectors.listItemSubMenu(1, 3, 3))

        .then(log('Test if the focus was set correctly'))
        .then(asserts.activeText(promisedWebDriver, "Three Service", "Correct link was focused"))

        .then(log('Reopen the page'))
        .get(require.toUrl('test.html'))

        // Click through the menu
        .then(log('Click at an open menu point'))
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 3)))
        .waitForVisibleByCss(selectors.listItemSubMenu(1, 3))
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 3, 3)))
        .waitForVisibleByCss(selectors.listItemSubMenu(1, 3, 3))
        .wait(400)
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 3, 3)))

        // Wait for the new page to open
        .wait(150)
        .waitForElementByCss(selectors.menu())
        .url()
        .then(function (url) {
          assert.equal(baseUrl + "?three", url, "The new page was opened");
          console.log(url);
        });

    },

    'mouse': function (promisedWebDriver) {
      // Run the test
      return promisedWebDriver
        .then(log("Mouse test"))
        .get(require.toUrl('test.html'))
        // Wait for initialization
        .waitForElementByCss(selectors.menu())
        .sleep(150)
        // Set focus
        .then(log("Fix Firefox focus bug"))
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 1)))
        .sleep(150)
        .waitForElementByCss(selectors.menu())
        .then(log('Hover over "Services"'))
        .elementByCss(selectors.listItemLink(1, 3))
        .moveTo(5, 5)
        .end()
        // Wait for the menu to set the proper class on hover
        .waitForVisibleByCss(selectors.listItemLink(1, 3, 3))
        .sleep(150)
        .then(log('Hover over "Three Service"'))
        .elementByCss(selectors.listItemLink(1, 3, 3))
        .moveTo(5, 5)
        .end()
        // Wait for the menu to set the proper class on hover
        .waitForVisibleByCss(selectors.focusedListItemLink(1, 3, 3))
        .sleep(150)
        .then(log('Hover over "Setup"'))
        // Wait for the menu to set the proper class on hover
        .elementByCss(selectors.listItemLink(1, 3, 3, 1))
        .moveTo(5, 5)
        .end()
        // Wait for the menu to set the proper class on hover
        .waitForVisibleByCss(selectors.focusedListItemLink(1, 3, 3, 1))
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Setup", "Correct link was focused"));
    },

    'keyboard': function (promisedWebDriver) {
      // Run the test
      return promisedWebDriver
        .then(log("Keyboard test"))
        .get(require.toUrl('test.html'))
        // Wait for initialization
        .waitForElementByCss(selectors.menu())
        .sleep(150)
        // Set focus
        .then(log("Fix Firefox focus bug"))
        .then(clickAtSelector(promisedWebDriver, selectors.listItemLink(1, 1)))
        .sleep(150)
        .waitForElementByCss(selectors.menu())
        .then(log('Hover over "Services"'))
        .elementByCss(selectors.listItemLink(1, 3))
        .moveTo(5, 5)
        .end()
        // Wait for the menu to set the proper class on hover
        .waitForVisibleByCss(selectors.listItemLink(1, 3, 3))
        .sleep(150)
        .then(log('Tab to "Three Service"'))
        .keys(wd.SPECIAL_KEYS.Tab)
        .keys(wd.SPECIAL_KEYS.Tab)
        .keys(wd.SPECIAL_KEYS.Tab)
        // Verify that three service was selected
        .then(asserts.activeText(promisedWebDriver, "Three Service", "Correct link was focused after tabbing"))

        // Wait for the menu to set the proper class on hover
        .waitForVisibleByCss(selectors.focusedListItemLink(1, 3, 3))
        .sleep(150)
        .then(log('Tab to "Setup"'))
        .keys(wd.SPECIAL_KEYS.Tab)

        .waitForVisibleByCss(selectors.focusedListItemLink(1, 3, 3, 1))
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Setup", "Correct link was focused after tabbing"))

        // Backtab
        .then(log('Back tab to "Three Service"'))
        .keys(wd.SPECIAL_KEYS.Shift + wd.SPECIAL_KEYS.Tab)
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Three Service", "Correct link was focused after back tabbing"))

        // Arrow Right
        .then(log('Arrow key to "Setup"'))
        .keys(wd.SPECIAL_KEYS['Right arrow'])
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Setup", "Correct link was focused after pressing the right arrow key"))

        // Arrow Right
        .then(log('Arrow key to "Three Service"'))
        .keys(wd.SPECIAL_KEYS['Left arrow'])
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Three Service", "Correct link was focused after pressing the left arrow key"))

        // Arrow Right
        .then(log('Arrow key to "Two Service"'))
        .keys(wd.SPECIAL_KEYS['Up arrow'])
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Two Service", "Correct link was focused after pressing the up arrow key"))

        // Arrow Right
        .then(log('Arrow key to "Three Service"'))
        .keys(wd.SPECIAL_KEYS['Down arrow'])
        .sleep(150)
        .then(asserts.activeText(promisedWebDriver, "Three Service", "Correct link was focused after pressing the down arrow key"))

        // Close menu
        .keys(wd.SPECIAL_KEYS.Escape);
    }
  };

  // Register the suite
  registerSuite({
    name: 'menu',
    'aria-menu-test': function () {
      // wd is a node.js Webdriver/Selenium 2 client
      // @see https://github.com/admc/wd/blob/master/doc/api.md
      // @see https://github.com/theintern/intern/blob/master/lib/wd.js
      // @param {PromisedWebDriver} promisedWebDriver
      var promisedWebDriver = this.remote;
      // .then() can only be called after a promise to prevent this
      // test from crashing a sleep promise is created:
      promisedWebDriver.sleep(1);
      // Start testing
      var tags = promisedWebDriver._desiredEnvironment.tags;
      for (var i = 0; i < tags.length; i++) {
        if (tests[tags[i]] !== undefined) {
          promisedWebDriver.then(log('Start test for tag: "' + tags[i] + '"'));
          tests[tags[i]](promisedWebDriver);
        }
      }
      // Shutdown
      return promisedWebDriver
        .then(log('Shutdown'))
        .always(shutdown(promisedWebDriver, this.async(60000)));
    }
  });
});