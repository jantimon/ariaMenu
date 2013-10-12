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
    **2.6** KB
 + Size (original with comments)
    **7.1** KB
