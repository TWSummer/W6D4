const DOMNodeCollection = require('./dom_node_collection');

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
