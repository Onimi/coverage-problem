(function (module) {
  
  var QUANTITY = 4;
  var START = 1;
  var FINISH = 50;
  
  var Coverage = function() {
    this.selected = {};
    this.general = [];
    this.$selected = {};
    this.summary = 0;
    this.$generalTable = document.getElementsByClassName('general-table')[0];
    this.$coverageRow = document.getElementById('coverage-row');
    this.$resCell = document.getElementsByClassName('result')[0];
    return this;
  };
  
  Coverage.prototype.generate = function () {
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
  
  Coverage.prototype.init = function () {
    
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
      this.summary += segment.length;
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
      module.removeClass('chosen', $elem);
      this.summary -= segment.length;
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
  
  Coverage.prototype._createEmptyCell = function (length) {
    var $cell = document.createElement('td');
    if (length) {
      $cell.setAttribute('colspan', length);
    }
    return $cell;
  };
  
  Coverage.prototype._addEmptyCell = function (target, length) {
    target.appendChild(this._createEmptyCell(length));
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
    return $cell;
  };
  
  Coverage.prototype._addCoverageCell = function (target, segment) {
    target.appendChild(this._createCoverageCell(segment));
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
  
  Coverage.prototype.onclickSegmentCell = function (e) {
    this.$toggleSegment(e.target);
    this._renderFooter();
    e.preventDefault();
  };
  
  Coverage.prototype._addSegmentCell = function (target, segment) {
    target.appendChild(this._createSegmentCell(segment));
  };
  
  Coverage.prototype._createSegmentRow = function (segment) {
    var $row = document.createElement('tr');
    this._addRangeCell($row, segment.st + ' - ' + segment.fn);
    if (segment.st - START) {
      this._addEmptyCell($row, segment.st - START);
    }
    this._addSegmentCell($row, segment);
    if (FINISH - segment.fn) {
      this._addEmptyCell($row, FINISH - segment.fn);
    }
    return $row;
  };
  
  Coverage.prototype._addSegmentRow = function (target, segment) {
    target.appendChild(this._createSegmentRow(segment));
  };
  
  Coverage.prototype._removeAllChildNodes = function (target) {
    var $node;
    while ($node = target.firstChild) {
      target.removeChild($node);
    }
  };
  
  Coverage.prototype._renderFooter = function () {
    var ordered = [];
    for (var id in this.$selected) {
      ordered.push(this.$selected[id]);
    }
    ordered.sort(function (a, b) {
      return a.st - b.st;
    });
    
    this.$resCell.innerHTML = this.summary;
    this._removeAllChildNodes(this.$coverageRow);
    this._addRangeCell(this.$coverageRow, 'Coverage');
    if (ordered.length === 0) {
      this._addEmptyCell(this.$coverageRow, 50);
      return;
    }
    for (var i = 0; i < ordered.length; i++) {
      var left = i ? ordered[i-1].fn : 0;
      if (ordered[i].st - left - 1) {
        this._addEmptyCell(this.$coverageRow, ordered[i].st - left - 1);
      }
      this._addCoverageCell(this.$coverageRow, ordered[i], true);
    }
    if (50 - ordered[ordered.length - 1].fn) {
      this._addEmptyCell(this.$coverageRow, 50 - ordered[ordered.length - 1].fn);
    }
  };
  
  Coverage.prototype._renderBody = function () {
    this._removeAllChildNodes(this.$generalTable);
    for (var i = 0; i < this.general.length; i++) {
      this._addSegmentRow(this.$generalTable, this.general[i]);
    }
  };
  
  module.coverage = function() {
    return new Coverage();
  };
})($N);
