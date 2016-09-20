(function () {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('ready');
    
    var segments = document.getElementsByClassName('segment');
    
    Array.prototype.forEach.call(segments, function(el) {
      console.log(el.getAttribute('data-segment-id'));
      console.log(el.getAttribute('class'));
      
      el.addEventListener('click', function() {
//        console.log(this.className);
//        console.log(this.classList);
        
        console.log(hasClass('segment', this));
        console.log(hasClass('chosen', this));
        
//        var className = this.className;
//        var index = this.className.indexOf('chosen');
//        if (index === -1) {
//          this.setAttribute('class', className + ' chosen');
//        } else {
//          this.setAttribute('class', className.replace('chosen', '').trim().replace('  ', ' '));
//        }

      });
    });
  });
})();

