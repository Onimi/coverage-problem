(function (module) {
  var sort = {
    anty: function(compare) {
      return function (a, b) {
        return -compare(a, b);
      };
    }, 
    by: {
      length: function (a, b) {
        return a.length - b.length;
      },
      beginning: function (a, b) {
        return a.st - b.st;
      },
      ending: function (a, b) {
        return a.fn - b.fn;
      },
      center: function (a, b) {
        return a.fn + a.st - b.fn - b.st;
      },
      beginningAndLength: function (a, b) {
        return (a.st === b.st) ?
          b.length - a.length :
          a.st - b.st;
      },
      endingAndLength: function (a, b) {
        return (a.fn === b.fn) ?
          a.length - b.length :
          a.fn - b.fn;
      },
      centerAndLength: function (a, b) {
        return (a.center === b.center) ?
          a.length - b.length :
          a.fn + a.st - b.fn - b.st;
      }
    }
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    var coverage = module.coverage();
    var button = document.getElementById('new-gen');
    button.addEventListener('click', function () {
      coverage.reset();
//      console.log(coverage.general);
    });
    
    var sortButtons = document.getElementsByClassName('sort');
    Array.prototype.forEach.call(sortButtons, function ($button) {
      var compare = $button.getAttribute('data-by');
      $button.addEventListener('click', function (e) {
        var way = e.target.parentNode.getAttribute('data-way');
//        console.log(compare);
//        console.log(way);
        coverage.sortBy(way === 'asc' ? sort.by[compare] : sort.anty(sort.by[compare]));
        e.target.parentNode.setAttribute('data-way', way === 'asc' ? 'desc' : 'asc');
        e.target.parentNode.lastElementChild.innerHTML = (way === 'asc' ? 'DESC' : 'ASC');
      });
    });
    
    document.getElementById('find-solution').addEventListener('click', function () {
      var end, start;
      var searcher = module.primitiveSearcher(coverage.general);
      start = new Date();
      searcher.generateSubsamples();
      console.log(searcher.getMaxSubsample());
      end = new Date();
      console.log('Operation took ' + toReadableTime(end.getTime() - start.getTime()));

    });
  });
})($N);

toReadableTime = function(milisecs) {
  var h, m, s  = milisecs;
  h = Math.floor(s / 3600000);
  s = s % 3600000;
  m = Math.floor(s / 60000);
  s = s % 60000;
  s = s / 1000;
  return h + ' hours ' + m + ' mins ' + s + ' secs';
};
