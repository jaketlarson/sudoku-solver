(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.SudokuSolver = (function() {
    function SudokuSolver() {
      this.handleSuccess = __bind(this.handleSuccess, this);
      this.handleInvalid = __bind(this.handleInvalid, this);
      this.submitPuzzle = __bind(this.submitPuzzle, this);
      this.updateSize = __bind(this.updateSize, this);
      this.initListeners = __bind(this.initListeners, this);
      this.buildPuzzleInterface = __bind(this.buildPuzzleInterface, this);
      this.initEnv = __bind(this.initEnv, this);
      this.initEnv();
      this.buildPuzzleInterface();
      this.initListeners();
      this.updateSize();
    }

    SudokuSolver.prototype.initEnv = function() {
      this.solver_path = "http://sudoku-solver-mdl.herokuapp.com/solver/call_solver.php";
      this.$puzzle_interface = $('#puzzle-interface');
      this.$sudoku_submit_form = $('form#sudoku-submit');
      this.rows = 9;
      return this.cols = 9;
    };

    SudokuSolver.prototype.buildPuzzleInterface = function() {
      var $row, i, _i, _j, _ref, _ref1, _results;
      _results = [];
      for (i = _i = 1, _ref = this.rows; 1 <= _ref ? _i <= _ref : _i >= _ref; i = 1 <= _ref ? ++_i : --_i) {
        console.log(i);
        $row = $('<div />').attr('class', 'puzzle-row');
        for (i = _j = 1, _ref1 = this.cols; 1 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 1 <= _ref1 ? ++_j : --_j) {
          $row.append("<input type='text' maxlength='1'>");
        }
        _results.push(this.$puzzle_interface.append($row));
      }
      return _results;
    };

    SudokuSolver.prototype.initListeners = function() {
      var _this = this;
      this.$puzzle_interface.find('input').keyup(function(e) {
        var $elem, index, val;
        $elem = $(e.currentTarget);
        val = parseInt($elem.val());
        if (val >= 1 && val <= 9) {
          index = _this.$puzzle_interface.find('input').index($elem);
          if (index !== _this.$puzzle_interface.find('input').length - 1) {
            return _this.$puzzle_interface.find('input')[index + 1].focus();
          }
        }
      });
      $(window).resize(function() {
        return _this.updateSize();
      });
      return this.$sudoku_submit_form.submit(function(e) {
        e.preventDefault();
        return _this.submitPuzzle();
      });
    };

    SudokuSolver.prototype.updateSize = function() {
      var width;
      width = this.$puzzle_interface.find('input').width();
      this.$puzzle_interface.find('input').height(width);
      return console.log(width);
    };

    SudokuSolver.prototype.submitPuzzle = function() {
      var sequence,
        _this = this;
      sequence = [];
      $.each(this.$puzzle_interface.find('input'), function(index, elem) {
        var value;
        value = parseInt($(elem).val());
        if (value >= 1 && value <= 9) {
          return sequence.push(value);
        } else {
          return sequence.push(0);
        }
      });
      console.log(sequence.length);
      return $.ajax({
        type: 'GET',
        url: "" + this.solver_path + "?puzzle=" + (sequence.join(' ')),
        success: function(data) {
          if (data === "invalid") {
            return _this.handleInvalid();
          } else {
            return _this.handleSuccess(data);
          }
        },
        error: function() {
          return console.log('darn');
        }
      });
    };

    SudokuSolver.prototype.handleInvalid = function() {
      return console.log('invalid');
    };

    SudokuSolver.prototype.handleSuccess = function(data) {
      var entries,
        _this = this;
      entries = data.split(' ');
      return $.each(entries, function(index, entry) {
        return _this.$puzzle_interface.find('input')[index].val(entry);
      });
    };

    return SudokuSolver;

  })();

  $(function() {
    var solver;
    return solver = new window.SudokuSolver;
  });

}).call(this);
