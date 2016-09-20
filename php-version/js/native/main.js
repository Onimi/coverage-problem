(function (module) {
  document.addEventListener('DOMContentLoaded', function() {
    var segments = document.getElementsByClassName('segment');
    var coverage = module.coverage();
//    coverage.generate();
//    console.log(coverage.general);
    
    coverage.general = [];
    Array.prototype.forEach.call(segments, function(elem) {
      coverage.general.push(coverage.$getElementData(elem));
      elem.addEventListener('click', function (e) {
        coverage.$toggleSegment(elem);
//        console.log(coverage.$selected);
        coverage._renderFooter();
        
        e.preventDefault();
      });
    });
    
    console.log(coverage.general);
    
    var button = document.getElementById('new-gen');
    button.addEventListener('click', function () {
      coverage.generate();
      coverage._renderBody();
      console.log(coverage.general);
    });
  });
})($N);
