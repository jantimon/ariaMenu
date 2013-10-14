=======
# AriaMenu #

This page applies techniques described in Derek Featherstone's article [Better For Accessibility, and
      specifically uses code from his Option 6 example.](http://simplyaccessible.com/examples/css-menu/option-6/)

Using off-left positioning for hiding menus with support for showing menus on <code>:focus</code> and
  <code>:hover</code>. Includes proper <code>:focus</code> states for links. Uses jQuery to display menus on <code>:focus</code>.
  Also uses ARIA properties for menus.

## Demo ##

Try the gh-pages branch **[demo](http://jantimon.github.io/ariaMenu/)**.

## Features ##

 + **Arrow keys** moves a virtual cursor which sets focus to
    + a sibling of the current menu item
    + a direct parent list element
    + the first list element of a sub menu
 + **Escape**  closes any focused menus.
 + **Tabbing** allows cycling through every menu item.

## Size ##

 + Size (minifed & gziped)
    **1.0** KB
 + Size (minfied)
    **2.3** KB
 + Size (original with comments)
    **7.5** KB

## Links ##

  + Responsive menus
    + [responsive-nav-patterns](http://bradfrostweb.com/blog/web/responsive-nav-patterns/)
    + [popular-web-design-trends-for-responsive-navigation](http://blog.teamtreehouse.com/popular-web-design-trends-for-responsive-navigation)

  + Accessible menus
    + [washington.edu simply accessible](http://staff.washington.edu/tft/tests/menus/simplyaccessible/index.html)
    + [Better for Accessibility](http://simplyaccessible.com/article/better-for-accessibility/)

  + Closure compiler
    + [Preventing property renaming](http://closuretools.blogspot.de/2011/01/property-by-any-other-name-part-1.html)
    + [Prevent jsLint warning](http://stackoverflow.com/questions/13192466/jshint-surpress-variable-is-better-written-in-dot-notation)

  + Boilerplate code
    + [RequireJS jQuery plugin](http://stackoverflow.com/questions/10918063/how-to-make-a-jquery-plugin-loadable-with-requirejs#answer-11890239)
    + [jQuery plugin](https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js)