(function (module) {
  var PrimitiveSearcher = function (sample) {
    this.generalSample = sample;
    this.subsamples = [];
    return this;
  };
  
  PrimitiveSearcher.prototype.generateSubsamples = function () {
    var glength = this.generalSample.length;
    var quantity = Math.pow(2, this.generalSample.length);
    for (var i = 0; i < quantity; i++) {
      var signature = i.toString(2);
      signature = '0'.repeat(glength - signature.length) + signature;
      var subsample = [];
      for (var s = 0; s < glength; s++) {
        if (signature.charAt(s) === '1') {
          subsample.push(this.generalSample[s]);
        }
      }
      this.subsamples.push({
        sample: subsample,
        signature: signature,
        length: this.getSampleLength(subsample)
      });
    }
//    console.log(this.subsamples);
  };
  
  PrimitiveSearcher.prototype.getSampleLength = function (sample) {
    if (!sample.length) {
      return 0;
    }
    var ordered = sample.sort(function (a, b) {
      return a.st - b.st;
    });
    var length = ordered[0].length;
    for (var i = 1; i < ordered.length; i++) {
      if (ordered[i - 1].fn < ordered[i].st) {
        length += ordered[i].length;
      } else {
        return -1;
      }
    }
    return length;
  };
  
  PrimitiveSearcher.prototype.getMaxSubsample = function () {
    return this.subsamples.length ? 
      this.subsamples.reduce(function (prev, curr) {
        return prev.length > curr.length ? prev : curr;
      }) : 0;
  };
  
  module.primitiveSearcher = function(sample) {
    return new PrimitiveSearcher(sample);
  };
})($N);


