'use strict';

if ('NodeList' in window && !NodeList.prototype.forEach) {
  console.info('polyfill for IE11');
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (var i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

const Navigation = function(menu) {
  Utilities.call(this);
  this.init();
}
Navigation.prototype = Object.create( Utilities.prototype );
Navigation.prototype.constructor = Navigation;

Navigation.prototype.init = function() {
  document.querySelectorAll('.menu').forEach( function( menu ) {
    if ( !menu.classList.contains('menu--flat') ) {
      if ( this.isTouchDevice() ) {
        if ( menu.classList.contains('mouseable') ) {
          menu.classList.remove('mouseable');
        }
        menu.classList.add('touchable');
        this.attachTouchListeners( menu );
      } else {
        if ( !menu.classList.contains('mouseable') ) {
          menu.classList.add('mouseable');
        }
        this.attachMouseListeners( menu );
      }
    }
    this.attachGlobalListeners( menu );
  }.bind(this));
};

Navigation.prototype.alignSubmenu = function( menuItem ) {
  let leftPos = menuItem.getBoundingClientRect().left;
  let submenu = menuItem.querySelector('ul');
  if ( submenu && window.innerWidth - ( leftPos + menuItem.offsetWidth ) < submenu.offsetWidth ) {
    submenu.classList.add('position-right');
  }
}

Navigation.prototype.blurMenus = function( blurAll ) {
  [].slice.call( document.querySelectorAll('.hover') )
    .filter( function( menuItem ) {
      if ( event && !blurAll ) {
        return !menuItem.contains(event.target);
      }
      return menuItem;
    })
    .forEach( function(menuItem) {
      menuItem.classList.remove('position-right');
      menuItem.classList.remove('hover');
    });
  return false;
}

Navigation.prototype.handleAsTouch = function( event ) {
  let li = event.target.parentNode;
  let hasChildMenu = !!li.querySelector('ul');
  if ( hasChildMenu ) {
    if ( !li.classList.contains('hover') ) {
      event.preventDefault();
      li.classList.add('hover');
      this.alignSubmenu( li );
      this.blurMenus();
      return;
    }
  }
  this.blurMenus( true );
}

Navigation.prototype.attachGlobalListeners = function( menu ) {
  window.addEventListener('resize', debounce( function() {
    this.blurMenus();
  }.bind(this), 250 ));
}

Navigation.prototype.attachMouseListeners = function( menu ) {
  menu.querySelectorAll('li').forEach( function( li ) {
    li.addEventListener('mouseenter', function( event ) {
      this.alignSubmenu( li );
    }.bind(this), false );
  }.bind(this));
}

Navigation.prototype.attachTouchListeners = function( menu ) {
  menu.addEventListener('touchstart', function( event ) {
    event.stopPropagation();
    this.handleAsTouch( event );
  }.bind(this), false );
  document.addEventListener('touchstart', function( event ) {
    this.blurMenus( true );
  }.bind(this), false );

  menu.addEventListener('click', function( event ) {
    event.stopPropagation();
    this.handleAsTouch( event );
  }.bind(this), false );
  document.addEventListener('click', function( event ) {
    this.blurMenus( true );
  }.bind(this), false );
}

const pangolinMenus = new Navigation();
