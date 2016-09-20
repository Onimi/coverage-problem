(function () {
  var $N = window.$N || {};
  
  $N.hasClass = function(className, elem) {
    if (elem.className !== undefined) {
      return elem.className.indexOf(className) !== -1;
    }
    return undefined;
  };
  
  $N.addClass = function(className, elem) {
    if ($N.hasClass(className, elem) === false && typeof elem.setAttribute === 'function') {
      elem.setAttribute('class', elem.className + ' ' + className);
    }
  };
  
  $N.removeClass = function(className, elem) {
    if ($N.hasClass(className, elem) && typeof elem.setAttribute === 'function') {
      elem.setAttribute('class', elem.className.replace(className, '').trim().replace('  ', ' '));
    }
  };
  
  $N.toggleClass = function(className, elem) {
    if ($N.hasClass(className, elem) !== undefined) {
      if ($N.hasClass(className, elem)) {
        $N.removeClass(className, elem);
      } else {
        $N.addClass(className, elem);
      }
    }
  };
  
  $N.measure = function (segment) {
//    return segment.length;
    return 1;
  };
  
  window.$N = $N;
})();
