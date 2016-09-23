(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],2:[function(require,module,exports){
(function( w ){
	"use strict";

	var Politespace = function( element ) {
		if( !element ) {
			throw new Error( "Politespace requires an element argument." );
		}

		if( !element.getAttribute ) {
			// Cut the mustard
			return;
		}

		this.element = element;
		this.type = this.element.getAttribute( "type" );
		this.delimiter = this.element.getAttribute( "data-delimiter" ) || " ";
		this.reverse = this.element.getAttribute( "data-reverse" ) !== null;
		this.groupLength = this.element.getAttribute( "data-grouplength" ) || 3;
	};

	Politespace.prototype._divideIntoArray = function( value ) {
		var split = ( '' + this.groupLength ).split( ',' ),
			isUniformSplit = split.length === 1,
			dividedValue = [],
			loopIndex = 0,
			groupLength,
			substrStart,
			useCharCount;

		while( split.length && loopIndex < value.length ) {
			if( isUniformSplit ) {
				groupLength = split[ 0 ];
			} else {
				// use the next split or the rest of the string if open ended, ala "3,3,"
				groupLength = split.shift() || value.length - loopIndex;
			}

			// Use min if we’re at the end of a reversed string
			// (substrStart below grows larger than the string length)
			useCharCount = Math.min( parseInt( groupLength, 10 ), value.length - loopIndex );

			if( this.reverse ) {
				substrStart = -1 * (useCharCount + loopIndex);
			} else {
				substrStart = loopIndex;
			}
			dividedValue.push( value.substr( substrStart, useCharCount ) );
			loopIndex += useCharCount;
		}

		if( this.reverse ) {
			dividedValue.reverse();
		}

		return dividedValue;
	};

	Politespace.prototype.format = function( value ) {
		var val = this.unformat( value );

		return this._divideIntoArray( val ).join( this.delimiter );
	};

	Politespace.prototype.trimMaxlength = function( value ) {
		var maxlength = this.element.getAttribute( "maxlength" );
		// Note input type="number" maxlength does nothing
		if( maxlength ) {
			value = value.substr( 0, maxlength );
		}
		return value;
	};

	Politespace.prototype.getValue = function() {
		return this.trimMaxlength( this.element.value );
	};

	Politespace.prototype.update = function() {
		this.element.value = this.useProxy() ? this.getValue() : this.format( this.getValue() );
	};

	Politespace.prototype.unformat = function( value ) {
		return value.replace( new RegExp(  this.delimiter, 'g' ), '' );
	};

	Politespace.prototype.reset = function() {
		this.element.value = this.unformat( this.element.value );
	};

	Politespace.prototype.useProxy = function() {
		return this.type === "number";
	};

	Politespace.prototype.updateProxy = function() {
		var proxy;
		if( this.useProxy() ) {
			proxy = this.element.parentNode.firstChild;
			proxy.innerHTML = this.format( this.getValue() );
			proxy.style.width = this.element.offsetWidth + "px";
		}
	};

	Politespace.prototype.createProxy = function() {
		if( !this.useProxy() ) {
			return;
		}

		function getStyle( el, prop ) {
			return window.getComputedStyle( el, null ).getPropertyValue( prop );
		}
		function sumStyles( el, props ) {
			var total = 0;
			for( var j=0, k=props.length; j<k; j++ ) {
				total += parseFloat( getStyle( el, props[ j ] ) );
			}
			return total;
		}

		var parent = this.element.parentNode;
		var el = document.createElement( "div" );
		var proxy = document.createElement( "div" );
		proxy.style.font = getStyle( this.element, "font" );
		proxy.style.paddingLeft = sumStyles( this.element, [ "padding-left", "border-left-width" ] ) + "px";
		proxy.style.paddingRight = sumStyles( this.element, [ "padding-right", "border-right-width" ] ) + "px";
		proxy.style.top = sumStyles( this.element, [ "padding-top", "border-top-width", "margin-top" ] ) + "px";

		el.appendChild( proxy );
		el.className = "politespace-proxy active";
		var formEl = parent.replaceChild( el, this.element );
		el.appendChild( formEl );

		this.updateProxy();
	};

	w.Politespace = Politespace;

}( this ));

},{}],3:[function(require,module,exports){
var select = require('../utils/select');

/**
 * @name showPanelListener
 * @desc The event handler for clicking on a button in an accordion.
 * @param {HTMLElement} el - An HTML element most likely a <button>.
 * @param {Object} ev - A DOM event object.
 */
function showPanelListener (el, ev) {
  var expanded = el.getAttribute('aria-expanded') === 'true';
  this.hideAll();
  if (!expanded) {
    this.show(el);
  }
  return false;
}

/**
 * @class Accordion
 *
 * An accordion component.
 *
 * @param {HTMLElement} el An HTMLElement to turn into an accordion.
 */
function Accordion (el) {
  var self = this;
  this.root = el;

  // delegate click events on each <button>
  var buttons = select('button', this.root);
  buttons.forEach(function (el) {
    if (el.attachEvent) {
      el.attachEvent('onclick', showPanelListener.bind(self, el));
    } else {
      el.addEventListener('click', showPanelListener.bind(self, el));
    }
  });

  // find the first expanded button
  var expanded = this.$('button[aria-expanded=true]')[ 0 ];
  this.hideAll();
  if (expanded !== undefined) {
    this.show(expanded);
  }
}

/**
 * @param {String} selector
 * @return {Array}
 */
Accordion.prototype.$ = function (selector) {
  return select(selector, this.root);
};

/**
 * @param {HTMLElement} button
 * @return {Accordion}
 */
Accordion.prototype.hide = function (button) {
  var selector = button.getAttribute('aria-controls'),
    content = this.$('#' + selector)[ 0 ];

  button.setAttribute('aria-expanded', false);
  content.setAttribute('aria-hidden', true);
  return this;
};

/**
 * @param {HTMLElement} button
 * @return {Accordion}
 */
Accordion.prototype.show = function (button) {
  var selector = button.getAttribute('aria-controls'),
    content = this.$('#' + selector)[ 0 ];

  button.setAttribute('aria-expanded', true);
  content.setAttribute('aria-hidden', false);
  return this;
};

/**
 * @return {Accordion}
 */
Accordion.prototype.hideAll = function () {
  var self = this;
  var buttons = this.$('ul > li > button, .usa-accordion-button');
  buttons.forEach(function (button) {
    self.hide(button);
  });
  return this;
};

module.exports = Accordion;

},{"../utils/select":23}],4:[function(require,module,exports){
var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

function headerClickHandler (event) {
  (event.preventDefault) ? event.preventDefault() : event.returnValue = false;
  
  var expanded = event.target.getAttribute('aria-expanded') === 'true';
  var toggleClass = expanded ? addClass : removeClass;
  toggleClass(this, 'usa-banner-header-expanded');
}

function bannerInit () {
  var headers = select('.usa-banner-header');

  headers.forEach(function (header) {
    var headerClick = headerClickHandler.bind(header);
    select('[aria-controls]').forEach(function (button) {
      dispatch(button, 'click', headerClick);
    });
  });
}

module.exports = bannerInit;
},{"../utils/add-class":20,"../utils/dispatch":21,"../utils/remove-class":22,"../utils/select":23}],5:[function(require,module,exports){
var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

function getSiblings (el) {
  var n = el.parentNode.firstChild;
  var matches = [];

  while (n) {
    if (n.nodeType == 1 && n != el) {
      matches.push(n);
    }
    n = n.nextSibling;
  }

  return matches;
}

var showPanelListener = function () {
  var panelToShow = this.parentNode;
  var otherPanels = getSiblings(panelToShow);
  removeClass(panelToShow, 'hidden');
  otherPanels.forEach(function (el) {
    addClass(el, 'hidden');
  });
};

var events= [];

module.exports = function footerAccordion () {

  var navList = select('.usa-footer-big nav ul');
  var primaryLink = select('.usa-footer-big nav .usa-footer-primary-link');

  if (events.length) {
    events.forEach(function (e) {
      e.off();
    });
    events = [];
  }

  if (window.innerWidth < 600) {

    navList.forEach(function (el) {
      addClass(el, 'hidden');
    });

    primaryLink.forEach(function (el) {
      events.push(
        dispatch(el, 'click', showPanelListener)
      );
    });

  } else {
    navList.forEach(function (el) {
      removeClass(el, 'hidden');
    });
  }
};

},{"../utils/add-class":20,"../utils/dispatch":21,"../utils/remove-class":22,"../utils/select":23}],6:[function(require,module,exports){
var select = require('../../utils/select');
var addClass = require('../../utils/add-class');
var removeClass = require('../../utils/remove-class');
var dispatch = require('../../utils/dispatch');

function toggleClass (element, className) {
  if (element.classList) {
    element.classList.toggle(className);
  }
}

function mobileInit () {
  var navElements = select('.usa-menu-btn, .usa-overlay, .usa-nav-close');
  var toggleElements = select('.usa-overlay, .usa-nav');
  var navCloseElement = select('.usa-nav-close')[ 0 ];

  navElements.forEach(function (element) {
    dispatch(element, 'click touchstart', function (e) {
      toggleElements.forEach(function (element) {
        toggleClass(element, 'is-visible');
      });
      toggleClass(document.body, 'usa-mobile_nav-active');
      navCloseElement.focus();
      return false;
    });
  });
}

module.exports = mobileInit;
},{"../../utils/add-class":20,"../../utils/dispatch":21,"../../utils/remove-class":22,"../../utils/select":23}],7:[function(require,module,exports){
var select = require('../../utils/select');
var addClass = require('../../utils/add-class');
var removeClass = require('../../utils/remove-class');
var dispatch = require('../../utils/dispatch');

var searchForm, searchButton, searchButtonContainer, searchDispatcher;

function searchButtonClickHandler (event) {
  if (isOpen(searchForm)) {
    closeSearch();
  } else {
    openSearch();
    searchDispatcher = dispatch(document.body, 'click touchstart', searchOpenClickHandler);
  }

  return false;
}

function searchOpenClickHandler (event) {
  var target = event.target;
  if (! searchFormContains(target)) {
    closeSearch();
    searchDispatcher.off();
  }
}

function openSearch () {
  addClass(searchForm, 'is-visible');
  addClass(searchButton, 'is-hidden');
}

function closeSearch () {
  removeClass(searchForm, 'is-visible');
  removeClass(searchButton, 'is-hidden');
}

function isOpen (element) {
  var classRegexp = new RegExp('(^| )is-visible( |$)', 'gi');
  return classRegexp.test(element.className);
}

function searchFormContains (element) {
  return (searchForm && searchForm.contains(element)) ||
         (searchButtonContainer && searchButtonContainer.contains(element));
}

function searchInit () {
  searchForm = select('.js-search-form')[ 0 ];
  searchButton = select('.js-search-button')[ 0 ];
  searchButtonContainer = select('.js-search-button-container')[ 0 ];

  if (searchButton && searchForm) {
    dispatch(searchButton, 'click touchstart', searchButtonClickHandler);
  }
}

module.exports = searchInit;
},{"../../utils/add-class":20,"../../utils/dispatch":21,"../../utils/remove-class":22,"../../utils/select":23}],8:[function(require,module,exports){
/**
 * Flips given INPUT elements between masked (hiding the field value) and unmasked
 * @param {Array.HTMLElement} fields - An array of INPUT elements
 * @param {Boolean} mask - Whether the mask should be applied, hiding the field value
 */
module.exports = function (fields, mask) {
  fields.forEach(function (field) {
    field.setAttribute('autocapitalize', 'off');
    field.setAttribute('autocorrect', 'off');
    field.setAttribute('type', mask ? 'password' : 'text');
  });
};

},{}],9:[function(require,module,exports){
var toggleFieldMask = require('./toggle-field-mask');
var select = require('../utils/select');

/**
 * Component that decorates an HTML element with the ability to toggle the
 * masked state of an input field (like a password) when clicked.
 * The ids of the fields to be masked will be pulled directly from the button's
 * `aria-controls` attribute.
 *
 * @param  {HTMLElement} el    Parent element containing the fields to be masked
 * @param  {String} showText   Button text shown when field is masked
 * @param  {String} hideText   Button text show when field is unmasked
 * @return {}
 */
var toggleFormInput = function (el, showText, hideText) {
  var defaultSelectors = el.getAttribute('aria-controls');

  if (!defaultSelectors || defaultSelectors.trim().length === 0) {
    throw new Error('Did you forget to define selectors in the aria-controls attribute? Check element ' + el.outerHTML);
  }

  var fieldSelector = getSelectors(defaultSelectors);
  var formElement = getFormParent(el);
  if (!formElement) {
    throw new Error('toggleFormInput() needs the supplied element to be inside a <form>. Check element ' + el.outerHTML);
  }
  var fields = select(fieldSelector, formElement);
  var masked = false;

  var toggleClickListener = function (ev) {
    ev.preventDefault();
    toggleFieldMask(fields, masked);
    el.textContent = masked ? showText : hideText;
    masked = !masked;
  };

  if (el.attachEvent) {
    el.attachEvent('onclick', toggleClickListener);
  } else {
    el.addEventListener('click', toggleClickListener);
  }
};

/**
 * Helper function to turn a string of ids into valid selectors
 * @param  {String} selectors Space separated list of ids of fields to be masked
 * @return {String}           Comma separated list of selectors
 */
function getSelectors (selectors) {
  var selectorsList = selectors.split(' ');

  return selectorsList.map(function (selector) {
    return '#' + selector;
  }).join(', ');
}

/**
 * Searches up the tree from the element to find a Form element, and returns it,
 * or null if no Form is found
 * @param {HTMLElement} el - Child element to start search
 */
function getFormParent (el) {
  while (el && el.tagName !== 'FORM') {
    el = el.parentNode;
  }
  return el;
}

module.exports = toggleFormInput;

},{"../utils/select":23,"./toggle-field-mask":8}],10:[function(require,module,exports){
var select = require('../utils/select');
var addClass = require('../utils/add-class');
var removeClass = require('../utils/remove-class');
var dispatch = require('../utils/dispatch');

module.exports = function validator (el) {
  var data = getData(el),
    key,
    validatorName,
    validatorPattern,
    validatorCheckbox,
    checkList = select(data.validationelement)[ 0 ];

  function validate () {
    for (key in data) {
      if (key.startsWith('validate')) {
        validatorName = key.split('validate')[ 1 ];
        validatorPattern = new RegExp(data[ key ]);
        validatorSelector = '[data-validator=' + validatorName + ']';
        validatorCheckbox = select(validatorSelector, checkList)[ 0 ];

        if (!validatorPattern.test(el.value)) {
          removeClass(validatorCheckbox, 'usa-checklist-checked');
        }
        else {
          addClass(validatorCheckbox, 'usa-checklist-checked');
        }
      }
    }
  }

  dispatch(el, 'keyup', validate);
};

/**
 * Extracts attributes named with the pattern "data-[NAME]" from a given
 * HTMLElement, then returns an object populated with the NAME/value pairs.
 * Any hyphens in NAME are removed.
 * @param {HTMLElement} el
 * @return {Object}
 */

function getData (el) {
  if (!el.hasAttributes()) return;
  var data = {};
  var attrs = el.attributes;
  for (var i = attrs.length - 1; i >= 0; i--) {
    var matches = attrs[ i ].name.match(/data-(.*)/i);
    if (matches && matches[ 1 ]) {
      var name = matches[ 1 ].replace(/-/, '');
      data[ name ] = attrs[ i ].value;
    }
  }
  return data;
}

},{"../utils/add-class":20,"../utils/dispatch":21,"../utils/remove-class":22,"../utils/select":23}],11:[function(require,module,exports){
var select = require('../utils/select');
var whenDOMReady = require('../utils/when-dom-ready');
var Accordion = require('../components/accordion');

whenDOMReady(function initAccordions () {

  var accordions = select('.usa-accordion, .usa-accordion-bordered');
  accordions.forEach(function (el) {
    new Accordion(el);
  });
});

},{"../components/accordion":3,"../utils/select":23,"../utils/when-dom-ready":25}],12:[function(require,module,exports){
var whenDOMReady = require('../utils/when-dom-ready');
var bannerInit = require('../components/banner');

whenDOMReady(function () {

  bannerInit();

});


},{"../components/banner":4,"../utils/when-dom-ready":25}],13:[function(require,module,exports){
var debounce = require('lodash.debounce');
var whenDOMReady = require('../utils/when-dom-ready');
var dispatch = require('../utils/dispatch');
var footerAccordion = require('../components/footer');

whenDOMReady(function () {

  footerAccordion();

  dispatch(window, 'resize', debounce(footerAccordion, 180));

});

},{"../components/footer":5,"../utils/dispatch":21,"../utils/when-dom-ready":25,"lodash.debounce":1}],14:[function(require,module,exports){
var whenDOMReady = require('../utils/when-dom-ready');
var select = require('../utils/select');
var validator = require('../components/validator');
var toggleFormInput = require('../components/toggle-form-input');

whenDOMReady(function () {
  var elShowPassword = select('.usa-show_password')[ 0 ];
  var elFormInput = select('.usa-show_multipassword')[ 0 ];
  var elValidator = select('.js-validate_password')[ 0 ];

  elShowPassword && toggleFormInput(elShowPassword, 'Show Password', 'Hide Password');
  elFormInput && toggleFormInput(elFormInput, 'Show my typing', 'Hide my typing');
  elValidator && validator(elValidator);
});


},{"../components/toggle-form-input":9,"../components/validator":10,"../utils/select":23,"../utils/when-dom-ready":25}],15:[function(require,module,exports){
var whenDOMReady = require('../utils/when-dom-ready');
var searchInit = require('../components/header/search');
var mobileInit = require('../components/header/mobile');

whenDOMReady(function initHeaders () {

  // Search Toggle
  searchInit();

  // Mobile Navigation
  mobileInit();

});


},{"../components/header/mobile":6,"../components/header/search":7,"../utils/when-dom-ready":25}],16:[function(require,module,exports){
var verifyjQuery = require('../utils/verify-jquery');

// jQuery Plugin

if (verifyjQuery(window)) {

  var $ = window.jQuery;

  // README: This is necessary because politespace doesn't properly export anything
  // in its package.json. TODO: Let's open a PR related to this so we can fix it in Politespace.js
  //
  var Politespace = require('../../../node_modules/politespace/src/politespace').Politespace;

  var componentName = 'politespace',
    enhancedAttr = 'data-enhanced',
    initSelector = '[data-" + componentName + "]:not([" + enhancedAttr + "])';

  $.fn[ componentName ] = function (){
    return this.each(function (){
      var polite = new Politespace(this);
      if(polite.type === 'number') {
        polite.createProxy();
      }

      $(this)
        .bind('input keydown', function () {
          polite.updateProxy();
        })
        .bind('blur', function () {
          $(this).closest('.politespace-proxy').addClass('active');
          polite.update();
          polite.updateProxy();
        })
        .bind('focus', function () {
          $(this).closest('.politespace-proxy').removeClass('active');
          polite.reset();
        })
        .data(componentName, polite);

      polite.update();
    });
  };

	// auto-init on enhance (which is called on domready)
  $(function () {
    $('[data-' + componentName + ']').politespace();
  });

}

},{"../../../node_modules/politespace/src/politespace":2,"../utils/verify-jquery":24}],17:[function(require,module,exports){
/**
 * This file defines key ECMAScript 5 methods that are used by the Standards
 * but may be missing in older browsers.
 */

/**
 * Array.prototype.forEach()
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach
 */

// Production steps of ECMA-262, Edition 5, 15.4.4.18
// Reference: http://es5.github.io/#x15.4.4.18
if (!Array.prototype.forEach) {

  Array.prototype.forEach = function (callback, thisArg) {

    var T, k;

    if (this === null) {
      throw new TypeError(' this is null or not defined');
    }

    // 1. Let O be the result of calling toObject() passing the
    // |this| value as the argument.
    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get() internal
    // method of O with the argument "length".
    // 3. Let len be toUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If isCallable(callback) is false, throw a TypeError exception. 
    // See: http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }

    // 5. If thisArg was supplied, let T be thisArg; else let
    // T be undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Let k be 0
    k = 0;

    // 7. Repeat, while k < len
    while (k < len) {

      var kValue;

      // a. Let Pk be ToString(k).
      //    This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the HasProperty
      //    internal method of O with argument Pk.
      //    This step can be combined with c
      // c. If kPresent is true, then
      if (k in O) {

        // i. Let kValue be the result of calling the Get internal
        // method of O with argument Pk.
        kValue = O[ k ];

        // ii. Call the Call internal method of callback with T as
        // the this value and argument list containing kValue, k, and O.
        callback.call(T, kValue, k, O);
      }
      // d. Increase k by 1.
      k++;
    }
    // 8. return undefined
  };
}


/**
 * Function.prototype.bind()
 * Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
 */

// Reference: http://es5.github.io/#x15.3.4.5
if (!Function.prototype.bind) {

  Function.prototype.bind = function (oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
      fToBind = this,
      fNOP    = function () {},
      fBound  = function () {
        return fToBind.apply(this instanceof fNOP ? this : oThis,
                aArgs.concat(Array.prototype.slice.call(arguments)));
      };

    if (this.prototype) {
      // Function.prototype doesn't have a prototype property
      fNOP.prototype = this.prototype; 
    }
    fBound.prototype = new fNOP();

    return fBound;
  };

}

},{}],18:[function(require,module,exports){
var dispatch = require('../utils/dispatch');
var select = require('../utils/select');
var whenDOMReady = require('../utils/when-dom-ready');

whenDOMReady(function () {

  // Fixing skip nav focus behavior in chrome
  var elSkipnav = select('.skipnav')[ 0 ];
  var elMainContent = select('#main-content')[ 0 ];

  if (elSkipnav) {
    dispatch(elSkipnav, 'click', function () {
      elMainContent.setAttribute('tabindex', '0');
    });
  }

  if (elMainContent) {
    dispatch(elMainContent, 'blur', function () {
      elMainContent.setAttribute('tabindex', '-1');
    });
  }
});

},{"../utils/dispatch":21,"../utils/select":23,"../utils/when-dom-ready":25}],19:[function(require,module,exports){
'use strict';

/**
 * The 'polyfills' file defines key ECMAScript 5 methods that may be
 * missing from older browsers, so must be loaded first.
 */
require('./initializers/polyfills');
require('./initializers/header');
require('./initializers/accordions');
require('./initializers/footer');
require('./initializers/skip-nav');
require('./initializers/forms');
require('./initializers/politespace');
require('./initializers/banner');

},{"./initializers/accordions":11,"./initializers/banner":12,"./initializers/footer":13,"./initializers/forms":14,"./initializers/header":15,"./initializers/politespace":16,"./initializers/polyfills":17,"./initializers/skip-nav":18}],20:[function(require,module,exports){
/**
 * Adds a class to a given HTML element.
 * @param {HTMLElement} element - The element to which the class will be added
 * @param {String} className - The name of the class to add
 */

module.exports = function addClass (element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }
};
},{}],21:[function(require,module,exports){
/**
 * Attaches a given listener function to a given element which is
 * triggered by a specified list of event types.
 * @param {HTMLElement} element - the element to which the listener will be attached
 * @param {String} eventTypes - space-separated list of event types which will trigger the listener
 * @param {Function} listener - the function to be executed
 * @returns {Object} - containing a <tt>trigger()</tt> method for executing the listener, and an <tt>off()</tt> method for detaching it
 */
module.exports = function dispatch (element, eventTypes, listener, options) {
  var eventTypeArray = eventTypes.split(/\s+/);

  var attach = function (e, t, d) {
    if (e.attachEvent) {
      e.attachEvent('on' + t, d, options);
    }
    if (e.addEventListener) {
      e.addEventListener(t, d, options);
    }
  };

  var trigger = function (e, t) {
    var fakeEvent;
    if ('createEvent' in document) {
      // modern browsers, IE9+
      fakeEvent = document.createEvent('HTMLEvents');
      fakeEvent.initEvent(t, false, true);
      e.dispatchEvent(fakeEvent);
    } else {
      // IE 8
      fakeEvent = document.createEventObject();
      fakeEvent.eventType = t;
      e.fireEvent('on'+e.eventType, fakeEvent);
    }
  };

  var detach = function (e, t, d) {
    if (e.detachEvent) {
      e.detachEvent('on' + t, d, options);
    }
    if (e.removeEventListener) {
      e.removeEventListener(t, d, options);
    }
  };

  eventTypeArray.forEach(function (eventType) {
    attach.call(null, element, eventType, listener);
  });

  return {
    trigger: function () {
      trigger.call(null, element, eventTypeArray[ 0 ]);
    },
    off: function () {
      eventTypeArray.forEach(function (eventType) {
        detach.call(null, element, eventType, listener);
      });
    },
  };
};

},{}],22:[function(require,module,exports){
/**
 * Removes a class from a given HTML elementement.
 * @param {HTMLElement} element - The element from which the class will be removed
 * @param {String} className - The name of the class to remove
 */

module.exports = function removeClass (element, className) {
  var classList = element.classList;

  if (classList !== undefined) {
    classList.remove(className);
  }
  else
  {
    classList = element.className.split(/\s+/);
    var newClassList = [];
    classList.forEach(function (c) {
      if (c !== className) {
        newClassList.push(c);
      }
    });
    element.className = newClassList.join(' ');
  }
};

},{}],23:[function(require,module,exports){
/**
 * @name select
 * @desc selects elements from the DOM by class selector or ID selector.
 * @param {string} selector - The selector to traverse the DOM with.
 * @param {HTMLElement} context - The context to traverse the DOM in.
 * @return {Array.HTMLElement} - An array of DOM nodes or an empty array.
 */
module.exports = function select (selector, context) {

  if (typeof selector !== 'string') {
    return [];
  }

  if ((context === undefined) || !isElement(context)) {
    context = window.document;
  }

  var selection = context.querySelectorAll(selector);

  return Array.prototype.slice.call(selection);

};

function isElement (value) {
  return !!value && typeof value === 'object' && value.nodeType === 1;
}
},{}],24:[function(require,module,exports){
/*
 * @name verifyjQuery
 * @desc Tests the given host object for the presence of jQuery. If no
 *       object is given, the <tt>window</tt> object is used.
 * @param {object} w - Object to test for jQuery.
 * @return {boolean} True if jQuery exists on the object.
 */
module.exports = function verifyjQuery (w) {
  w = w || window;
  return !!(w.jQuery && w.jQuery.fn && w.jQuery.fn.jquery);
};
},{}],25:[function(require,module,exports){
/*
 * @name DOMLoaded
 * @param {function} cb - The callback function to run when the DOM has loaded.
 */
module.exports = function DOMLoaded (cb) {
  // in case the document is already rendered
  if ('loading' !== document.readyState) {
    if (isFunction(cb)) {
      cb();
    }
  } else if (document.addEventListener) { // modern browsers
    document.addEventListener('DOMContentLoaded', cb);
  } else { // IE <= 8
    document.attachEvent('onreadystatechange', function (){
      if ('complete' === document.readyState) {
        if (isFunction(cb)) {
          cb();
        }
      }
    });
  }
};

function isFunction (arg) {
  return (typeof arg === 'function');
}
},{}]},{},[19])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvbG9kYXNoLmRlYm91bmNlL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3BvbGl0ZXNwYWNlL3NyYy9wb2xpdGVzcGFjZS5qcyIsInNyYy9qcy9jb21wb25lbnRzL2FjY29yZGlvbi5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Jhbm5lci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2Zvb3Rlci5qcyIsInNyYy9qcy9jb21wb25lbnRzL2hlYWRlci9tb2JpbGUuanMiLCJzcmMvanMvY29tcG9uZW50cy9oZWFkZXIvc2VhcmNoLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvdG9nZ2xlLWZpZWxkLW1hc2suanMiLCJzcmMvanMvY29tcG9uZW50cy90b2dnbGUtZm9ybS1pbnB1dC5qcyIsInNyYy9qcy9jb21wb25lbnRzL3ZhbGlkYXRvci5qcyIsInNyYy9qcy9pbml0aWFsaXplcnMvYWNjb3JkaW9ucy5qcyIsInNyYy9qcy9pbml0aWFsaXplcnMvYmFubmVyLmpzIiwic3JjL2pzL2luaXRpYWxpemVycy9mb290ZXIuanMiLCJzcmMvanMvaW5pdGlhbGl6ZXJzL2Zvcm1zLmpzIiwic3JjL2pzL2luaXRpYWxpemVycy9oZWFkZXIuanMiLCJzcmMvanMvaW5pdGlhbGl6ZXJzL3BvbGl0ZXNwYWNlLmpzIiwic3JjL2pzL2luaXRpYWxpemVycy9wb2x5ZmlsbHMuanMiLCJzcmMvanMvaW5pdGlhbGl6ZXJzL3NraXAtbmF2LmpzIiwic3JjL2pzL3N0YXJ0LmpzIiwic3JjL2pzL3V0aWxzL2FkZC1jbGFzcy5qcyIsInNyYy9qcy91dGlscy9kaXNwYXRjaC5qcyIsInNyYy9qcy91dGlscy9yZW1vdmUtY2xhc3MuanMiLCJzcmMvanMvdXRpbHMvc2VsZWN0LmpzIiwic3JjL2pzL3V0aWxzL3ZlcmlmeS1qcXVlcnkuanMiLCJzcmMvanMvdXRpbHMvd2hlbi1kb20tcmVhZHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDelhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIGFuZCB0cmFpbGluZyB3aGl0ZXNwYWNlLiAqL1xudmFyIHJlVHJpbSA9IC9eXFxzK3xcXHMrJC9nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmFkIHNpZ25lZCBoZXhhZGVjaW1hbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCYWRIZXggPSAvXlstK10weFswLTlhLWZdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJpbmFyeSBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNCaW5hcnkgPSAvXjBiWzAxXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBvY3RhbCBzdHJpbmcgdmFsdWVzLiAqL1xudmFyIHJlSXNPY3RhbCA9IC9eMG9bMC03XSskL2k7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlSW50ID0gcGFyc2VJbnQ7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgZ2xvYmFsYCBmcm9tIE5vZGUuanMuICovXG52YXIgZnJlZUdsb2JhbCA9IHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsICYmIGdsb2JhbC5PYmplY3QgPT09IE9iamVjdCAmJiBnbG9iYWw7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGEgZGVib3VuY2VkIGZ1bmN0aW9uIHRoYXQgZGVsYXlzIGludm9raW5nIGBmdW5jYCB1bnRpbCBhZnRlciBgd2FpdGBcbiAqIG1pbGxpc2Vjb25kcyBoYXZlIGVsYXBzZWQgc2luY2UgdGhlIGxhc3QgdGltZSB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHdhc1xuICogaW52b2tlZC4gVGhlIGRlYm91bmNlZCBmdW5jdGlvbiBjb21lcyB3aXRoIGEgYGNhbmNlbGAgbWV0aG9kIHRvIGNhbmNlbFxuICogZGVsYXllZCBgZnVuY2AgaW52b2NhdGlvbnMgYW5kIGEgYGZsdXNoYCBtZXRob2QgdG8gaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uXG4gKiBQcm92aWRlIGBvcHRpb25zYCB0byBpbmRpY2F0ZSB3aGV0aGVyIGBmdW5jYCBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGVcbiAqIGxlYWRpbmcgYW5kL29yIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIGB3YWl0YCB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWRcbiAqIHdpdGggdGhlIGxhc3QgYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnRcbiAqIGNhbGxzIHRvIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gcmV0dXJuIHRoZSByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgXG4gKiBpbnZvY2F0aW9uLlxuICpcbiAqICoqTm90ZToqKiBJZiBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2Agb3B0aW9ucyBhcmUgYHRydWVgLCBgZnVuY2AgaXNcbiAqIGludm9rZWQgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQgb25seSBpZiB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uXG4gKiBpcyBpbnZva2VkIG1vcmUgdGhhbiBvbmNlIGR1cmluZyB0aGUgYHdhaXRgIHRpbWVvdXQuXG4gKlxuICogSWYgYHdhaXRgIGlzIGAwYCBhbmQgYGxlYWRpbmdgIGlzIGBmYWxzZWAsIGBmdW5jYCBpbnZvY2F0aW9uIGlzIGRlZmVycmVkXG4gKiB1bnRpbCB0byB0aGUgbmV4dCB0aWNrLCBzaW1pbGFyIHRvIGBzZXRUaW1lb3V0YCB3aXRoIGEgdGltZW91dCBvZiBgMGAuXG4gKlxuICogU2VlIFtEYXZpZCBDb3JiYWNobydzIGFydGljbGVdKGh0dHBzOi8vY3NzLXRyaWNrcy5jb20vZGVib3VuY2luZy10aHJvdHRsaW5nLWV4cGxhaW5lZC1leGFtcGxlcy8pXG4gKiBmb3IgZGV0YWlscyBvdmVyIHRoZSBkaWZmZXJlbmNlcyBiZXR3ZWVuIGBfLmRlYm91bmNlYCBhbmQgYF8udGhyb3R0bGVgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gZGVib3VuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW3dhaXQ9MF0gVGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdG8gZGVsYXkuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnM9e31dIFRoZSBvcHRpb25zIG9iamVjdC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMubGVhZGluZz1mYWxzZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdGlvbnMubWF4V2FpdF1cbiAqICBUaGUgbWF4aW11bSB0aW1lIGBmdW5jYCBpcyBhbGxvd2VkIHRvIGJlIGRlbGF5ZWQgYmVmb3JlIGl0J3MgaW52b2tlZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW29wdGlvbnMudHJhaWxpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgZGVib3VuY2VkIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiAvLyBBdm9pZCBjb3N0bHkgY2FsY3VsYXRpb25zIHdoaWxlIHRoZSB3aW5kb3cgc2l6ZSBpcyBpbiBmbHV4LlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3Jlc2l6ZScsIF8uZGVib3VuY2UoY2FsY3VsYXRlTGF5b3V0LCAxNTApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHNlbmRNYWlsYCB3aGVuIGNsaWNrZWQsIGRlYm91bmNpbmcgc3Vic2VxdWVudCBjYWxscy5cbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCBfLmRlYm91bmNlKHNlbmRNYWlsLCAzMDAsIHtcbiAqICAgJ2xlYWRpbmcnOiB0cnVlLFxuICogICAndHJhaWxpbmcnOiBmYWxzZVxuICogfSkpO1xuICpcbiAqIC8vIEVuc3VyZSBgYmF0Y2hMb2dgIGlzIGludm9rZWQgb25jZSBhZnRlciAxIHNlY29uZCBvZiBkZWJvdW5jZWQgY2FsbHMuXG4gKiB2YXIgZGVib3VuY2VkID0gXy5kZWJvdW5jZShiYXRjaExvZywgMjUwLCB7ICdtYXhXYWl0JzogMTAwMCB9KTtcbiAqIHZhciBzb3VyY2UgPSBuZXcgRXZlbnRTb3VyY2UoJy9zdHJlYW0nKTtcbiAqIGpRdWVyeShzb3VyY2UpLm9uKCdtZXNzYWdlJywgZGVib3VuY2VkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIGRlYm91bmNlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgZGVib3VuY2VkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxhc3RBcmdzLFxuICAgICAgbGFzdFRoaXMsXG4gICAgICBtYXhXYWl0LFxuICAgICAgcmVzdWx0LFxuICAgICAgdGltZXJJZCxcbiAgICAgIGxhc3RDYWxsVGltZSxcbiAgICAgIGxhc3RJbnZva2VUaW1lID0gMCxcbiAgICAgIGxlYWRpbmcgPSBmYWxzZSxcbiAgICAgIG1heGluZyA9IGZhbHNlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIHdhaXQgPSB0b051bWJlcih3YWl0KSB8fCAwO1xuICBpZiAoaXNPYmplY3Qob3B0aW9ucykpIHtcbiAgICBsZWFkaW5nID0gISFvcHRpb25zLmxlYWRpbmc7XG4gICAgbWF4aW5nID0gJ21heFdhaXQnIGluIG9wdGlvbnM7XG4gICAgbWF4V2FpdCA9IG1heGluZyA/IG5hdGl2ZU1heCh0b051bWJlcihvcHRpb25zLm1heFdhaXQpIHx8IDAsIHdhaXQpIDogbWF4V2FpdDtcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG5cbiAgZnVuY3Rpb24gaW52b2tlRnVuYyh0aW1lKSB7XG4gICAgdmFyIGFyZ3MgPSBsYXN0QXJncyxcbiAgICAgICAgdGhpc0FyZyA9IGxhc3RUaGlzO1xuXG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgcmVzdWx0ID0gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gbGVhZGluZ0VkZ2UodGltZSkge1xuICAgIC8vIFJlc2V0IGFueSBgbWF4V2FpdGAgdGltZXIuXG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIC8vIFN0YXJ0IHRoZSB0aW1lciBmb3IgdGhlIHRyYWlsaW5nIGVkZ2UuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAvLyBJbnZva2UgdGhlIGxlYWRpbmcgZWRnZS5cbiAgICByZXR1cm4gbGVhZGluZyA/IGludm9rZUZ1bmModGltZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiByZW1haW5pbmdXYWl0KHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lLFxuICAgICAgICByZXN1bHQgPSB3YWl0IC0gdGltZVNpbmNlTGFzdENhbGw7XG5cbiAgICByZXR1cm4gbWF4aW5nID8gbmF0aXZlTWluKHJlc3VsdCwgbWF4V2FpdCAtIHRpbWVTaW5jZUxhc3RJbnZva2UpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkSW52b2tlKHRpbWUpIHtcbiAgICB2YXIgdGltZVNpbmNlTGFzdENhbGwgPSB0aW1lIC0gbGFzdENhbGxUaW1lLFxuICAgICAgICB0aW1lU2luY2VMYXN0SW52b2tlID0gdGltZSAtIGxhc3RJbnZva2VUaW1lO1xuXG4gICAgLy8gRWl0aGVyIHRoaXMgaXMgdGhlIGZpcnN0IGNhbGwsIGFjdGl2aXR5IGhhcyBzdG9wcGVkIGFuZCB3ZSdyZSBhdCB0aGVcbiAgICAvLyB0cmFpbGluZyBlZGdlLCB0aGUgc3lzdGVtIHRpbWUgaGFzIGdvbmUgYmFja3dhcmRzIGFuZCB3ZSdyZSB0cmVhdGluZ1xuICAgIC8vIGl0IGFzIHRoZSB0cmFpbGluZyBlZGdlLCBvciB3ZSd2ZSBoaXQgdGhlIGBtYXhXYWl0YCBsaW1pdC5cbiAgICByZXR1cm4gKGxhc3RDYWxsVGltZSA9PT0gdW5kZWZpbmVkIHx8ICh0aW1lU2luY2VMYXN0Q2FsbCA+PSB3YWl0KSB8fFxuICAgICAgKHRpbWVTaW5jZUxhc3RDYWxsIDwgMCkgfHwgKG1heGluZyAmJiB0aW1lU2luY2VMYXN0SW52b2tlID49IG1heFdhaXQpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRpbWVyRXhwaXJlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpO1xuICAgIGlmIChzaG91bGRJbnZva2UodGltZSkpIHtcbiAgICAgIHJldHVybiB0cmFpbGluZ0VkZ2UodGltZSk7XG4gICAgfVxuICAgIC8vIFJlc3RhcnQgdGhlIHRpbWVyLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgcmVtYWluaW5nV2FpdCh0aW1lKSk7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFpbGluZ0VkZ2UodGltZSkge1xuICAgIHRpbWVySWQgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyBPbmx5IGludm9rZSBpZiB3ZSBoYXZlIGBsYXN0QXJnc2Agd2hpY2ggbWVhbnMgYGZ1bmNgIGhhcyBiZWVuXG4gICAgLy8gZGVib3VuY2VkIGF0IGxlYXN0IG9uY2UuXG4gICAgaWYgKHRyYWlsaW5nICYmIGxhc3RBcmdzKSB7XG4gICAgICByZXR1cm4gaW52b2tlRnVuYyh0aW1lKTtcbiAgICB9XG4gICAgbGFzdEFyZ3MgPSBsYXN0VGhpcyA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gY2FuY2VsKCkge1xuICAgIGlmICh0aW1lcklkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcklkKTtcbiAgICB9XG4gICAgbGFzdEludm9rZVRpbWUgPSAwO1xuICAgIGxhc3RBcmdzID0gbGFzdENhbGxUaW1lID0gbGFzdFRoaXMgPSB0aW1lcklkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgcmV0dXJuIHRpbWVySWQgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IHRyYWlsaW5nRWRnZShub3coKSk7XG4gIH1cblxuICBmdW5jdGlvbiBkZWJvdW5jZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKSxcbiAgICAgICAgaXNJbnZva2luZyA9IHNob3VsZEludm9rZSh0aW1lKTtcblxuICAgIGxhc3RBcmdzID0gYXJndW1lbnRzO1xuICAgIGxhc3RUaGlzID0gdGhpcztcbiAgICBsYXN0Q2FsbFRpbWUgPSB0aW1lO1xuXG4gICAgaWYgKGlzSW52b2tpbmcpIHtcbiAgICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIGxlYWRpbmdFZGdlKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgICBpZiAobWF4aW5nKSB7XG4gICAgICAgIC8vIEhhbmRsZSBpbnZvY2F0aW9ucyBpbiBhIHRpZ2h0IGxvb3AuXG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgdGhlXG4gKiBbbGFuZ3VhZ2UgdHlwZV0oaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLWVjbWFzY3JpcHQtbGFuZ3VhZ2UtdHlwZXMpXG4gKiBvZiBgT2JqZWN0YC4gKGUuZy4gYXJyYXlzLCBmdW5jdGlvbnMsIG9iamVjdHMsIHJlZ2V4ZXMsIGBuZXcgTnVtYmVyKDApYCwgYW5kIGBuZXcgU3RyaW5nKCcnKWApXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3Qoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KF8ubm9vcCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0KHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gISF2YWx1ZSAmJiAodHlwZSA9PSAnb2JqZWN0JyB8fCB0eXBlID09ICdmdW5jdGlvbicpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLiBBIHZhbHVlIGlzIG9iamVjdC1saWtlIGlmIGl0J3Mgbm90IGBudWxsYFxuICogYW5kIGhhcyBhIGB0eXBlb2ZgIHJlc3VsdCBvZiBcIm9iamVjdFwiLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIG9iamVjdC1saWtlLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3RMaWtlKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UocmVUcmltLCAnJyk7XG4gIHZhciBpc0JpbmFyeSA9IHJlSXNCaW5hcnkudGVzdCh2YWx1ZSk7XG4gIHJldHVybiAoaXNCaW5hcnkgfHwgcmVJc09jdGFsLnRlc3QodmFsdWUpKVxuICAgID8gZnJlZVBhcnNlSW50KHZhbHVlLnNsaWNlKDIpLCBpc0JpbmFyeSA/IDIgOiA4KVxuICAgIDogKHJlSXNCYWRIZXgudGVzdCh2YWx1ZSkgPyBOQU4gOiArdmFsdWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRlYm91bmNlO1xuIiwiKGZ1bmN0aW9uKCB3ICl7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdHZhciBQb2xpdGVzcGFjZSA9IGZ1bmN0aW9uKCBlbGVtZW50ICkge1xuXHRcdGlmKCAhZWxlbWVudCApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvciggXCJQb2xpdGVzcGFjZSByZXF1aXJlcyBhbiBlbGVtZW50IGFyZ3VtZW50LlwiICk7XG5cdFx0fVxuXG5cdFx0aWYoICFlbGVtZW50LmdldEF0dHJpYnV0ZSApIHtcblx0XHRcdC8vIEN1dCB0aGUgbXVzdGFyZFxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG5cdFx0dGhpcy50eXBlID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSggXCJ0eXBlXCIgKTtcblx0XHR0aGlzLmRlbGltaXRlciA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoIFwiZGF0YS1kZWxpbWl0ZXJcIiApIHx8IFwiIFwiO1xuXHRcdHRoaXMucmV2ZXJzZSA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoIFwiZGF0YS1yZXZlcnNlXCIgKSAhPT0gbnVsbDtcblx0XHR0aGlzLmdyb3VwTGVuZ3RoID0gdGhpcy5lbGVtZW50LmdldEF0dHJpYnV0ZSggXCJkYXRhLWdyb3VwbGVuZ3RoXCIgKSB8fCAzO1xuXHR9O1xuXG5cdFBvbGl0ZXNwYWNlLnByb3RvdHlwZS5fZGl2aWRlSW50b0FycmF5ID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHZhciBzcGxpdCA9ICggJycgKyB0aGlzLmdyb3VwTGVuZ3RoICkuc3BsaXQoICcsJyApLFxuXHRcdFx0aXNVbmlmb3JtU3BsaXQgPSBzcGxpdC5sZW5ndGggPT09IDEsXG5cdFx0XHRkaXZpZGVkVmFsdWUgPSBbXSxcblx0XHRcdGxvb3BJbmRleCA9IDAsXG5cdFx0XHRncm91cExlbmd0aCxcblx0XHRcdHN1YnN0clN0YXJ0LFxuXHRcdFx0dXNlQ2hhckNvdW50O1xuXG5cdFx0d2hpbGUoIHNwbGl0Lmxlbmd0aCAmJiBsb29wSW5kZXggPCB2YWx1ZS5sZW5ndGggKSB7XG5cdFx0XHRpZiggaXNVbmlmb3JtU3BsaXQgKSB7XG5cdFx0XHRcdGdyb3VwTGVuZ3RoID0gc3BsaXRbIDAgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vIHVzZSB0aGUgbmV4dCBzcGxpdCBvciB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nIGlmIG9wZW4gZW5kZWQsIGFsYSBcIjMsMyxcIlxuXHRcdFx0XHRncm91cExlbmd0aCA9IHNwbGl0LnNoaWZ0KCkgfHwgdmFsdWUubGVuZ3RoIC0gbG9vcEluZGV4O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVc2UgbWluIGlmIHdl4oCZcmUgYXQgdGhlIGVuZCBvZiBhIHJldmVyc2VkIHN0cmluZ1xuXHRcdFx0Ly8gKHN1YnN0clN0YXJ0IGJlbG93IGdyb3dzIGxhcmdlciB0aGFuIHRoZSBzdHJpbmcgbGVuZ3RoKVxuXHRcdFx0dXNlQ2hhckNvdW50ID0gTWF0aC5taW4oIHBhcnNlSW50KCBncm91cExlbmd0aCwgMTAgKSwgdmFsdWUubGVuZ3RoIC0gbG9vcEluZGV4ICk7XG5cblx0XHRcdGlmKCB0aGlzLnJldmVyc2UgKSB7XG5cdFx0XHRcdHN1YnN0clN0YXJ0ID0gLTEgKiAodXNlQ2hhckNvdW50ICsgbG9vcEluZGV4KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHN1YnN0clN0YXJ0ID0gbG9vcEluZGV4O1xuXHRcdFx0fVxuXHRcdFx0ZGl2aWRlZFZhbHVlLnB1c2goIHZhbHVlLnN1YnN0ciggc3Vic3RyU3RhcnQsIHVzZUNoYXJDb3VudCApICk7XG5cdFx0XHRsb29wSW5kZXggKz0gdXNlQ2hhckNvdW50O1xuXHRcdH1cblxuXHRcdGlmKCB0aGlzLnJldmVyc2UgKSB7XG5cdFx0XHRkaXZpZGVkVmFsdWUucmV2ZXJzZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiBkaXZpZGVkVmFsdWU7XG5cdH07XG5cblx0UG9saXRlc3BhY2UucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uKCB2YWx1ZSApIHtcblx0XHR2YXIgdmFsID0gdGhpcy51bmZvcm1hdCggdmFsdWUgKTtcblxuXHRcdHJldHVybiB0aGlzLl9kaXZpZGVJbnRvQXJyYXkoIHZhbCApLmpvaW4oIHRoaXMuZGVsaW1pdGVyICk7XG5cdH07XG5cblx0UG9saXRlc3BhY2UucHJvdG90eXBlLnRyaW1NYXhsZW5ndGggPSBmdW5jdGlvbiggdmFsdWUgKSB7XG5cdFx0dmFyIG1heGxlbmd0aCA9IHRoaXMuZWxlbWVudC5nZXRBdHRyaWJ1dGUoIFwibWF4bGVuZ3RoXCIgKTtcblx0XHQvLyBOb3RlIGlucHV0IHR5cGU9XCJudW1iZXJcIiBtYXhsZW5ndGggZG9lcyBub3RoaW5nXG5cdFx0aWYoIG1heGxlbmd0aCApIHtcblx0XHRcdHZhbHVlID0gdmFsdWUuc3Vic3RyKCAwLCBtYXhsZW5ndGggKTtcblx0XHR9XG5cdFx0cmV0dXJuIHZhbHVlO1xuXHR9O1xuXG5cdFBvbGl0ZXNwYWNlLnByb3RvdHlwZS5nZXRWYWx1ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnRyaW1NYXhsZW5ndGgoIHRoaXMuZWxlbWVudC52YWx1ZSApO1xuXHR9O1xuXG5cdFBvbGl0ZXNwYWNlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLmVsZW1lbnQudmFsdWUgPSB0aGlzLnVzZVByb3h5KCkgPyB0aGlzLmdldFZhbHVlKCkgOiB0aGlzLmZvcm1hdCggdGhpcy5nZXRWYWx1ZSgpICk7XG5cdH07XG5cblx0UG9saXRlc3BhY2UucHJvdG90eXBlLnVuZm9ybWF0ID0gZnVuY3Rpb24oIHZhbHVlICkge1xuXHRcdHJldHVybiB2YWx1ZS5yZXBsYWNlKCBuZXcgUmVnRXhwKCAgdGhpcy5kZWxpbWl0ZXIsICdnJyApLCAnJyApO1xuXHR9O1xuXG5cdFBvbGl0ZXNwYWNlLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuZWxlbWVudC52YWx1ZSA9IHRoaXMudW5mb3JtYXQoIHRoaXMuZWxlbWVudC52YWx1ZSApO1xuXHR9O1xuXG5cdFBvbGl0ZXNwYWNlLnByb3RvdHlwZS51c2VQcm94eSA9IGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB0aGlzLnR5cGUgPT09IFwibnVtYmVyXCI7XG5cdH07XG5cblx0UG9saXRlc3BhY2UucHJvdG90eXBlLnVwZGF0ZVByb3h5ID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHByb3h5O1xuXHRcdGlmKCB0aGlzLnVzZVByb3h5KCkgKSB7XG5cdFx0XHRwcm94eSA9IHRoaXMuZWxlbWVudC5wYXJlbnROb2RlLmZpcnN0Q2hpbGQ7XG5cdFx0XHRwcm94eS5pbm5lckhUTUwgPSB0aGlzLmZvcm1hdCggdGhpcy5nZXRWYWx1ZSgpICk7XG5cdFx0XHRwcm94eS5zdHlsZS53aWR0aCA9IHRoaXMuZWxlbWVudC5vZmZzZXRXaWR0aCArIFwicHhcIjtcblx0XHR9XG5cdH07XG5cblx0UG9saXRlc3BhY2UucHJvdG90eXBlLmNyZWF0ZVByb3h5ID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYoICF0aGlzLnVzZVByb3h5KCkgKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gZ2V0U3R5bGUoIGVsLCBwcm9wICkge1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBlbCwgbnVsbCApLmdldFByb3BlcnR5VmFsdWUoIHByb3AgKTtcblx0XHR9XG5cdFx0ZnVuY3Rpb24gc3VtU3R5bGVzKCBlbCwgcHJvcHMgKSB7XG5cdFx0XHR2YXIgdG90YWwgPSAwO1xuXHRcdFx0Zm9yKCB2YXIgaj0wLCBrPXByb3BzLmxlbmd0aDsgajxrOyBqKysgKSB7XG5cdFx0XHRcdHRvdGFsICs9IHBhcnNlRmxvYXQoIGdldFN0eWxlKCBlbCwgcHJvcHNbIGogXSApICk7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdG90YWw7XG5cdFx0fVxuXG5cdFx0dmFyIHBhcmVudCA9IHRoaXMuZWxlbWVudC5wYXJlbnROb2RlO1xuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiZGl2XCIgKTtcblx0XHR2YXIgcHJveHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImRpdlwiICk7XG5cdFx0cHJveHkuc3R5bGUuZm9udCA9IGdldFN0eWxlKCB0aGlzLmVsZW1lbnQsIFwiZm9udFwiICk7XG5cdFx0cHJveHkuc3R5bGUucGFkZGluZ0xlZnQgPSBzdW1TdHlsZXMoIHRoaXMuZWxlbWVudCwgWyBcInBhZGRpbmctbGVmdFwiLCBcImJvcmRlci1sZWZ0LXdpZHRoXCIgXSApICsgXCJweFwiO1xuXHRcdHByb3h5LnN0eWxlLnBhZGRpbmdSaWdodCA9IHN1bVN0eWxlcyggdGhpcy5lbGVtZW50LCBbIFwicGFkZGluZy1yaWdodFwiLCBcImJvcmRlci1yaWdodC13aWR0aFwiIF0gKSArIFwicHhcIjtcblx0XHRwcm94eS5zdHlsZS50b3AgPSBzdW1TdHlsZXMoIHRoaXMuZWxlbWVudCwgWyBcInBhZGRpbmctdG9wXCIsIFwiYm9yZGVyLXRvcC13aWR0aFwiLCBcIm1hcmdpbi10b3BcIiBdICkgKyBcInB4XCI7XG5cblx0XHRlbC5hcHBlbmRDaGlsZCggcHJveHkgKTtcblx0XHRlbC5jbGFzc05hbWUgPSBcInBvbGl0ZXNwYWNlLXByb3h5IGFjdGl2ZVwiO1xuXHRcdHZhciBmb3JtRWwgPSBwYXJlbnQucmVwbGFjZUNoaWxkKCBlbCwgdGhpcy5lbGVtZW50ICk7XG5cdFx0ZWwuYXBwZW5kQ2hpbGQoIGZvcm1FbCApO1xuXG5cdFx0dGhpcy51cGRhdGVQcm94eSgpO1xuXHR9O1xuXG5cdHcuUG9saXRlc3BhY2UgPSBQb2xpdGVzcGFjZTtcblxufSggdGhpcyApKTtcbiIsInZhciBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcblxuLyoqXG4gKiBAbmFtZSBzaG93UGFuZWxMaXN0ZW5lclxuICogQGRlc2MgVGhlIGV2ZW50IGhhbmRsZXIgZm9yIGNsaWNraW5nIG9uIGEgYnV0dG9uIGluIGFuIGFjY29yZGlvbi5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsIC0gQW4gSFRNTCBlbGVtZW50IG1vc3QgbGlrZWx5IGEgPGJ1dHRvbj4uXG4gKiBAcGFyYW0ge09iamVjdH0gZXYgLSBBIERPTSBldmVudCBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIHNob3dQYW5lbExpc3RlbmVyIChlbCwgZXYpIHtcbiAgdmFyIGV4cGFuZGVkID0gZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJztcbiAgdGhpcy5oaWRlQWxsKCk7XG4gIGlmICghZXhwYW5kZWQpIHtcbiAgICB0aGlzLnNob3coZWwpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuLyoqXG4gKiBAY2xhc3MgQWNjb3JkaW9uXG4gKlxuICogQW4gYWNjb3JkaW9uIGNvbXBvbmVudC5cbiAqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbCBBbiBIVE1MRWxlbWVudCB0byB0dXJuIGludG8gYW4gYWNjb3JkaW9uLlxuICovXG5mdW5jdGlvbiBBY2NvcmRpb24gKGVsKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdGhpcy5yb290ID0gZWw7XG5cbiAgLy8gZGVsZWdhdGUgY2xpY2sgZXZlbnRzIG9uIGVhY2ggPGJ1dHRvbj5cbiAgdmFyIGJ1dHRvbnMgPSBzZWxlY3QoJ2J1dHRvbicsIHRoaXMucm9vdCk7XG4gIGJ1dHRvbnMuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICBpZiAoZWwuYXR0YWNoRXZlbnQpIHtcbiAgICAgIGVsLmF0dGFjaEV2ZW50KCdvbmNsaWNrJywgc2hvd1BhbmVsTGlzdGVuZXIuYmluZChzZWxmLCBlbCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNob3dQYW5lbExpc3RlbmVyLmJpbmQoc2VsZiwgZWwpKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIGZpbmQgdGhlIGZpcnN0IGV4cGFuZGVkIGJ1dHRvblxuICB2YXIgZXhwYW5kZWQgPSB0aGlzLiQoJ2J1dHRvblthcmlhLWV4cGFuZGVkPXRydWVdJylbIDAgXTtcbiAgdGhpcy5oaWRlQWxsKCk7XG4gIGlmIChleHBhbmRlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpcy5zaG93KGV4cGFuZGVkKTtcbiAgfVxufVxuXG4vKipcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQHJldHVybiB7QXJyYXl9XG4gKi9cbkFjY29yZGlvbi5wcm90b3R5cGUuJCA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuICByZXR1cm4gc2VsZWN0KHNlbGVjdG9yLCB0aGlzLnJvb3QpO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBidXR0b25cbiAqIEByZXR1cm4ge0FjY29yZGlvbn1cbiAqL1xuQWNjb3JkaW9uLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24gKGJ1dHRvbikge1xuICB2YXIgc2VsZWN0b3IgPSBidXR0b24uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJyksXG4gICAgY29udGVudCA9IHRoaXMuJCgnIycgKyBzZWxlY3RvcilbIDAgXTtcblxuICBidXR0b24uc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICBjb250ZW50LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGJ1dHRvblxuICogQHJldHVybiB7QWNjb3JkaW9ufVxuICovXG5BY2NvcmRpb24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbiAoYnV0dG9uKSB7XG4gIHZhciBzZWxlY3RvciA9IGJ1dHRvbi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSxcbiAgICBjb250ZW50ID0gdGhpcy4kKCcjJyArIHNlbGVjdG9yKVsgMCBdO1xuXG4gIGJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKTtcbiAgY29udGVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQHJldHVybiB7QWNjb3JkaW9ufVxuICovXG5BY2NvcmRpb24ucHJvdG90eXBlLmhpZGVBbGwgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBzZWxmID0gdGhpcztcbiAgdmFyIGJ1dHRvbnMgPSB0aGlzLiQoJ3VsID4gbGkgPiBidXR0b24sIC51c2EtYWNjb3JkaW9uLWJ1dHRvbicpO1xuICBidXR0b25zLmZvckVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgIHNlbGYuaGlkZShidXR0b24pO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEFjY29yZGlvbjtcbiIsInZhciBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcbnZhciBhZGRDbGFzcyA9IHJlcXVpcmUoJy4uL3V0aWxzL2FkZC1jbGFzcycpO1xudmFyIHJlbW92ZUNsYXNzID0gcmVxdWlyZSgnLi4vdXRpbHMvcmVtb3ZlLWNsYXNzJyk7XG52YXIgZGlzcGF0Y2ggPSByZXF1aXJlKCcuLi91dGlscy9kaXNwYXRjaCcpO1xuXG5mdW5jdGlvbiBoZWFkZXJDbGlja0hhbmRsZXIgKGV2ZW50KSB7XG4gIChldmVudC5wcmV2ZW50RGVmYXVsdCkgPyBldmVudC5wcmV2ZW50RGVmYXVsdCgpIDogZXZlbnQucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgXG4gIHZhciBleHBhbmRlZCA9IGV2ZW50LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnO1xuICB2YXIgdG9nZ2xlQ2xhc3MgPSBleHBhbmRlZCA/IGFkZENsYXNzIDogcmVtb3ZlQ2xhc3M7XG4gIHRvZ2dsZUNsYXNzKHRoaXMsICd1c2EtYmFubmVyLWhlYWRlci1leHBhbmRlZCcpO1xufVxuXG5mdW5jdGlvbiBiYW5uZXJJbml0ICgpIHtcbiAgdmFyIGhlYWRlcnMgPSBzZWxlY3QoJy51c2EtYmFubmVyLWhlYWRlcicpO1xuXG4gIGhlYWRlcnMuZm9yRWFjaChmdW5jdGlvbiAoaGVhZGVyKSB7XG4gICAgdmFyIGhlYWRlckNsaWNrID0gaGVhZGVyQ2xpY2tIYW5kbGVyLmJpbmQoaGVhZGVyKTtcbiAgICBzZWxlY3QoJ1thcmlhLWNvbnRyb2xzXScpLmZvckVhY2goZnVuY3Rpb24gKGJ1dHRvbikge1xuICAgICAgZGlzcGF0Y2goYnV0dG9uLCAnY2xpY2snLCBoZWFkZXJDbGljayk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhbm5lckluaXQ7IiwidmFyIHNlbGVjdCA9IHJlcXVpcmUoJy4uL3V0aWxzL3NlbGVjdCcpO1xudmFyIGFkZENsYXNzID0gcmVxdWlyZSgnLi4vdXRpbHMvYWRkLWNsYXNzJyk7XG52YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCcuLi91dGlscy9yZW1vdmUtY2xhc3MnKTtcbnZhciBkaXNwYXRjaCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Rpc3BhdGNoJyk7XG5cbmZ1bmN0aW9uIGdldFNpYmxpbmdzIChlbCkge1xuICB2YXIgbiA9IGVsLnBhcmVudE5vZGUuZmlyc3RDaGlsZDtcbiAgdmFyIG1hdGNoZXMgPSBbXTtcblxuICB3aGlsZSAobikge1xuICAgIGlmIChuLm5vZGVUeXBlID09IDEgJiYgbiAhPSBlbCkge1xuICAgICAgbWF0Y2hlcy5wdXNoKG4pO1xuICAgIH1cbiAgICBuID0gbi5uZXh0U2libGluZztcbiAgfVxuXG4gIHJldHVybiBtYXRjaGVzO1xufVxuXG52YXIgc2hvd1BhbmVsTGlzdGVuZXIgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBwYW5lbFRvU2hvdyA9IHRoaXMucGFyZW50Tm9kZTtcbiAgdmFyIG90aGVyUGFuZWxzID0gZ2V0U2libGluZ3MocGFuZWxUb1Nob3cpO1xuICByZW1vdmVDbGFzcyhwYW5lbFRvU2hvdywgJ2hpZGRlbicpO1xuICBvdGhlclBhbmVscy5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgIGFkZENsYXNzKGVsLCAnaGlkZGVuJyk7XG4gIH0pO1xufTtcblxudmFyIGV2ZW50cz0gW107XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZm9vdGVyQWNjb3JkaW9uICgpIHtcblxuICB2YXIgbmF2TGlzdCA9IHNlbGVjdCgnLnVzYS1mb290ZXItYmlnIG5hdiB1bCcpO1xuICB2YXIgcHJpbWFyeUxpbmsgPSBzZWxlY3QoJy51c2EtZm9vdGVyLWJpZyBuYXYgLnVzYS1mb290ZXItcHJpbWFyeS1saW5rJyk7XG5cbiAgaWYgKGV2ZW50cy5sZW5ndGgpIHtcbiAgICBldmVudHMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgZS5vZmYoKTtcbiAgICB9KTtcbiAgICBldmVudHMgPSBbXTtcbiAgfVxuXG4gIGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8IDYwMCkge1xuXG4gICAgbmF2TGlzdC5mb3JFYWNoKGZ1bmN0aW9uIChlbCkge1xuICAgICAgYWRkQ2xhc3MoZWwsICdoaWRkZW4nKTtcbiAgICB9KTtcblxuICAgIHByaW1hcnlMaW5rLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgICBldmVudHMucHVzaChcbiAgICAgICAgZGlzcGF0Y2goZWwsICdjbGljaycsIHNob3dQYW5lbExpc3RlbmVyKVxuICAgICAgKTtcbiAgICB9KTtcblxuICB9IGVsc2Uge1xuICAgIG5hdkxpc3QuZm9yRWFjaChmdW5jdGlvbiAoZWwpIHtcbiAgICAgIHJlbW92ZUNsYXNzKGVsLCAnaGlkZGVuJyk7XG4gICAgfSk7XG4gIH1cbn07XG4iLCJ2YXIgc2VsZWN0ID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvc2VsZWN0Jyk7XG52YXIgYWRkQ2xhc3MgPSByZXF1aXJlKCcuLi8uLi91dGlscy9hZGQtY2xhc3MnKTtcbnZhciByZW1vdmVDbGFzcyA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3JlbW92ZS1jbGFzcycpO1xudmFyIGRpc3BhdGNoID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvZGlzcGF0Y2gnKTtcblxuZnVuY3Rpb24gdG9nZ2xlQ2xhc3MgKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC50b2dnbGUoY2xhc3NOYW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtb2JpbGVJbml0ICgpIHtcbiAgdmFyIG5hdkVsZW1lbnRzID0gc2VsZWN0KCcudXNhLW1lbnUtYnRuLCAudXNhLW92ZXJsYXksIC51c2EtbmF2LWNsb3NlJyk7XG4gIHZhciB0b2dnbGVFbGVtZW50cyA9IHNlbGVjdCgnLnVzYS1vdmVybGF5LCAudXNhLW5hdicpO1xuICB2YXIgbmF2Q2xvc2VFbGVtZW50ID0gc2VsZWN0KCcudXNhLW5hdi1jbG9zZScpWyAwIF07XG5cbiAgbmF2RWxlbWVudHMuZm9yRWFjaChmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIGRpc3BhdGNoKGVsZW1lbnQsICdjbGljayB0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIHRvZ2dsZUVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgdG9nZ2xlQ2xhc3MoZWxlbWVudCwgJ2lzLXZpc2libGUnKTtcbiAgICAgIH0pO1xuICAgICAgdG9nZ2xlQ2xhc3MoZG9jdW1lbnQuYm9keSwgJ3VzYS1tb2JpbGVfbmF2LWFjdGl2ZScpO1xuICAgICAgbmF2Q2xvc2VFbGVtZW50LmZvY3VzKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG1vYmlsZUluaXQ7IiwidmFyIHNlbGVjdCA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL3NlbGVjdCcpO1xudmFyIGFkZENsYXNzID0gcmVxdWlyZSgnLi4vLi4vdXRpbHMvYWRkLWNsYXNzJyk7XG52YXIgcmVtb3ZlQ2xhc3MgPSByZXF1aXJlKCcuLi8uLi91dGlscy9yZW1vdmUtY2xhc3MnKTtcbnZhciBkaXNwYXRjaCA9IHJlcXVpcmUoJy4uLy4uL3V0aWxzL2Rpc3BhdGNoJyk7XG5cbnZhciBzZWFyY2hGb3JtLCBzZWFyY2hCdXR0b24sIHNlYXJjaEJ1dHRvbkNvbnRhaW5lciwgc2VhcmNoRGlzcGF0Y2hlcjtcblxuZnVuY3Rpb24gc2VhcmNoQnV0dG9uQ2xpY2tIYW5kbGVyIChldmVudCkge1xuICBpZiAoaXNPcGVuKHNlYXJjaEZvcm0pKSB7XG4gICAgY2xvc2VTZWFyY2goKTtcbiAgfSBlbHNlIHtcbiAgICBvcGVuU2VhcmNoKCk7XG4gICAgc2VhcmNoRGlzcGF0Y2hlciA9IGRpc3BhdGNoKGRvY3VtZW50LmJvZHksICdjbGljayB0b3VjaHN0YXJ0Jywgc2VhcmNoT3BlbkNsaWNrSGFuZGxlcik7XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHNlYXJjaE9wZW5DbGlja0hhbmRsZXIgKGV2ZW50KSB7XG4gIHZhciB0YXJnZXQgPSBldmVudC50YXJnZXQ7XG4gIGlmICghIHNlYXJjaEZvcm1Db250YWlucyh0YXJnZXQpKSB7XG4gICAgY2xvc2VTZWFyY2goKTtcbiAgICBzZWFyY2hEaXNwYXRjaGVyLm9mZigpO1xuICB9XG59XG5cbmZ1bmN0aW9uIG9wZW5TZWFyY2ggKCkge1xuICBhZGRDbGFzcyhzZWFyY2hGb3JtLCAnaXMtdmlzaWJsZScpO1xuICBhZGRDbGFzcyhzZWFyY2hCdXR0b24sICdpcy1oaWRkZW4nKTtcbn1cblxuZnVuY3Rpb24gY2xvc2VTZWFyY2ggKCkge1xuICByZW1vdmVDbGFzcyhzZWFyY2hGb3JtLCAnaXMtdmlzaWJsZScpO1xuICByZW1vdmVDbGFzcyhzZWFyY2hCdXR0b24sICdpcy1oaWRkZW4nKTtcbn1cblxuZnVuY3Rpb24gaXNPcGVuIChlbGVtZW50KSB7XG4gIHZhciBjbGFzc1JlZ2V4cCA9IG5ldyBSZWdFeHAoJyhefCApaXMtdmlzaWJsZSggfCQpJywgJ2dpJyk7XG4gIHJldHVybiBjbGFzc1JlZ2V4cC50ZXN0KGVsZW1lbnQuY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gc2VhcmNoRm9ybUNvbnRhaW5zIChlbGVtZW50KSB7XG4gIHJldHVybiAoc2VhcmNoRm9ybSAmJiBzZWFyY2hGb3JtLmNvbnRhaW5zKGVsZW1lbnQpKSB8fFxuICAgICAgICAgKHNlYXJjaEJ1dHRvbkNvbnRhaW5lciAmJiBzZWFyY2hCdXR0b25Db250YWluZXIuY29udGFpbnMoZWxlbWVudCkpO1xufVxuXG5mdW5jdGlvbiBzZWFyY2hJbml0ICgpIHtcbiAgc2VhcmNoRm9ybSA9IHNlbGVjdCgnLmpzLXNlYXJjaC1mb3JtJylbIDAgXTtcbiAgc2VhcmNoQnV0dG9uID0gc2VsZWN0KCcuanMtc2VhcmNoLWJ1dHRvbicpWyAwIF07XG4gIHNlYXJjaEJ1dHRvbkNvbnRhaW5lciA9IHNlbGVjdCgnLmpzLXNlYXJjaC1idXR0b24tY29udGFpbmVyJylbIDAgXTtcblxuICBpZiAoc2VhcmNoQnV0dG9uICYmIHNlYXJjaEZvcm0pIHtcbiAgICBkaXNwYXRjaChzZWFyY2hCdXR0b24sICdjbGljayB0b3VjaHN0YXJ0Jywgc2VhcmNoQnV0dG9uQ2xpY2tIYW5kbGVyKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNlYXJjaEluaXQ7IiwiLyoqXG4gKiBGbGlwcyBnaXZlbiBJTlBVVCBlbGVtZW50cyBiZXR3ZWVuIG1hc2tlZCAoaGlkaW5nIHRoZSBmaWVsZCB2YWx1ZSkgYW5kIHVubWFza2VkXG4gKiBAcGFyYW0ge0FycmF5LkhUTUxFbGVtZW50fSBmaWVsZHMgLSBBbiBhcnJheSBvZiBJTlBVVCBlbGVtZW50c1xuICogQHBhcmFtIHtCb29sZWFufSBtYXNrIC0gV2hldGhlciB0aGUgbWFzayBzaG91bGQgYmUgYXBwbGllZCwgaGlkaW5nIHRoZSBmaWVsZCB2YWx1ZVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmaWVsZHMsIG1hc2spIHtcbiAgZmllbGRzLmZvckVhY2goZnVuY3Rpb24gKGZpZWxkKSB7XG4gICAgZmllbGQuc2V0QXR0cmlidXRlKCdhdXRvY2FwaXRhbGl6ZScsICdvZmYnKTtcbiAgICBmaWVsZC5zZXRBdHRyaWJ1dGUoJ2F1dG9jb3JyZWN0JywgJ29mZicpO1xuICAgIGZpZWxkLnNldEF0dHJpYnV0ZSgndHlwZScsIG1hc2sgPyAncGFzc3dvcmQnIDogJ3RleHQnKTtcbiAgfSk7XG59O1xuIiwidmFyIHRvZ2dsZUZpZWxkTWFzayA9IHJlcXVpcmUoJy4vdG9nZ2xlLWZpZWxkLW1hc2snKTtcbnZhciBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcblxuLyoqXG4gKiBDb21wb25lbnQgdGhhdCBkZWNvcmF0ZXMgYW4gSFRNTCBlbGVtZW50IHdpdGggdGhlIGFiaWxpdHkgdG8gdG9nZ2xlIHRoZVxuICogbWFza2VkIHN0YXRlIG9mIGFuIGlucHV0IGZpZWxkIChsaWtlIGEgcGFzc3dvcmQpIHdoZW4gY2xpY2tlZC5cbiAqIFRoZSBpZHMgb2YgdGhlIGZpZWxkcyB0byBiZSBtYXNrZWQgd2lsbCBiZSBwdWxsZWQgZGlyZWN0bHkgZnJvbSB0aGUgYnV0dG9uJ3NcbiAqIGBhcmlhLWNvbnRyb2xzYCBhdHRyaWJ1dGUuXG4gKlxuICogQHBhcmFtICB7SFRNTEVsZW1lbnR9IGVsICAgIFBhcmVudCBlbGVtZW50IGNvbnRhaW5pbmcgdGhlIGZpZWxkcyB0byBiZSBtYXNrZWRcbiAqIEBwYXJhbSAge1N0cmluZ30gc2hvd1RleHQgICBCdXR0b24gdGV4dCBzaG93biB3aGVuIGZpZWxkIGlzIG1hc2tlZFxuICogQHBhcmFtICB7U3RyaW5nfSBoaWRlVGV4dCAgIEJ1dHRvbiB0ZXh0IHNob3cgd2hlbiBmaWVsZCBpcyB1bm1hc2tlZFxuICogQHJldHVybiB7fVxuICovXG52YXIgdG9nZ2xlRm9ybUlucHV0ID0gZnVuY3Rpb24gKGVsLCBzaG93VGV4dCwgaGlkZVRleHQpIHtcbiAgdmFyIGRlZmF1bHRTZWxlY3RvcnMgPSBlbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKTtcblxuICBpZiAoIWRlZmF1bHRTZWxlY3RvcnMgfHwgZGVmYXVsdFNlbGVjdG9ycy50cmltKCkubGVuZ3RoID09PSAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdEaWQgeW91IGZvcmdldCB0byBkZWZpbmUgc2VsZWN0b3JzIGluIHRoZSBhcmlhLWNvbnRyb2xzIGF0dHJpYnV0ZT8gQ2hlY2sgZWxlbWVudCAnICsgZWwub3V0ZXJIVE1MKTtcbiAgfVxuXG4gIHZhciBmaWVsZFNlbGVjdG9yID0gZ2V0U2VsZWN0b3JzKGRlZmF1bHRTZWxlY3RvcnMpO1xuICB2YXIgZm9ybUVsZW1lbnQgPSBnZXRGb3JtUGFyZW50KGVsKTtcbiAgaWYgKCFmb3JtRWxlbWVudCkge1xuICAgIHRocm93IG5ldyBFcnJvcigndG9nZ2xlRm9ybUlucHV0KCkgbmVlZHMgdGhlIHN1cHBsaWVkIGVsZW1lbnQgdG8gYmUgaW5zaWRlIGEgPGZvcm0+LiBDaGVjayBlbGVtZW50ICcgKyBlbC5vdXRlckhUTUwpO1xuICB9XG4gIHZhciBmaWVsZHMgPSBzZWxlY3QoZmllbGRTZWxlY3RvciwgZm9ybUVsZW1lbnQpO1xuICB2YXIgbWFza2VkID0gZmFsc2U7XG5cbiAgdmFyIHRvZ2dsZUNsaWNrTGlzdGVuZXIgPSBmdW5jdGlvbiAoZXYpIHtcbiAgICBldi5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHRvZ2dsZUZpZWxkTWFzayhmaWVsZHMsIG1hc2tlZCk7XG4gICAgZWwudGV4dENvbnRlbnQgPSBtYXNrZWQgPyBzaG93VGV4dCA6IGhpZGVUZXh0O1xuICAgIG1hc2tlZCA9ICFtYXNrZWQ7XG4gIH07XG5cbiAgaWYgKGVsLmF0dGFjaEV2ZW50KSB7XG4gICAgZWwuYXR0YWNoRXZlbnQoJ29uY2xpY2snLCB0b2dnbGVDbGlja0xpc3RlbmVyKTtcbiAgfSBlbHNlIHtcbiAgICBlbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRvZ2dsZUNsaWNrTGlzdGVuZXIpO1xuICB9XG59O1xuXG4vKipcbiAqIEhlbHBlciBmdW5jdGlvbiB0byB0dXJuIGEgc3RyaW5nIG9mIGlkcyBpbnRvIHZhbGlkIHNlbGVjdG9yc1xuICogQHBhcmFtICB7U3RyaW5nfSBzZWxlY3RvcnMgU3BhY2Ugc2VwYXJhdGVkIGxpc3Qgb2YgaWRzIG9mIGZpZWxkcyB0byBiZSBtYXNrZWRcbiAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIENvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIHNlbGVjdG9yc1xuICovXG5mdW5jdGlvbiBnZXRTZWxlY3RvcnMgKHNlbGVjdG9ycykge1xuICB2YXIgc2VsZWN0b3JzTGlzdCA9IHNlbGVjdG9ycy5zcGxpdCgnICcpO1xuXG4gIHJldHVybiBzZWxlY3RvcnNMaXN0Lm1hcChmdW5jdGlvbiAoc2VsZWN0b3IpIHtcbiAgICByZXR1cm4gJyMnICsgc2VsZWN0b3I7XG4gIH0pLmpvaW4oJywgJyk7XG59XG5cbi8qKlxuICogU2VhcmNoZXMgdXAgdGhlIHRyZWUgZnJvbSB0aGUgZWxlbWVudCB0byBmaW5kIGEgRm9ybSBlbGVtZW50LCBhbmQgcmV0dXJucyBpdCxcbiAqIG9yIG51bGwgaWYgbm8gRm9ybSBpcyBmb3VuZFxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWwgLSBDaGlsZCBlbGVtZW50IHRvIHN0YXJ0IHNlYXJjaFxuICovXG5mdW5jdGlvbiBnZXRGb3JtUGFyZW50IChlbCkge1xuICB3aGlsZSAoZWwgJiYgZWwudGFnTmFtZSAhPT0gJ0ZPUk0nKSB7XG4gICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICB9XG4gIHJldHVybiBlbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b2dnbGVGb3JtSW5wdXQ7XG4iLCJ2YXIgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG52YXIgYWRkQ2xhc3MgPSByZXF1aXJlKCcuLi91dGlscy9hZGQtY2xhc3MnKTtcbnZhciByZW1vdmVDbGFzcyA9IHJlcXVpcmUoJy4uL3V0aWxzL3JlbW92ZS1jbGFzcycpO1xudmFyIGRpc3BhdGNoID0gcmVxdWlyZSgnLi4vdXRpbHMvZGlzcGF0Y2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiB2YWxpZGF0b3IgKGVsKSB7XG4gIHZhciBkYXRhID0gZ2V0RGF0YShlbCksXG4gICAga2V5LFxuICAgIHZhbGlkYXRvck5hbWUsXG4gICAgdmFsaWRhdG9yUGF0dGVybixcbiAgICB2YWxpZGF0b3JDaGVja2JveCxcbiAgICBjaGVja0xpc3QgPSBzZWxlY3QoZGF0YS52YWxpZGF0aW9uZWxlbWVudClbIDAgXTtcblxuICBmdW5jdGlvbiB2YWxpZGF0ZSAoKSB7XG4gICAgZm9yIChrZXkgaW4gZGF0YSkge1xuICAgICAgaWYgKGtleS5zdGFydHNXaXRoKCd2YWxpZGF0ZScpKSB7XG4gICAgICAgIHZhbGlkYXRvck5hbWUgPSBrZXkuc3BsaXQoJ3ZhbGlkYXRlJylbIDEgXTtcbiAgICAgICAgdmFsaWRhdG9yUGF0dGVybiA9IG5ldyBSZWdFeHAoZGF0YVsga2V5IF0pO1xuICAgICAgICB2YWxpZGF0b3JTZWxlY3RvciA9ICdbZGF0YS12YWxpZGF0b3I9JyArIHZhbGlkYXRvck5hbWUgKyAnXSc7XG4gICAgICAgIHZhbGlkYXRvckNoZWNrYm94ID0gc2VsZWN0KHZhbGlkYXRvclNlbGVjdG9yLCBjaGVja0xpc3QpWyAwIF07XG5cbiAgICAgICAgaWYgKCF2YWxpZGF0b3JQYXR0ZXJuLnRlc3QoZWwudmFsdWUpKSB7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3ModmFsaWRhdG9yQ2hlY2tib3gsICd1c2EtY2hlY2tsaXN0LWNoZWNrZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBhZGRDbGFzcyh2YWxpZGF0b3JDaGVja2JveCwgJ3VzYS1jaGVja2xpc3QtY2hlY2tlZCcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2goZWwsICdrZXl1cCcsIHZhbGlkYXRlKTtcbn07XG5cbi8qKlxuICogRXh0cmFjdHMgYXR0cmlidXRlcyBuYW1lZCB3aXRoIHRoZSBwYXR0ZXJuIFwiZGF0YS1bTkFNRV1cIiBmcm9tIGEgZ2l2ZW5cbiAqIEhUTUxFbGVtZW50LCB0aGVuIHJldHVybnMgYW4gb2JqZWN0IHBvcHVsYXRlZCB3aXRoIHRoZSBOQU1FL3ZhbHVlIHBhaXJzLlxuICogQW55IGh5cGhlbnMgaW4gTkFNRSBhcmUgcmVtb3ZlZC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cblxuZnVuY3Rpb24gZ2V0RGF0YSAoZWwpIHtcbiAgaWYgKCFlbC5oYXNBdHRyaWJ1dGVzKCkpIHJldHVybjtcbiAgdmFyIGRhdGEgPSB7fTtcbiAgdmFyIGF0dHJzID0gZWwuYXR0cmlidXRlcztcbiAgZm9yICh2YXIgaSA9IGF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgdmFyIG1hdGNoZXMgPSBhdHRyc1sgaSBdLm5hbWUubWF0Y2goL2RhdGEtKC4qKS9pKTtcbiAgICBpZiAobWF0Y2hlcyAmJiBtYXRjaGVzWyAxIF0pIHtcbiAgICAgIHZhciBuYW1lID0gbWF0Y2hlc1sgMSBdLnJlcGxhY2UoLy0vLCAnJyk7XG4gICAgICBkYXRhWyBuYW1lIF0gPSBhdHRyc1sgaSBdLnZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGF0YTtcbn1cbiIsInZhciBzZWxlY3QgPSByZXF1aXJlKCcuLi91dGlscy9zZWxlY3QnKTtcbnZhciB3aGVuRE9NUmVhZHkgPSByZXF1aXJlKCcuLi91dGlscy93aGVuLWRvbS1yZWFkeScpO1xudmFyIEFjY29yZGlvbiA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvYWNjb3JkaW9uJyk7XG5cbndoZW5ET01SZWFkeShmdW5jdGlvbiBpbml0QWNjb3JkaW9ucyAoKSB7XG5cbiAgdmFyIGFjY29yZGlvbnMgPSBzZWxlY3QoJy51c2EtYWNjb3JkaW9uLCAudXNhLWFjY29yZGlvbi1ib3JkZXJlZCcpO1xuICBhY2NvcmRpb25zLmZvckVhY2goZnVuY3Rpb24gKGVsKSB7XG4gICAgbmV3IEFjY29yZGlvbihlbCk7XG4gIH0pO1xufSk7XG4iLCJ2YXIgd2hlbkRPTVJlYWR5ID0gcmVxdWlyZSgnLi4vdXRpbHMvd2hlbi1kb20tcmVhZHknKTtcbnZhciBiYW5uZXJJbml0ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9iYW5uZXInKTtcblxud2hlbkRPTVJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICBiYW5uZXJJbml0KCk7XG5cbn0pO1xuXG4iLCJ2YXIgZGVib3VuY2UgPSByZXF1aXJlKCdsb2Rhc2guZGVib3VuY2UnKTtcbnZhciB3aGVuRE9NUmVhZHkgPSByZXF1aXJlKCcuLi91dGlscy93aGVuLWRvbS1yZWFkeScpO1xudmFyIGRpc3BhdGNoID0gcmVxdWlyZSgnLi4vdXRpbHMvZGlzcGF0Y2gnKTtcbnZhciBmb290ZXJBY2NvcmRpb24gPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL2Zvb3RlcicpO1xuXG53aGVuRE9NUmVhZHkoZnVuY3Rpb24gKCkge1xuXG4gIGZvb3RlckFjY29yZGlvbigpO1xuXG4gIGRpc3BhdGNoKHdpbmRvdywgJ3Jlc2l6ZScsIGRlYm91bmNlKGZvb3RlckFjY29yZGlvbiwgMTgwKSk7XG5cbn0pO1xuIiwidmFyIHdoZW5ET01SZWFkeSA9IHJlcXVpcmUoJy4uL3V0aWxzL3doZW4tZG9tLXJlYWR5Jyk7XG52YXIgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG52YXIgdmFsaWRhdG9yID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy92YWxpZGF0b3InKTtcbnZhciB0b2dnbGVGb3JtSW5wdXQgPSByZXF1aXJlKCcuLi9jb21wb25lbnRzL3RvZ2dsZS1mb3JtLWlucHV0Jyk7XG5cbndoZW5ET01SZWFkeShmdW5jdGlvbiAoKSB7XG4gIHZhciBlbFNob3dQYXNzd29yZCA9IHNlbGVjdCgnLnVzYS1zaG93X3Bhc3N3b3JkJylbIDAgXTtcbiAgdmFyIGVsRm9ybUlucHV0ID0gc2VsZWN0KCcudXNhLXNob3dfbXVsdGlwYXNzd29yZCcpWyAwIF07XG4gIHZhciBlbFZhbGlkYXRvciA9IHNlbGVjdCgnLmpzLXZhbGlkYXRlX3Bhc3N3b3JkJylbIDAgXTtcblxuICBlbFNob3dQYXNzd29yZCAmJiB0b2dnbGVGb3JtSW5wdXQoZWxTaG93UGFzc3dvcmQsICdTaG93IFBhc3N3b3JkJywgJ0hpZGUgUGFzc3dvcmQnKTtcbiAgZWxGb3JtSW5wdXQgJiYgdG9nZ2xlRm9ybUlucHV0KGVsRm9ybUlucHV0LCAnU2hvdyBteSB0eXBpbmcnLCAnSGlkZSBteSB0eXBpbmcnKTtcbiAgZWxWYWxpZGF0b3IgJiYgdmFsaWRhdG9yKGVsVmFsaWRhdG9yKTtcbn0pO1xuXG4iLCJ2YXIgd2hlbkRPTVJlYWR5ID0gcmVxdWlyZSgnLi4vdXRpbHMvd2hlbi1kb20tcmVhZHknKTtcbnZhciBzZWFyY2hJbml0ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9oZWFkZXIvc2VhcmNoJyk7XG52YXIgbW9iaWxlSW5pdCA9IHJlcXVpcmUoJy4uL2NvbXBvbmVudHMvaGVhZGVyL21vYmlsZScpO1xuXG53aGVuRE9NUmVhZHkoZnVuY3Rpb24gaW5pdEhlYWRlcnMgKCkge1xuXG4gIC8vIFNlYXJjaCBUb2dnbGVcbiAgc2VhcmNoSW5pdCgpO1xuXG4gIC8vIE1vYmlsZSBOYXZpZ2F0aW9uXG4gIG1vYmlsZUluaXQoKTtcblxufSk7XG5cbiIsInZhciB2ZXJpZnlqUXVlcnkgPSByZXF1aXJlKCcuLi91dGlscy92ZXJpZnktanF1ZXJ5Jyk7XG5cbi8vIGpRdWVyeSBQbHVnaW5cblxuaWYgKHZlcmlmeWpRdWVyeSh3aW5kb3cpKSB7XG5cbiAgdmFyICQgPSB3aW5kb3cualF1ZXJ5O1xuXG4gIC8vIFJFQURNRTogVGhpcyBpcyBuZWNlc3NhcnkgYmVjYXVzZSBwb2xpdGVzcGFjZSBkb2Vzbid0IHByb3Blcmx5IGV4cG9ydCBhbnl0aGluZ1xuICAvLyBpbiBpdHMgcGFja2FnZS5qc29uLiBUT0RPOiBMZXQncyBvcGVuIGEgUFIgcmVsYXRlZCB0byB0aGlzIHNvIHdlIGNhbiBmaXggaXQgaW4gUG9saXRlc3BhY2UuanNcbiAgLy9cbiAgdmFyIFBvbGl0ZXNwYWNlID0gcmVxdWlyZSgnLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3BvbGl0ZXNwYWNlL3NyYy9wb2xpdGVzcGFjZScpLlBvbGl0ZXNwYWNlO1xuXG4gIHZhciBjb21wb25lbnROYW1lID0gJ3BvbGl0ZXNwYWNlJyxcbiAgICBlbmhhbmNlZEF0dHIgPSAnZGF0YS1lbmhhbmNlZCcsXG4gICAgaW5pdFNlbGVjdG9yID0gJ1tkYXRhLVwiICsgY29tcG9uZW50TmFtZSArIFwiXTpub3QoW1wiICsgZW5oYW5jZWRBdHRyICsgXCJdKSc7XG5cbiAgJC5mblsgY29tcG9uZW50TmFtZSBdID0gZnVuY3Rpb24gKCl7XG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKXtcbiAgICAgIHZhciBwb2xpdGUgPSBuZXcgUG9saXRlc3BhY2UodGhpcyk7XG4gICAgICBpZihwb2xpdGUudHlwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgcG9saXRlLmNyZWF0ZVByb3h5KCk7XG4gICAgICB9XG5cbiAgICAgICQodGhpcylcbiAgICAgICAgLmJpbmQoJ2lucHV0IGtleWRvd24nLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcG9saXRlLnVwZGF0ZVByb3h5KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5iaW5kKCdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnBvbGl0ZXNwYWNlLXByb3h5JykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIHBvbGl0ZS51cGRhdGUoKTtcbiAgICAgICAgICBwb2xpdGUudXBkYXRlUHJveHkoKTtcbiAgICAgICAgfSlcbiAgICAgICAgLmJpbmQoJ2ZvY3VzJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnBvbGl0ZXNwYWNlLXByb3h5JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgIHBvbGl0ZS5yZXNldCgpO1xuICAgICAgICB9KVxuICAgICAgICAuZGF0YShjb21wb25lbnROYW1lLCBwb2xpdGUpO1xuXG4gICAgICBwb2xpdGUudXBkYXRlKCk7XG4gICAgfSk7XG4gIH07XG5cblx0Ly8gYXV0by1pbml0IG9uIGVuaGFuY2UgKHdoaWNoIGlzIGNhbGxlZCBvbiBkb21yZWFkeSlcbiAgJChmdW5jdGlvbiAoKSB7XG4gICAgJCgnW2RhdGEtJyArIGNvbXBvbmVudE5hbWUgKyAnXScpLnBvbGl0ZXNwYWNlKCk7XG4gIH0pO1xuXG59XG4iLCIvKipcbiAqIFRoaXMgZmlsZSBkZWZpbmVzIGtleSBFQ01BU2NyaXB0IDUgbWV0aG9kcyB0aGF0IGFyZSB1c2VkIGJ5IHRoZSBTdGFuZGFyZHNcbiAqIGJ1dCBtYXkgYmUgbWlzc2luZyBpbiBvbGRlciBicm93c2Vycy5cbiAqL1xuXG4vKipcbiAqIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoKClcbiAqIFRha2VuIGZyb20gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZm9yRWFjaFxuICovXG5cbi8vIFByb2R1Y3Rpb24gc3RlcHMgb2YgRUNNQS0yNjIsIEVkaXRpb24gNSwgMTUuNC40LjE4XG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE4XG5pZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG5cbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2ssIHRoaXNBcmcpIHtcblxuICAgIHZhciBULCBrO1xuXG4gICAgaWYgKHRoaXMgPT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJyB0aGlzIGlzIG51bGwgb3Igbm90IGRlZmluZWQnKTtcbiAgICB9XG5cbiAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdG9PYmplY3QoKSBwYXNzaW5nIHRoZVxuICAgIC8vIHx0aGlzfCB2YWx1ZSBhcyB0aGUgYXJndW1lbnQuXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XG5cbiAgICAvLyAyLiBMZXQgbGVuVmFsdWUgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXQoKSBpbnRlcm5hbFxuICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFwibGVuZ3RoXCIuXG4gICAgLy8gMy4gTGV0IGxlbiBiZSB0b1VpbnQzMihsZW5WYWx1ZSkuXG4gICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xuXG4gICAgLy8gNC4gSWYgaXNDYWxsYWJsZShjYWxsYmFjaykgaXMgZmFsc2UsIHRocm93IGEgVHlwZUVycm9yIGV4Y2VwdGlvbi4gXG4gICAgLy8gU2VlOiBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g5LjExXG4gICAgaWYgKHR5cGVvZiBjYWxsYmFjayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihjYWxsYmFjayArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICAvLyA1LiBJZiB0aGlzQXJnIHdhcyBzdXBwbGllZCwgbGV0IFQgYmUgdGhpc0FyZzsgZWxzZSBsZXRcbiAgICAvLyBUIGJlIHVuZGVmaW5lZC5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgIFQgPSB0aGlzQXJnO1xuICAgIH1cblxuICAgIC8vIDYuIExldCBrIGJlIDBcbiAgICBrID0gMDtcblxuICAgIC8vIDcuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxuICAgIHdoaWxlIChrIDwgbGVuKSB7XG5cbiAgICAgIHZhciBrVmFsdWU7XG5cbiAgICAgIC8vIGEuIExldCBQayBiZSBUb1N0cmluZyhrKS5cbiAgICAgIC8vICAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3JcbiAgICAgIC8vIGIuIExldCBrUHJlc2VudCBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEhhc1Byb3BlcnR5XG4gICAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxuICAgICAgLy8gICAgVGhpcyBzdGVwIGNhbiBiZSBjb21iaW5lZCB3aXRoIGNcbiAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cbiAgICAgIGlmIChrIGluIE8pIHtcblxuICAgICAgICAvLyBpLiBMZXQga1ZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0IGludGVybmFsXG4gICAgICAgIC8vIG1ldGhvZCBvZiBPIHdpdGggYXJndW1lbnQgUGsuXG4gICAgICAgIGtWYWx1ZSA9IE9bIGsgXTtcblxuICAgICAgICAvLyBpaS4gQ2FsbCB0aGUgQ2FsbCBpbnRlcm5hbCBtZXRob2Qgb2YgY2FsbGJhY2sgd2l0aCBUIGFzXG4gICAgICAgIC8vIHRoZSB0aGlzIHZhbHVlIGFuZCBhcmd1bWVudCBsaXN0IGNvbnRhaW5pbmcga1ZhbHVlLCBrLCBhbmQgTy5cbiAgICAgICAgY2FsbGJhY2suY2FsbChULCBrVmFsdWUsIGssIE8pO1xuICAgICAgfVxuICAgICAgLy8gZC4gSW5jcmVhc2UgayBieSAxLlxuICAgICAgaysrO1xuICAgIH1cbiAgICAvLyA4LiByZXR1cm4gdW5kZWZpbmVkXG4gIH07XG59XG5cblxuLyoqXG4gKiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCgpXG4gKiBUYWtlbiBmcm9tIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL0Z1bmN0aW9uL2JpbmRcbiAqL1xuXG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuMy40LjVcbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcblxuICBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uIChvVGhpcykge1xuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gY2xvc2VzdCB0aGluZyBwb3NzaWJsZSB0byB0aGUgRUNNQVNjcmlwdCA1XG4gICAgICAvLyBpbnRlcm5hbCBJc0NhbGxhYmxlIGZ1bmN0aW9uXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAtIHdoYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZScpO1xuICAgIH1cblxuICAgIHZhciBhQXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcbiAgICAgIGZUb0JpbmQgPSB0aGlzLFxuICAgICAgZk5PUCAgICA9IGZ1bmN0aW9uICgpIHt9LFxuICAgICAgZkJvdW5kICA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGZUb0JpbmQuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGZOT1AgPyB0aGlzIDogb1RoaXMsXG4gICAgICAgICAgICAgICAgYUFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcbiAgICAgIH07XG5cbiAgICBpZiAodGhpcy5wcm90b3R5cGUpIHtcbiAgICAgIC8vIEZ1bmN0aW9uLnByb3RvdHlwZSBkb2Vzbid0IGhhdmUgYSBwcm90b3R5cGUgcHJvcGVydHlcbiAgICAgIGZOT1AucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7IFxuICAgIH1cbiAgICBmQm91bmQucHJvdG90eXBlID0gbmV3IGZOT1AoKTtcblxuICAgIHJldHVybiBmQm91bmQ7XG4gIH07XG5cbn1cbiIsInZhciBkaXNwYXRjaCA9IHJlcXVpcmUoJy4uL3V0aWxzL2Rpc3BhdGNoJyk7XG52YXIgc2VsZWN0ID0gcmVxdWlyZSgnLi4vdXRpbHMvc2VsZWN0Jyk7XG52YXIgd2hlbkRPTVJlYWR5ID0gcmVxdWlyZSgnLi4vdXRpbHMvd2hlbi1kb20tcmVhZHknKTtcblxud2hlbkRPTVJlYWR5KGZ1bmN0aW9uICgpIHtcblxuICAvLyBGaXhpbmcgc2tpcCBuYXYgZm9jdXMgYmVoYXZpb3IgaW4gY2hyb21lXG4gIHZhciBlbFNraXBuYXYgPSBzZWxlY3QoJy5za2lwbmF2JylbIDAgXTtcbiAgdmFyIGVsTWFpbkNvbnRlbnQgPSBzZWxlY3QoJyNtYWluLWNvbnRlbnQnKVsgMCBdO1xuXG4gIGlmIChlbFNraXBuYXYpIHtcbiAgICBkaXNwYXRjaChlbFNraXBuYXYsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGVsTWFpbkNvbnRlbnQuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsICcwJyk7XG4gICAgfSk7XG4gIH1cblxuICBpZiAoZWxNYWluQ29udGVudCkge1xuICAgIGRpc3BhdGNoKGVsTWFpbkNvbnRlbnQsICdibHVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgZWxNYWluQ29udGVudC5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgJy0xJyk7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIFRoZSAncG9seWZpbGxzJyBmaWxlIGRlZmluZXMga2V5IEVDTUFTY3JpcHQgNSBtZXRob2RzIHRoYXQgbWF5IGJlXG4gKiBtaXNzaW5nIGZyb20gb2xkZXIgYnJvd3NlcnMsIHNvIG11c3QgYmUgbG9hZGVkIGZpcnN0LlxuICovXG5yZXF1aXJlKCcuL2luaXRpYWxpemVycy9wb2x5ZmlsbHMnKTtcbnJlcXVpcmUoJy4vaW5pdGlhbGl6ZXJzL2hlYWRlcicpO1xucmVxdWlyZSgnLi9pbml0aWFsaXplcnMvYWNjb3JkaW9ucycpO1xucmVxdWlyZSgnLi9pbml0aWFsaXplcnMvZm9vdGVyJyk7XG5yZXF1aXJlKCcuL2luaXRpYWxpemVycy9za2lwLW5hdicpO1xucmVxdWlyZSgnLi9pbml0aWFsaXplcnMvZm9ybXMnKTtcbnJlcXVpcmUoJy4vaW5pdGlhbGl6ZXJzL3BvbGl0ZXNwYWNlJyk7XG5yZXF1aXJlKCcuL2luaXRpYWxpemVycy9iYW5uZXInKTtcbiIsIi8qKlxuICogQWRkcyBhIGNsYXNzIHRvIGEgZ2l2ZW4gSFRNTCBlbGVtZW50LlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCAtIFRoZSBlbGVtZW50IHRvIHdoaWNoIHRoZSBjbGFzcyB3aWxsIGJlIGFkZGVkXG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIC0gVGhlIG5hbWUgb2YgdGhlIGNsYXNzIHRvIGFkZFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYWRkQ2xhc3MgKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuICBpZiAoZWxlbWVudC5jbGFzc0xpc3QpIHtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICBlbGVtZW50LmNsYXNzTmFtZSArPSAnICcgKyBjbGFzc05hbWU7XG4gIH1cbn07IiwiLyoqXG4gKiBBdHRhY2hlcyBhIGdpdmVuIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIGEgZ2l2ZW4gZWxlbWVudCB3aGljaCBpc1xuICogdHJpZ2dlcmVkIGJ5IGEgc3BlY2lmaWVkIGxpc3Qgb2YgZXZlbnQgdHlwZXMuXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50IC0gdGhlIGVsZW1lbnQgdG8gd2hpY2ggdGhlIGxpc3RlbmVyIHdpbGwgYmUgYXR0YWNoZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFR5cGVzIC0gc3BhY2Utc2VwYXJhdGVkIGxpc3Qgb2YgZXZlbnQgdHlwZXMgd2hpY2ggd2lsbCB0cmlnZ2VyIHRoZSBsaXN0ZW5lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgLSB0aGUgZnVuY3Rpb24gdG8gYmUgZXhlY3V0ZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9IC0gY29udGFpbmluZyBhIDx0dD50cmlnZ2VyKCk8L3R0PiBtZXRob2QgZm9yIGV4ZWN1dGluZyB0aGUgbGlzdGVuZXIsIGFuZCBhbiA8dHQ+b2ZmKCk8L3R0PiBtZXRob2QgZm9yIGRldGFjaGluZyBpdFxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRpc3BhdGNoIChlbGVtZW50LCBldmVudFR5cGVzLCBsaXN0ZW5lciwgb3B0aW9ucykge1xuICB2YXIgZXZlbnRUeXBlQXJyYXkgPSBldmVudFR5cGVzLnNwbGl0KC9cXHMrLyk7XG5cbiAgdmFyIGF0dGFjaCA9IGZ1bmN0aW9uIChlLCB0LCBkKSB7XG4gICAgaWYgKGUuYXR0YWNoRXZlbnQpIHtcbiAgICAgIGUuYXR0YWNoRXZlbnQoJ29uJyArIHQsIGQsIG9wdGlvbnMpO1xuICAgIH1cbiAgICBpZiAoZS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICBlLmFkZEV2ZW50TGlzdGVuZXIodCwgZCwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIHZhciB0cmlnZ2VyID0gZnVuY3Rpb24gKGUsIHQpIHtcbiAgICB2YXIgZmFrZUV2ZW50O1xuICAgIGlmICgnY3JlYXRlRXZlbnQnIGluIGRvY3VtZW50KSB7XG4gICAgICAvLyBtb2Rlcm4gYnJvd3NlcnMsIElFOStcbiAgICAgIGZha2VFdmVudCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdIVE1MRXZlbnRzJyk7XG4gICAgICBmYWtlRXZlbnQuaW5pdEV2ZW50KHQsIGZhbHNlLCB0cnVlKTtcbiAgICAgIGUuZGlzcGF0Y2hFdmVudChmYWtlRXZlbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJRSA4XG4gICAgICBmYWtlRXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudE9iamVjdCgpO1xuICAgICAgZmFrZUV2ZW50LmV2ZW50VHlwZSA9IHQ7XG4gICAgICBlLmZpcmVFdmVudCgnb24nK2UuZXZlbnRUeXBlLCBmYWtlRXZlbnQpO1xuICAgIH1cbiAgfTtcblxuICB2YXIgZGV0YWNoID0gZnVuY3Rpb24gKGUsIHQsIGQpIHtcbiAgICBpZiAoZS5kZXRhY2hFdmVudCkge1xuICAgICAgZS5kZXRhY2hFdmVudCgnb24nICsgdCwgZCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChlLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIGUucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LCBkLCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgZXZlbnRUeXBlQXJyYXkuZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRUeXBlKSB7XG4gICAgYXR0YWNoLmNhbGwobnVsbCwgZWxlbWVudCwgZXZlbnRUeXBlLCBsaXN0ZW5lcik7XG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgdHJpZ2dlcjogZnVuY3Rpb24gKCkge1xuICAgICAgdHJpZ2dlci5jYWxsKG51bGwsIGVsZW1lbnQsIGV2ZW50VHlwZUFycmF5WyAwIF0pO1xuICAgIH0sXG4gICAgb2ZmOiBmdW5jdGlvbiAoKSB7XG4gICAgICBldmVudFR5cGVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudFR5cGUpIHtcbiAgICAgICAgZGV0YWNoLmNhbGwobnVsbCwgZWxlbWVudCwgZXZlbnRUeXBlLCBsaXN0ZW5lcik7XG4gICAgICB9KTtcbiAgICB9LFxuICB9O1xufTtcbiIsIi8qKlxuICogUmVtb3ZlcyBhIGNsYXNzIGZyb20gYSBnaXZlbiBIVE1MIGVsZW1lbnRlbWVudC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnQgLSBUaGUgZWxlbWVudCBmcm9tIHdoaWNoIHRoZSBjbGFzcyB3aWxsIGJlIHJlbW92ZWRcbiAqIEBwYXJhbSB7U3RyaW5nfSBjbGFzc05hbWUgLSBUaGUgbmFtZSBvZiB0aGUgY2xhc3MgdG8gcmVtb3ZlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiByZW1vdmVDbGFzcyAoZWxlbWVudCwgY2xhc3NOYW1lKSB7XG4gIHZhciBjbGFzc0xpc3QgPSBlbGVtZW50LmNsYXNzTGlzdDtcblxuICBpZiAoY2xhc3NMaXN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBjbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gIH1cbiAgZWxzZVxuICB7XG4gICAgY2xhc3NMaXN0ID0gZWxlbWVudC5jbGFzc05hbWUuc3BsaXQoL1xccysvKTtcbiAgICB2YXIgbmV3Q2xhc3NMaXN0ID0gW107XG4gICAgY2xhc3NMaXN0LmZvckVhY2goZnVuY3Rpb24gKGMpIHtcbiAgICAgIGlmIChjICE9PSBjbGFzc05hbWUpIHtcbiAgICAgICAgbmV3Q2xhc3NMaXN0LnB1c2goYyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZWxlbWVudC5jbGFzc05hbWUgPSBuZXdDbGFzc0xpc3Quam9pbignICcpO1xuICB9XG59O1xuIiwiLyoqXG4gKiBAbmFtZSBzZWxlY3RcbiAqIEBkZXNjIHNlbGVjdHMgZWxlbWVudHMgZnJvbSB0aGUgRE9NIGJ5IGNsYXNzIHNlbGVjdG9yIG9yIElEIHNlbGVjdG9yLlxuICogQHBhcmFtIHtzdHJpbmd9IHNlbGVjdG9yIC0gVGhlIHNlbGVjdG9yIHRvIHRyYXZlcnNlIHRoZSBET00gd2l0aC5cbiAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGNvbnRleHQgLSBUaGUgY29udGV4dCB0byB0cmF2ZXJzZSB0aGUgRE9NIGluLlxuICogQHJldHVybiB7QXJyYXkuSFRNTEVsZW1lbnR9IC0gQW4gYXJyYXkgb2YgRE9NIG5vZGVzIG9yIGFuIGVtcHR5IGFycmF5LlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNlbGVjdCAoc2VsZWN0b3IsIGNvbnRleHQpIHtcblxuICBpZiAodHlwZW9mIHNlbGVjdG9yICE9PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmICgoY29udGV4dCA9PT0gdW5kZWZpbmVkKSB8fCAhaXNFbGVtZW50KGNvbnRleHQpKSB7XG4gICAgY29udGV4dCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgfVxuXG4gIHZhciBzZWxlY3Rpb24gPSBjb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpO1xuXG4gIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChzZWxlY3Rpb24pO1xuXG59O1xuXG5mdW5jdGlvbiBpc0VsZW1lbnQgKHZhbHVlKSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUubm9kZVR5cGUgPT09IDE7XG59IiwiLypcbiAqIEBuYW1lIHZlcmlmeWpRdWVyeVxuICogQGRlc2MgVGVzdHMgdGhlIGdpdmVuIGhvc3Qgb2JqZWN0IGZvciB0aGUgcHJlc2VuY2Ugb2YgalF1ZXJ5LiBJZiBub1xuICogICAgICAgb2JqZWN0IGlzIGdpdmVuLCB0aGUgPHR0PndpbmRvdzwvdHQ+IG9iamVjdCBpcyB1c2VkLlxuICogQHBhcmFtIHtvYmplY3R9IHcgLSBPYmplY3QgdG8gdGVzdCBmb3IgalF1ZXJ5LlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiBqUXVlcnkgZXhpc3RzIG9uIHRoZSBvYmplY3QuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gdmVyaWZ5alF1ZXJ5ICh3KSB7XG4gIHcgPSB3IHx8IHdpbmRvdztcbiAgcmV0dXJuICEhKHcualF1ZXJ5ICYmIHcualF1ZXJ5LmZuICYmIHcualF1ZXJ5LmZuLmpxdWVyeSk7XG59OyIsIi8qXG4gKiBAbmFtZSBET01Mb2FkZWRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNiIC0gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHRvIHJ1biB3aGVuIHRoZSBET00gaGFzIGxvYWRlZC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBET01Mb2FkZWQgKGNiKSB7XG4gIC8vIGluIGNhc2UgdGhlIGRvY3VtZW50IGlzIGFscmVhZHkgcmVuZGVyZWRcbiAgaWYgKCdsb2FkaW5nJyAhPT0gZG9jdW1lbnQucmVhZHlTdGF0ZSkge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNiKSkge1xuICAgICAgY2IoKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikgeyAvLyBtb2Rlcm4gYnJvd3NlcnNcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2IpO1xuICB9IGVsc2UgeyAvLyBJRSA8PSA4XG4gICAgZG9jdW1lbnQuYXR0YWNoRXZlbnQoJ29ucmVhZHlzdGF0ZWNoYW5nZScsIGZ1bmN0aW9uICgpe1xuICAgICAgaWYgKCdjb21wbGV0ZScgPT09IGRvY3VtZW50LnJlYWR5U3RhdGUpIHtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24oY2IpKSB7XG4gICAgICAgICAgY2IoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uIChhcmcpIHtcbiAgcmV0dXJuICh0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nKTtcbn0iXX0=
