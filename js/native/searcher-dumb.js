(function (module) {
  var PrimitiveSearcher = function (sample) {
    this.generalSample = sample;
    this.solution = {
      length: 0
    };
    return this;
  };
  
  PrimitiveSearcher.prototype.generateSubsamples = function () {
    var glength = this.generalSample.length;
    var quantity = Math.pow(2, glength);
    for (var i = 0; i < quantity; i++) {
      var subsample = [];
      var signature = i.toString(2);
      signature = '0'.repeat(glength - signature.length) + signature;
      for (var s = 0; s < glength; s++) {
        if (signature.charAt(s) === '1') {
          subsample.push(this.generalSample[s]);
        }
      }
      var length = this.getSampleLength(subsample);
      if (length > this.solution.length) {
//        this.solution.sample = subsample;
        this.solution.signature = signature;
        this.solution.length = length;
      }
    }
  };
  
  PrimitiveSearcher.prototype.getSampleLength = function (sample) {
    if (!sample.length) {
      return 0;
    }
    var ordered = sample.sort(function (a, b) {
      return a.st - b.st;
    });
//    var length = ordered[0].length;
    var length = module.measure(ordered[0]);
    for (var i = 1; i < ordered.length; i++) {
      if (ordered[i - 1].fn < ordered[i].st) {
//        length += ordered[i].length;
        length += module.measure(ordered[i]);
      } else {
        return -1;
      }
    }
    return length;
  };
  
  PrimitiveSearcher.prototype.getMaxSubsample = function () {
    return this.solution;
  };
  
  module.primitiveSearcher = function(sample) {
    return new PrimitiveSearcher(sample);
  };
})($N);


