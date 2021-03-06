=======
# AriaMenu #

AriaMenu is a minimalistic, cross browser, cross device jQuery plugin.
It improves a css-driven menu to be accessible with touch and keyboard.

Installation
```
bower install ariaMenu
```
JS
```
jQuery(".ariaMenu").ariaMenu();
```
CSS
```
.ariaMenu .show-menu { display : block }
```

  + WCAG conform
  + [JSHint](https://github.com/jantimon/ariaMenu/blob/master/.jshintrc)
  + **No** inline styles
  + **No** <code>!important</code> styles
  + **No** DOM structure changes
  + **No** <code>resize</code>-events
  + **No** <code>scroll</code>-events
  + **No** css browser prefixes (thanks to [autoprefixer](https://github.com/ai/autoprefixer))
  + Lightweight
  + Separation of logic, layout and theming
  + Automated testing

![CasperJS test screenshot](http://jantimon.github.io/ariaMenu/screenshots/preview.png)
![CasperJS responsive screenshot](http://jantimon.github.io/ariaMenu/screenshots/responsive.png)

## Demo ##

 + **[Responsive layout](http://jantimon.github.io/ariaMenu/responsive.html)**

## Requirements ##

Browser
 * IE7+
 * Chrome
 * Safari
 * Firefox
 * iPhone 6.0 Safari
 * Android Safari 4.0

Dom/Event Library
 * jQuery 1.7+
 * Zepto

## Features ##

 + **Arrow keys** moves a virtual cursor which sets focus to
    + a sibling of the current menu item
    + a direct parent list element
    + the first list element of a sub menu
 + **Escape**  closes any open menus.
 + **Tabbing** allows cycling through every menu item.
 + Single **Tap** opens a menu
 + Double **Tap** triggers the link

## Size ##

 + Size (minifed & gziped)
    **1.1** KB
 + Size (minfied)
    **2.44** KB

## Documentation ##

**[Source code (explainJS)](http://jantimon.github.io/ariaMenu/docs/explain.html)**


**Files**

  <code>grunt</code> tests, compiles and minfies the source code.
  All built results are copied to the "dist" folder:

  + [dist](https://github.com/jantimon/ariaMenu/tree/master/dist)
    + [other](https://github.com/jantimon/ariaMenu/tree/master/dist/other) (Zepto & AMD version)
    + [styles](https://github.com/jantimon/ariaMenu/tree/master/dist/styles) (Stylesheets)
      + [ariaMenu.layout.css](https://github.com/jantimon/ariaMenu/blob/master/dist/styles/ariaMenu.layout.css) (Layout styles)
      + [ariaMenu.theme.css](https://github.com/jantimon/ariaMenu/blob/master/dist/styles/ariaMenu.theme.css) (Theme styles)
      + [ariaMenu.responsive.css](https://github.com/jantimon/ariaMenu/blob/master/dist/styles/ariaMenu.responsive.css) (Responsive theme and layout styles)
      + [ariaMenu.min.css ](https://github.com/jantimon/ariaMenu/blob/master/dist/styles/ariaMenu.min.css) (Minified layout and theme styles)
    + [ariaMenu.dev.js](https://github.com/jantimon/ariaMenu/blob/master/dist/ariaMenu.dev.js) (Javascript with comments)
    + [ariaMenu.min.js](https://github.com/jantimon/ariaMenu/blob/master/dist/ariaMenu.min.js) (Minified jQuery version)
    + [ariaMenu.min.js.map](https://github.com/jantimon/ariaMenu/blob/master/dist/ariaMenu.min.js.map) (Sourcemap)

## Accessibility ##

This menu is accessible for

  + People who are blind (who cannot use devices such as mice that require eye-hand coordination)
  + People with low vision (who may have trouble finding or tracking a pointer indicator on screen)
  + Some people with hand tremors find using a mouse very difficult and therefore usually use a keyboard

Guidelines to follow

  + [WCAG 2.0 - Guideline 1.4.4: Resize text to 200%](http://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-scale.html)
  + [WCAG 2.0 - Guideline 2.1: Make all functionality available from a keyboard.](http://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation.html)
  + [WCAG 2.0 - Guideline 2.1.2: No Keyboard Trap](http://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-trapping.html)
  + [WCAG 2.0 - Guideline 2.1.3: Keyboard (No Exception)](http://www.w3.org/TR/UNDERSTANDING-WCAG20/keyboard-operation-all-funcs.html)
  + [WCAG 2.0 - Guideline 2.4.3: Focus Order](http://www.w3.org/TR/UNDERSTANDING-WCAG20/navigation-mechanisms-focus-order.html)

## Tests ##

CasperJS Webkit tests
[![Travis Build](https://api.travis-ci.org/jantimon/ariaMenu.png)](https://travis-ci.org/jantimon/ariaMenu)

SauceLab tests
[![Selenium Test Status](https://saucelabs.com/browser-matrix/ariaMenu.svg)](https://saucelabs.com/u/ariaMenu)

Code coverage
[Code coverage](http://jantimon.github.io/ariaMenu/docs/lcov/src/ariaMenu.js.gcov.html)

## Javascript? ##

It's not the aim of ariaMenu to be a fully fledged javascript menu but only a light weight unobtrusive enhancement for your CSS menu.

Also note that [98.6% of people who are blind have Javascript enabled](http://webaim.org/projects/screenreadersurvey4/#javascript)

## Links ##

  + Responsive menus
    + [responsive-nav-patterns](http://bradfrostweb.com/blog/web/responsive-nav-patterns/)
    + [popular-web-design-trends-for-responsive-navigation](http://blog.teamtreehouse.com/popular-web-design-trends-for-responsive-navigation)

  + Accessible menus
    + [washington.edu simply accessible](http://staff.washington.edu/tft/tests/menus/simplyaccessible/index.html)
    + [Better for Accessibility](http://simplyaccessible.com/article/better-for-accessibility/)

  + Closure compiler
    + [Preventing property renaming](http://closuretools.blogspot.de/2011/01/property-by-any-other-name-part-1.html)
    + [Prevent jsHint warnings](http://stackoverflow.com/questions/13192466/jshint-surpress-variable-is-better-written-in-dot-notation)

  + Boilerplate code
    + [RequireJS jQuery plugin](http://stackoverflow.com/questions/10918063/how-to-make-a-jquery-plugin-loadable-with-requirejs#answer-11890239)
    + [jQuery plugin](https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js)
