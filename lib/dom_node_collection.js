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
