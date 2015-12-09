function Observable(forEach) {
  //An observable takes a forEach function as input
  //and holds onto to it in internal _forEach property.
  
  this._forEach = forEach;
}


Observable.prototype.forEach = function (onNext, onError, onCompleted) {
  //API for observable.forEach(onNext => ..., e => ..., c => ...)
  if(typeof onNext === 'function') {
    //create an observer object and assign
    //the 3 argument functions to it
    return this._forEach({
      onNext: onNext,
      onError: onError || function () {},
      onCompleted: onCompleted || function () {}
    });
  } else {
    //API for observable.forEach(
    // {onNext: x => ...,
    // onError: e => ...,
    // onCompleted: c => ...})
    return this._forEach(onNext)
  }
};

Observable.prototype.map = function (transformationFunction) {
  //$P
  var self = this;

  return new Observable(function forEach(observer) {
    return self.forEach(
      function onNext(event) {
      	observer.onNext(transformationFunction(event));
      },
      function onError(event) {
      	observer.onError(event);
      },
      function onCompleted() {
      	observer.onCompleted();
      }
    );
  });
};

Observable.prototype.filter = function (testFunction) {
  var self = this; //source observable
  return new Observable(function forEach(observer) {
    return self.forEach(
      function onNext(event) {
        if(testFunction(event)) {
          observer.onNext(event);
        }
      },
      function onError(event) { observer.onError(event); },
      function onCompleted() { observer.onCompleted(); }
    );
  });
 };

 Observable.prototype.take = function (limitTo) {
  var self = this;
  return Observable(function forEach(observer) {
    var counter = 0,
    subcription = self.forEach(
      function onNext(v) {
        observer.onNext(v);
        counter++;
        if(counter === limitTo) {
          observer.onCompleted();
          subcription.dispose();
        }
      },
      function onError(e) {
        observer.onError(e);
      },
      function onCompleted() {
        observer.onCompleted();
      }
    );
    return subcription;
  });
};

Observable.fromEvent = function(domElement, eventName) {
  return new Observable(function forEach(observer) {
    var handler = function(event) {
      observer.onNext(event);
    };

    domElement.addEventListener(eventName, handler);

    //Subcription object
    return {
      dispose: function () {
        domElement.removeEventListener(eventName, handler);
      }
    };
  });
};


var button = document.getElementById("button");

var clicks =
  Observable
  .fromEvent(button, "click")
  .map(function (e) {
      return e;
    });

console.log(clicks);

clicks.forEach(function (e) {
  console.log(e.pageX, e.pageY);
});