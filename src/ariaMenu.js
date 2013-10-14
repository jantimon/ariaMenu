/** Copyright (c) 2013 Jan Nicklas Released under MIT license */

// Closure compiler requires ['name'] notation
// http://closuretools.blogspot.de/2011/01/property-by-any-other-name-part-1.html
/* jshint sub:true */

/* global jQuery: true */

(function ($) {
  'use strict';
  // @@ start @@ //

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
    // Single quotes are required for the google closure compiler:
    // http://closuretools.blogspot.de/2011/01/property-by-any-other-name-part-1.html
    defaults: {
      'focusClass': 'menuitem-focus',
      'focusedSubMenuClass': 'show-menu',
      'closeDelay': 100
    },

    events: {
      /* Triggered when the user moves his mouse over a list item */
      listItemMouseOver: function () {
        $(this).focus();
      },

      /* Triggered when the user moves his mouse away from a list item */
      listItemMouseOut: function () {
        if ($(this).is(':focus')) {
          $(this).blur();
        }
      },

      /* Triggered when a list item receives focus */
      listItemFocus: function (event) {
        var settings = event.data.settings;
        /* Show the sub menus */
        $(this)
          .stop()
          .addClass(settings['focusClass'])
          .find('>ul')
          .addClass(settings['focusedSubMenuClass'])
          .attr('aria-hidden', false);
      },

      /* Triggered when the focus is lost */
      listItemBlur: function (event) {
        var settings = event.data.settings;
        /* Wait for a short moment and hide the sub menus */
        $(this)
          .stop()
          .delay(settings['closeDelay'])
          .queue(function (next) {
            $(this).removeClass(settings['focusClass'])
              .find('>ul')
              .removeClass(settings['focusedSubMenuClass'])
              .attr('aria-hidden', true);
            next();
          });
      },

      /* Triggered when a key event bubbles to a root menu list item */
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

      /* Triggered when an arrow key event bubbles to a root menu list item */
      arrowKeyDown: function (event) {
        // Usually the event target is the focused link - so we pick the
        // parent to get the active listElement
        var $focusedListElement = $(event.target).closest('li'),
        // Get the focused list element Dimensions
          focusedListElementWidth = $focusedListElement.width(),
          focusedListElementHeight = $focusedListElement.height(),
        // Get the focused menu element
          $focusedMenu = $focusedListElement.closest('ul'),
        //  Get the parent element of the focused element (if one exists)
          $parentListElement = ($focusedListElement[0] === this) ? $() : $focusedMenu.closest('li'),
        // Get the parent menu of the focused element (if one exists)
          $parentMenu = $parentListElement.parent(),
        // Get the sub menu (if one exists)
          $subMenu = $focusedListElement.find('>ul'),
        // Create a virtual cursor with the position of the focused element
          virtualCursor = new VirtualCursor();

        // Move the cursor over the current focused element
        virtualCursor.moveOver($focusedListElement);

        if (event.which === 39) {
          // {right} key pressed
          // Move the virtual cursor to the right
          virtualCursor.left += focusedListElementWidth;
        }
        else if (event.which === 40) {
          // {bottom} key pressed
          // Move the virtual cursor down
          virtualCursor.top += focusedListElementHeight;
        }
        else if (event.which === 37) {
          // {left} key pressed
          // Move the virtual cursor to the left
          virtualCursor.left -= focusedListElementWidth;
        } else {
          // {top} key pressed
          // Move the virtual cursor up
          virtualCursor.top -= focusedListElementHeight;
        }

        // Select the element below the virtual cursor
        var $selectedListElement = $(virtualCursor.getElementBelowCursor('li')),
          selectedMenu = $selectedListElement.parent()[0] || false;

        // Check if the virtual cursor selected a sibling menu item
        if ($focusedMenu[0] === selectedMenu) {
          $selectedListElement.find('>a').focus();
          event.preventDefault();
        }
        // Check if the virtual cursor selected a sub menu
        else if ($subMenu[0] === selectedMenu) {
          // Select the first element in the sub menu
          $subMenu.find('>li>a').first().focus();
          event.preventDefault();
        }
        // Check if the virtual cursor selected a parent menu
        else if ($parentMenu[0] === selectedMenu) {
          // Select the parent list element
          $parentListElement.find('>a').focus();
          event.preventDefault();
        }
      }
    },

    init: function () {
      this.setAriaRoles();
      this.$elem
        // Listen to mouse and keyboard events
        .on('focusin', 'li', this, this.events.listItemFocus)
        .on('focusout', 'li', this, this.events.listItemBlur)
        .on('mouseover', 'a', this, this.events.listItemMouseOver)
        .on('mouseout', 'a', this, this.events.listItemMouseOut)
        .on('keydown', '>li', this, this.events.keyDown)
        // Disable the css fallback
        .removeClass('css-fallback')
        // Add aria-menu class
        .addClass('aria-menu');

    },

    /**
     * Helper function
     */
    find: function (selector) {
      return this.$elem.find(selector);
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
        // Add ARIA role to sub menus
        // http://www.w3.org/TR/wai-aria/roles#menu
        .attr({ 'aria-hidden': 'true', 'role': 'menu' })
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
     * Move the virtual cursor to the center of the given target
     *
     * @param {HTMLElement} target
     */
    moveOver: function (target) {
      var $target = $(target),
        $document = $(document);

      // Set left and top value
      $.extend(this, $target.offset());

      // Move virtual cursor in the middle of the focused element
      // relative to the current scroll position
      this.top += 0.5 * $target.height() - $document.scrollTop();
      this.left += 0.5 * $target.width() - $document.scrollLeft();

    },
    /**
     * Return the element at the current courser position
     *
     * @param {string} [selector]
     * @returns {HTMLElement|null}
     */
    getElementBelowCursor: function (selector) {
      var $element = $(document.elementFromPoint(this.left, this.top));
      if (selector && !$element.is(selector)) {
        $element = $element.closest(selector);
      }
      return $element || null;
    }
  };


  // jQuery plugin interface
  // Use quoted notation for ADVANCED_OPTIMIZATIONS
  $['fn']['ariaMenu'] = function (opt) {
    return this.each(function () {
      var item = $(this), instance = item.data('AriaMenu');
      if (!instance) {
        // create plugin instance and save it in data
        item.data('AriaMenu', new AriaMenu(this, opt));
      } else {
        // if instance already created call method
        if (typeof opt === 'string') {
          // slice arguments to leave only arguments after function name
          var args = Array.prototype.slice.call(arguments, 1);
          instance[opt].apply(instance, args);
        }
      }
    });
  };

  // @@ end @@ //
}(jQuery));