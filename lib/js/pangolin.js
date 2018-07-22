'use strict';

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

const Utilities = function() {
  this.breakpoint = 992; // pixels
}
Utilities.prototype.isTouchDevice = function() {
  return 'ontouchstart' in document.documentElement;
}
Utilities.prototype.isUnderBreakpoint = function(breakpoint) {
  return window.innerWidth <= breakpoint;
}

const Pangolin = function() {
  Utilities.call(this);

  this.toggleColumnL = document.getElementById('columnL');
  this.toggleColumnR = document.getElementById('columnR');

  this.isScrolling();
  this.animateColumns(this.breakpoint);
  this.eventListeners();
}
Pangolin.prototype = Object.create( Utilities.prototype );
Pangolin.prototype.constructor = Pangolin;

Pangolin.prototype.isScrolling = function() {
  if ( window.scrollY > 0 ) {
    document.body.classList.add('is-scrolling');
  } else {
    document.body.classList.remove('is-scrolling');
  }
}

Pangolin.prototype.animateColumns = function() {
  if ( this.isUnderBreakpoint( this.breakpoint ) ) {
    document.body.classList.add('animate-columns');
  } else {
    document.body.classList.remove('animate-columns');
  }
}

Pangolin.prototype.blockScroll = function( target ) {
  if ( target.checked ) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }    
}

Pangolin.prototype.eventListeners = function() {
  let _this = this;

  window.addEventListener( 'resize', debounce( function() {
    _this.animateColumns( _this.breakpoint );
    if ( _this.toggleColumnL.checked ) { _this.toggleColumnL.checked = false; }
    if ( _this.toggleColumnR.checked ) { _this.toggleColumnR.checked = false; }
  }, 250 ));

  window.addEventListener('scroll', function(e) {
    _this.isScrolling();
  }, false);

  if ( _this.toggleColumnL ) {
    _this.toggleColumnL.addEventListener( 'change', function() {
      _this.blockScroll( _this.toggleColumnL );
    });
  }

  if ( _this.toggleColumnR ) {
    _this.toggleColumnR.addEventListener( 'change', function() {
      _this.blockScroll( _this.toggleColumnR );
    });
  }
}

const pangolin = new Pangolin();
