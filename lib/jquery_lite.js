/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

class Query {
  constructor (arg) {
    this.loaded = false;
    this.arrLoadFunctions = [];
    if (typeof arg === 'string') {
      this.elements = Array.from(document.querySelectorAll(arg));
    }
    if (arg instanceof HTMLElement) {
      this.elements = [arg];
    }

    if (arg instanceof Function) {
      if (this.loaded) {
        arg();
      } else {
        this.arrLoadFunctions.push(arg);
      }
    }
    document.addEventListener("DOMContentLoaded", this.fireLoadEvents.bind(this));
    return new DOMNodeCollection(this.elements);
  }

  fireLoadEvents() {
    for (var i = 0; i < this.arrLoadFunctions.length; i++) {
      this.arrLoadFunctions[i]();
    }
  }

  changeLoadState() {
    this.loaded = true;
  }
}

function makeAlert() {
  alert('You clicked me!');
  console.log("log");
}

window.$n = new Query(makeAlert);

document.addEventListener("DOMContentLoaded", () => {
  window.$l = new Query(".div");
  window.$l.append("Hello!");
  window.$m = new Query("li");
  // window.$l.append(document.querySelectorAll("#great-div")[0]);
  // window.$l.append(window.$m);
  window.$m.addClass('li');
  window.$m.addClass('hidden');
  window.$m.addClass('other');
  window.$m.removeClass('hidden');
  // window.$ul = new Query(".ul");
  // console.log(window.$l.find('.pee'));
  // window.$m.remove();
  window.$m.on('click', makeAlert);
  window.$m.off('click');




  // console.log(window.$m.attr("class"))
});


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(array) {
    this.array = array;
  }

  html(str) {
    if (str !== undefined) {
      for (var i = 0; i < this.array.length; i++) {
        this.array[i].innerHTML = str;
      }
    }

    return this.array[0].innerHTML;
  }

  empty() {
    this.html('');
  }

  append(element) {
    if (typeof element === 'string') {
      for (let i = 0; i < this.array.length; i++) {
        this.array[i].innerHTML = this.array[i].innerHTML + element;
      }
    } else if (element instanceof HTMLElement) {
      for (let i = 0; i < this.array.length; i++) {
        this.array[i].innerHTML = this.array[i].innerHTML + element.outerHTML;
      }
    } else if (element instanceof DOMNodeCollection) {
      for (let i = 0; i < this.array.length; i++) {
        for (var j = 0; j < element.array.length; j++) {
          this.array[i].innerHTML = (this.array[i].innerHTML + element.array[j].outerHTML);
        }
      }
    }
  }

  attr(attributeName) {
    return this.array[0].getAttribute(attributeName);
  }

  addClass(className) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i].className = this.array[i].className.concat(' ').concat(className);
    }
  }

  removeClass(className) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i].className = this.removeClassHelper(this.array[i].className, className);
    }
  }

  removeClassHelper(allClasses, removeClass) {
    let result = [];
    let arr = allClasses.split(' ');

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] !== removeClass) {
        result.push(arr[i]);
      }
    }

    return result.join(' ');
  }

  children() {
    let childElements = [];
    for (let i = 0; i < this.array.length; i++) {
      childElements = childElements.concat(this.array[i].children);
    }

    return new DOMNodeCollection(Array.from(childElements[0]));
  }

  parent() {
    let parentElements = [];
    for (var i = 0; i < this.array.length; i++) {
      parentElements.push(this.array[i].parentElement);
    }
    return new DOMNodeCollection(parentElements);
  }

  find(selector) {
    let resultArray = [];
    for (var i = 0; i < this.array.length; i++) {
      // console.log(this.array[i]);
      resultArray = resultArray.concat(Array.from(this
                                                  .array[i]
                                                  .querySelectorAll(selector)));
    }

    return new DOMNodeCollection(resultArray);
  }

  remove() {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i].outerHTML = "";
    }
    this.array = [];
  }

  on(eventType, callback) {
    for (var i = 0; i < this.array.length; i++) {
      this.array[i].addEventListener(eventType, callback);
      if (this.array[i].callbacks === undefined) {
        this.array[i].callbacks = [[eventType, callback]];
      } else {
        this.array[i].callbacks.push([eventType, callback]);
      }
    }
  }

  off(eventType, callback) {
    if (callback) {
      for (let i = 0; i < this.array.length; i++) {
        this.array[i].removeEventListener(eventType, callback);
        const updatedCallbacks = [];
        for (let j = 0; j < this.array[i].callbacks.length; j++) {
          if ((this.array[i].callbacks[j][0] !== eventType) ||
              (this.array[i].callbacks[j][1] !== callback)) {
            updatedCallbacks.push(this.array[i].callback[j]);
          }
        }
        this.array[i].callbacks = updatedCallbacks;
      }
    } else {
      for (let i = 0; i < this.array.length; i++) {
        const updatedCallbacks = [];
        for (var j = 0; j < this.array[i].callbacks.length; j++) {
          if (this.array[i].callbacks[j][0] === eventType) {
            this.array[i].removeEventListener(eventType, this.array[i].callbacks[j][1]);
          } else {
            updatedCallbacks.push(this.array[i].callbacks[j]);
          }
        }
        this.array[i].callbacks = updatedCallbacks;
      }
    }
  }
}

module.exports = DOMNodeCollection;


/***/ })
/******/ ]);