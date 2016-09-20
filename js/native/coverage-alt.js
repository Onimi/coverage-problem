(function (module) {
  
  var QUANTITY = 20;
  var START = 1;
  var FINISH = 50;
  
  var Coverage = function () {
    this.selected = {};
    this.general = [];
    this.$selected = {};
    this.summary = 0;
    this.$table = {
      header: document.getElementsByClassName('table-header')[0],
      body: document.getElementsByClassName('table-body')[0],
      footer: document.getElementsByClassName('table-footer')[0]
    };
    this.$coverageRow = document.getElementById('coverage-row');
    this.$resCell = document.getElementsByClassName('result')[0];
    
    this.init();
    return this;
  };
  
  Coverage.prototype.generateOld = function () {
    for (var i = 0; i < QUANTITY; i++) {
      var a = Math.floor(Math.random() * (FINISH - START + 1)) + START;
      var b = Math.floor(Math.random() * (FINISH - START + 1)) + START;
      this.general[i] = (a < b) ? {
        id: i,
        st: a,
        fn: b,
        length: b - a + 1
      } : {
        id: i,
        st: b,
        fn: a,
        length: a - b + 1
      };
    }
  };
  
  Coverage.prototype.generate = function () {
    var diameter = (FINISH - START);
    for (var i = 0; i < QUANTITY; i++) {
      var a = Math.floor(Math.random() * (FINISH - START + 1)) + START;
      var b = Math.floor(Math.random() * (FINISH - START + 1)) + START;
      var center = (a + b) / 2;
      if (Math.abs(a - b) * 2 > diameter) {
        a = Math.floor((a + center) / 2);
        b = Math.floor((b + center) / 2);
        this.general[i] = (a < b) ? {
          id: i,
          st: a,
          fn: b,
          length: b - a + 1
        } : {
          id: i,
          st: b,
          fn: a,
          length: a - b + 1
        };
      } else {
        this.general[i] = (a < b) ? {
          id: i,
          st: a,
          fn: b,
          length: b - a + 1
        } : {
          id: i,
          st: b,
          fn: a,
          length: a - b + 1
        };
      }
    }
  };
  
  Coverage.prototype.init = function () {
    this.generate();
    this._renderTable();
  };
  
  Coverage.prototype.dropSelected = function () {
    this.selected = {};
    this.$selected = {};
    this.summary = 0;
  };
  
  Coverage.prototype.reset = function () {
    this.dropSelected();
    this.init();
  };
  
  Coverage.prototype.isValidSegment = function (segment) {
    if (segment.id !== undefined && segment.st !== undefined && segment.fn !== undefined && segment.length) {
      for (var id in this.selected) {
        if (this.selected[id].st <= segment.st && segment.st <= this.selected[id].fn) {
          return false;
        }
        if (this.selected[id].st <= segment.fn && segment.fn <= this.selected[id].fn) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
  
  Coverage.prototype.addSegment = function (segment) {
    if (this.isValidSegment(segment)) {
      this.selected[segment.id] = segment;
    }
  };
  
  Coverage.prototype.$getElementData = function ($elem) {
    return {
      id: Number($elem.getAttribute('data-segment-id')),
      st: Number($elem.getAttribute('data-segment-st')),
      fn: Number($elem.getAttribute('data-segment-fn')),
      length: Number($elem.getAttribute('data-segment-length'))
    };
  };
  
  Coverage.prototype.$isValidSegment = function ($elem) {
    var segment = this.$getElementData($elem);
    if (segment.id !== undefined && segment.st !== undefined && segment.fn !== undefined && segment.length) {
      for (var id in this.$selected) {
        if (this.$selected[id].st <= segment.st && segment.st <= this.$selected[id].fn) {
          return false;
        }
        if (this.$selected[id].st <= segment.fn && segment.fn <= this.$selected[id].fn) {
          return false;
        }
        if (segment.st <= this.$selected[id].st && this.$selected[id].st <= segment.fn) {
          return false;
        }
        if (segment.st <= this.$selected[id].fn && this.$selected[id].fn <= segment.fn) {
          return false;
        }
      }
      return true;
    }
    return false;
  };
  
  Coverage.prototype.$addSegment = function ($elem) {
    if (this.$isValidSegment($elem)) {
      var segment = this.$getElementData($elem);
      segment['$elem'] = $elem;
      this.$selected[segment.id] = segment;
//      this.summary += segment.length;
      this.summary += module.measure(segment);
      module.addClass('chosen', $elem);
    }
    return this;
  };
  
  Coverage.prototype.$hasSegment = function ($elem) {
    var id = $elem.getAttribute('data-segment-id');
    return this.$selected[id] !== undefined;
  };
  
  Coverage.prototype.$removeSegment = function ($elem) {
//    var id = $elem.getAttribute('data-segment-id');
    var segment = this.$getElementData($elem);
    if (this.$selected[segment.id] !== undefined) {
      module.removeClass('chosen', this.$selected[segment.id].$elem || $elem);
//      this.summary -= segment.length;
      this.summary -= module.measure(segment);
      delete this.$selected[segment.id];
    }
    return this;
  };
  
  Coverage.prototype.$toggleSegment = function ($elem) {
    return this.$hasSegment($elem) ? this.$removeSegment($elem) : this.$addSegment($elem);
  };
  
  Coverage.prototype._createRangeCell = function (text) {
    var $cell = document.createElement('td');
    $cell.className = 'range-cell';
    $cell.appendChild(document.createTextNode(text));
    return $cell;
  };
  
  Coverage.prototype._addRangeCell = function (target, text) {
    target.appendChild(this._createRangeCell(text));
  };
  
  Coverage.prototype._createEmptyCell = function (coordinate) {
    var $cell = document.createElement('td');
    $cell.className = 'prime-cell';
    $cell.setAttribute('data-coordinate', coordinate);
    return $cell;
  };
  
  Coverage.prototype._addEmptyCell = function (target, coordinate) {
    target.appendChild(this._createEmptyCell(coordinate));
  };
  
  Coverage.prototype.onclickCoverageCell = function (e) {
    this.$removeSegment(e.target);
    this._renderFooter();
    this._renderSegmentsDisabled();
    e.preventDefault();
//    console.log(this.$selected);
  };
  
  Coverage.prototype._createCoverageCell = function (segment) {
    var $cell = document.createElement('td');
    $cell.className = 'coverage-part';
    $cell.setAttribute('colspan', segment.length);
    $cell.setAttribute('data-segment-id', segment.id);
    $cell.setAttribute('data-segment-st', segment.st);
    $cell.setAttribute('data-segment-fn', segment.fn);
    $cell.setAttribute('data-segment-length', segment.length);
    $cell.setAttribute('title', segment.length);
    $cell.addEventListener('click', this.onclickCoverageCell.bind(this));
    return $cell;
  };
  
  Coverage.prototype._addCoverageCell = function (target, segment) {
    target.appendChild(this._createCoverageCell(segment));
  };
  
  Coverage.prototype.onclickSegmentCell = function (e) {
    this.$toggleSegment(e.target);
    this._renderFooter();
    this._renderSegmentsDisabled();
    e.preventDefault();
//    console.log(this.$selected);
  };
  
  Coverage.prototype._createSegmentCell = function (segment) {
    var $cell = document.createElement('td');
    $cell.className = 'segment';
    $cell.setAttribute('colspan', segment.length);
    $cell.setAttribute('data-segment-id', segment.id);
    $cell.setAttribute('data-segment-st', segment.st);
    $cell.setAttribute('data-segment-fn', segment.fn);
    $cell.setAttribute('data-segment-length', segment.length);
    $cell.setAttribute('title', segment.length);
    $cell.addEventListener('click', this.onclickSegmentCell.bind(this));
    return $cell;
  };
  
  Coverage.prototype._addSegmentCell = function (target, segment) {
    target.appendChild(this._createSegmentCell(segment));
  };
  
  Coverage.prototype._createSegmentRow = function (segment) {
    var i;
    var $row = document.createElement('tr');
    this._addRangeCell($row, segment.st + ' - ' + segment.fn + '; ' + segment.length);
    for (i = START; i < segment.st; i++) {
      this._addEmptyCell($row, i);
    }
    this._addSegmentCell($row, segment);
    for (i = segment.fn + 1; i <= FINISH; i++) {
      this._addEmptyCell($row, i);
    }
    return $row;
  };
  
  Coverage.prototype._addSegmentRow = function (target, segment) {
    target.appendChild(this._createSegmentRow(segment));
  };

  Coverage.prototype._createHeaderRow = function () {
    var $row = document.createElement('tr');
    var $cell = document.createElement('th');
    $cell.className = 'range-cell';
    $cell.appendChild(document.createTextNode('Range'));
    $row.appendChild($cell);
    
    for (var i = START; i <= FINISH; i++) {
      $cell = document.createElement('th');
      $cell.appendChild(document.createTextNode(i));
      $row.appendChild($cell);
    }
    return $row;
  };
  
  Coverage.prototype._addHeaderRow = function (target) {
    target.appendChild(this._createHeaderRow());
  };
  
  Coverage.prototype._removeAllChildNodes = function (target) {
    var $node;
    while ($node = target.firstChild) {
      target.removeChild($node);
    }
  };
  
  Coverage.prototype._renderCoverageRow = function () {
    var ordered = [];
    for (var id in this.$selected) {
      ordered.push(this.$selected[id]);
    }
    ordered.sort(function (a, b) {
      return a.st - b.st;
    });
    
    var $primeCells = document.getElementsByClassName('prime-cell');
    Array.prototype.forEach.call($primeCells, function ($cell) {
      module.removeClass('covered-cell', $cell);
    });
    
    this.$resCell.innerHTML = this.summary;
    this._removeAllChildNodes(this.$coverageRow);
    this._addRangeCell(this.$coverageRow, 'Coverage');
    if (ordered.length === 0) {
      for (var x = START; x <= FINISH; x++) {
        this._addEmptyCell(this.$coverageRow, x);
      }
      return;
    }
    for (var i = 0; i < ordered.length; i++) {
      var lstart = i ? ordered[i-1].fn + 1 : START;
      for (var x = lstart; x < ordered[i].st; x++) {
        this._addEmptyCell(this.$coverageRow, x);
      }
      this._addCoverageCell(this.$coverageRow, ordered[i], true);
      
//      for (var x = ordered[i].st; x <= ordered[i].fn; x++) {
//        var $column = document.querySelectorAll('[data-coordinate="'+x+'"]');
//        Array.prototype.forEach.call($column, function($cell) {
//          module.addClass('covered-cell', $cell);
//        });
//      }
    }
    for (var x =ordered[ordered.length - 1].fn + 1; x <= FINISH; x++) {
      this._addEmptyCell(this.$coverageRow, x);
    }
  };
  
  Coverage.prototype._renderFooter = function () {
    document.getElementsByClassName('result')[0].setAttribute('colspan', FINISH - START + 1);
    this._renderCoverageRow();
  };
  
  Coverage.prototype._renderBody = function () {
    this._removeAllChildNodes(this.$table.body);
    for (var i = 0; i < this.general.length; i++) {
      this._addSegmentRow(this.$table.body, this.general[i]);
    }
  };
    
  Coverage.prototype._renderHeader = function () {
    this._removeAllChildNodes(this.$table.header);
    this._addHeaderRow(this.$table.header);
  };
  
  Coverage.prototype._renderTable = function () {
    this._renderHeader();
    this._renderBody();
    this._renderFooter();
    return this;
  };
  
  Coverage.prototype._renderSegmentsDisabled = function () {
    var self = this;
    var $segments = document.getElementsByClassName('segment');
    Array.prototype.forEach.call($segments, function ($element) {
      var segment = self.$getElementData($element);
      if (self.$selected[segment.id] === undefined) {
        self.$isValidSegment($element) ? 
          module.removeClass('disabled', $element) :
          module.addClass('disabled', $element);
      }
    });
  };
  
  Coverage.prototype.sortBy = function (compare) {
    this.dropSelected();
    this.general.sort(compare);
    this._renderTable();
  };
//  ----------------------------------------------------------------------------
//  ----------------------------------------------------------------------------
  module.coverage = function() {
    return new Coverage();
  };
})($N);
