/* global jQuery: true */
/* jshint sub:true */
(function ($) {
  'use strict';
  //
  /**
   * Returns true if the browser supports touch events
   *
   * @return {boolean}
   */
  function supportsTouch() {
    return 'ontouchstart' in window || 'onmsgesturechange' in window;
  }

  /**
   * The menu class
   *
   * @param {HTMLElement} item
   * @param {Array} [options]
   * @constructor
   */
  function AriaMenu(item, options) {
    this.settings = $.extend(this.defaults, options);
    this.$elem = $(item);
    this.init();
  }

  AriaMenu.prototype = {
    /* Default settings */
    // Single quoted keys are required for the google closure compiler:
    // http://closuretools.blogspot.de/2011/01/property-by-any-other-name-part-1.html
    defaults: {
      'focusClass': 'menuitem-focus',
      'visibleMenuClass': 'show-menu',
      'closeDelay': 100
    },

    events: {

      /* Triggered if the users clicks a link */
      linkMouseClick: function () {
      },

      /* Triggered if the users touches a link */
      linkTouch: function (event) {
        // Get the links parent element
        var $touchedListElement = $(this).parent();
        // If a sub menu can be found select the current link
        if ($touchedListElement.find('>ul').length) {
          $(this).focus();
          event.preventDefault();
        }
      },

      /* Triggered if the user moves his mouse over a list item */
      listItemMouseOver: function () {
        $(this).focus();
      },

      /* Triggered if the user moves his mouse away from a list item */
      listItemMouseOut: function () {
        if ($(this).is(':focus')) {
          $(this).blur();
        }
      },
      /**
       * Triggered if a list item receives focus
       * @param {jQuery.event=} event
       * @this {HTMLElement}
       */
      listItemFocus: function (event) {
        var settings = event.data.settings;
        // Stop hiding this element (clear timeout from listItemBlur)
        debounce(this);

        // Show the sub menus
        $(this)
          .addClass(settings['focusClass'])
          .find('>ul')
          .addClass(settings['visibleMenuClass']);
      },

      /**
       * Triggered if the focus is lost
       * @param {jQuery.event=} event
       * @this {HTMLElement}
       */
      listItemBlur: function (event) {
        var settings = event.data.settings;

        // Wait for a short moment and hide the sub menus
        debounce(this, function () {
          $(this).removeClass(settings['focusClass'])
            .find('>ul')
            .removeClass(settings['visibleMenuClass']);
        }, settings['closeDelay']);
      },

      /**
       * Triggered if a key event bubbles to a root menu list item
       * @param {jQuery.event=} event
       */
      keyDown: function (event) {
        var _this = event.data;

        // Escape pressed:
        if (event.which === 27) {
          event.preventDefault();
          // Hide the menu
          _this.closeMenu();
        }
        // Arrow keys pressed:
        else if (event.which >= 37 && event.which <= 40) {
          _this.events.arrowKeyDown.apply(this, arguments);
        }
      },

      /**
       * Triggered if an arrow key event bubbles to a root menu list item
       * @param {jQuery.event=} event
       */
      arrowKeyDown: function (event) {
        var _this = event.data;

        // Usually the event target is the focused link - so we pick the
        // parent to get the active listElement
        var $focusedListElement = $(event.target).closest('li'),
        // Get the focused menu element
          $focusedMenu = $focusedListElement.closest('ul');

        // Get the sub menu (if one exists)
        var $subMenu = $focusedListElement.find('>ul');

        //  Get the parent element of the focused element (if one exists)
        var $parentListElement = ($focusedListElement[0] === this) ? $() : $focusedMenu.closest('li'),
        // Get the parent menu of the focused element (if one exists)
          $parentMenu = $parentListElement.parent();

        // Create a virtual cursor with the position of the focused element
        var virtualCursor = new VirtualCursor();
        // Move the cursor over the current focused element
        virtualCursor.moveOver($focusedListElement);
        virtualCursor.moveRelative(event.which, $focusedListElement.width(), $focusedListElement.height());

        // Select the element below the virtual cursor
        var $selectedListElement = $(virtualCursor.getElementBelowCursor('li')),
          selectedMenu = $selectedListElement.parent()[0] || false;

        // Check if the virtual cursor selected a sibling menu item
        // or if the virtual cursor selected a sub menu
        if ($focusedMenu[0] === selectedMenu || $subMenu[0] === selectedMenu) {
          if (_this.selectListElement($selectedListElement)) {
            event.preventDefault();
          }
        }
        // Check if the virtual cursor selected a parent menu
        else if ($parentMenu[0] === selectedMenu) {
          // Select the parent list element
          if (_this.selectListElement($parentListElement)) {
            event.preventDefault();
          }
        }
      }
    },

    /**
     * Plugin initialization
     */
    init: function () {
      this.setAriaRoles();
      this.$elem
        // Listen to mouse and keyboard events
        .on('focusin', 'li', this, this.events.listItemFocus)
        .on('focusout', 'li', this, this.events.listItemBlur)
        .on('mouseover', 'a', this, this.events.listItemMouseOver)
        .on('mouseout', 'a', this, this.events.listItemMouseOut)
        .on('keydown', '>li', this, this.events.keyDown)
        .on('click', 'a', this, supportsTouch() ? this.events.linkTouch : this.events.linkMouseClick)
        // Disable the css fallback
        .removeClass('css-fallback')
        // Add aria-menu class
        .addClass('aria-menu')
        // Touch support
        .addClass((supportsTouch() ? 'has' : 'no') + '-touch');

    },

    /**
     * Helper function
     */
    find: function (selector) {
      return this.$elem.find(selector);
    },

    /**
     * Sets the focus to the first visible anchor child in this list element.
     * The element might be an `ul` or a `li` element containing an `a` anchor.
     *
     * @param {jQuery} $element
     * @returns {boolean}
     */
    selectListElement: function ($element) {
      return $element
        // Find the `a` tag starting from the `ul` or `li`:
        .find('>li>a, >a')
        // make sure that the anchor is visible
        .filter(':visible:first')
        // set the focus
        .focus()
        // as the filter selects only the first element the length
        // can be either 0 or 1
        .length === 1;
    },


    /**
     * Add Aria roles and poperties
     * http://http://www.w3.org/TR/wai-aria/
     */
    setAriaRoles: function () {
      // Add ARIA role to menu bar
      // http://www.w3.org/TR/wai-aria/roles#menubar
      this.$elem.attr('role', 'menubar');

      // Add ARIA role to menu items
      // http://www.w3.org/TR/wai-aria/roles#menuitem
      this.find('li').attr('role', 'menuitem');

      this.find('a+ul')
        // Adding aria-haspopup for appropriate items
        // http://www.w3.org/TR/wai-aria/states_and_properties#aria-haspopup
        .each(function () {
          $(this).prev('a').attr('aria-haspopup', 'true');
        });
    },

    /**
     * Closes the menu by removing the focus
     */
    closeMenu: function () {
      this.$elem.find(':focus').blur();
    }
  };

  /**
   * A virtual mouse cursor
   * which helps to support keyboard navigation
   *
   * @constructor
   */
  function VirtualCursor() {
    this.left = 0;
    this.top = 0;
  }

  VirtualCursor.prototype = {
    /**
     * Move the virtual cursor over the center of the given target
     *
     * @param {HTMLElement|jQuery} target
     */
    moveOver: function (target) {
      var $target = $(target),
        $document = $(document);

      // Set left and top value
      $.extend(this, $target.offset());

      // Move virtual cursor to the middle of the focused element
      // relative to the current scroll position
      this.top += 0.5 * $target.height() - $document.scrollTop();
      this.left += 0.5 * $target.width() - $document.scrollLeft();
    },

    /**
     * Moves the curse relative to the last position
     *
     * @param direction {number} 37|38|39|40 Direction constant - as in the key code map
     * https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Virtual_key_codes
     * DOM_VK_LEFT   0x25 (37)  Left arrow.
     * DOM_VK_UP     0x26 (38)  Up arrow.
     * DOM_VK_RIGHT  0x27 (39)  Right arrow.
     * DOM_VK_DOWN   0x28 (40)  Down arrow.
     *
     * @param x {number}
     * @param y {number}
     */
    moveRelative: function (direction, x, y) {
      // {left} or {right} key pressed
      if (direction === 37 || direction === 39) {
        // Move the virtual cursor horizontally
        // event.which - 38 = -1 || +1
        this.left += (direction - 38) * x;
      }
      // {up} or {bottom} key pressed
      else {
        // Move the virtual cursor vertically
        // event.which - 39 = -1 || +1
        this.top += (direction - 39) * y;
      }
    },

    /**
     * Return the element at the current courser position
     *
     * @param {string} [selector]
     * @returns {jQuery}
     */
    getElementBelowCursor: function (selector) {
      var $element = $(document.elementFromPoint(this.left, this.top));
      if (selector) {
        $element = $element.closest(selector);
      }
      return $element;
    }
  };

  /**
   * Execute a function once per element after a given delay
   *
   * @param {HTMLElement|jQuery} element
   * @param {function()=} [callback]
   * @param {number=} [delay]
   */
  function debounce(element, callback, delay) {
    clearTimeout(Number($(element).data('am-delay')));
    if (callback && delay) {
      $(element).data('am-delay', setTimeout($.proxy(callback, element), delay));
    }
  }


  // jQuery plugin interface
  // Use quoted notation for the closure compiler ADVANCED_OPTIMIZATIONS mode
  $['fn']['ariaMenu'] = function (opt) {
    return this.each(function () {
      var item = $(this), instance = item.data('AriaMenu');
      if (!instance) {
        // create plugin instance and save it in data
        item.data('AriaMenu', new AriaMenu(this, opt));
      }
    });
  };

  
}(jQuery));