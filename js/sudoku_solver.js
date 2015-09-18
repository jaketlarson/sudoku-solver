(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.SudokuSolver = (function() {
    function SudokuSolver() {
      this.reset = __bind(this.reset, this);
      this.enable = __bind(this.enable, this);
      this.disable = __bind(this.disable, this);
      this.resetInputAfterFlash = __bind(this.resetInputAfterFlash, this);
      this.handleSuccess = __bind(this.handleSuccess, this);
      this.handleConnectionError = __bind(this.handleConnectionError, this);
      this.handleInvalid = __bind(this.handleInvalid, this);
      this.hideErrors = __bind(this.hideErrors, this);
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
      this.$sudoku_reset_button = $('a#puzzle-reset');
      this.$error_connection = $('#error-connection');
      this.$error_invalid = $('#error-invalid');
      this.rows = 9;
      this.cols = 9;
      return this.xhr_waiting = false;
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
      $(window).resize(function() {
        return _this.updateSize();
      });
      this.$sudoku_submit_form.submit(function(e) {
        e.preventDefault();
        return _this.submitPuzzle();
      });
      return this.$sudoku_reset_button.click(function() {
        return _this.reset();
      });
    };

    SudokuSolver.prototype.updateSize = function() {
      var width;
      width = this.$puzzle_interface.find('input').width();
      return this.$puzzle_interface.find('input').height(width);
    };

    SudokuSolver.prototype.submitPuzzle = function() {
      var sequence,
        _this = this;
      if (this.xhr_waiting) {
        return;
      }
      console.log('submitting');
      this.hideErrors();
      this.disable();
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
      console.log(sequence.join(' '));
      this.xhr_waiting = true;
      return $.ajax({
        type: 'GET',
        url: "" + this.solver_path + "?puzzle=" + (sequence.join(' ')),
        success: function(data) {
          _this.xhr_waiting = false;
          _this.enable();
          if (data === "invalid") {
            return _this.handleInvalid();
          } else {
            return _this.handleSuccess(data);
          }
        },
        error: function() {
          _this.xhr_waiting = false;
          _this.enable();
          return _this.handleConnectionError();
        }
      });
    };

    SudokuSolver.prototype.hideErrors = function() {
      this.$error_invalid.hide();
      return this.$error_connection.hide();
    };

    SudokuSolver.prototype.handleInvalid = function() {
      this.$error_invalid.show();
      this.$puzzle_interface.find('input').addClass('error-flash');
      return this.resetInputAfterFlash();
    };

    SudokuSolver.prototype.handleConnectionError = function() {
      return this.$error_connection.show();
    };

    SudokuSolver.prototype.handleSuccess = function(data) {
      var entries,
        _this = this;
      entries = data.split(' ');
      $.each(entries, function(index, entry) {
        return $(_this.$puzzle_interface.find('input')[index]).val(entry).addClass('success-flash');
      });
      return this.resetInputAfterFlash();
    };

    SudokuSolver.prototype.resetInputAfterFlash = function() {
      var _this = this;
      return setTimeout(function() {
        return _this.$puzzle_interface.find('input').removeClass('success-flash').removeClass('error-flash');
      }, 500);
    };

    SudokuSolver.prototype.disable = function() {
      this.$puzzle_interface.find('input').prop('disabled', true);
      this.$sudoku_submit_form.find('button').prop('disabled', true);
      return this.$sudoku_reset_button.addClass('mdl-button--disabled');
    };

    SudokuSolver.prototype.enable = function() {
      this.$puzzle_interface.find('input').prop('disabled', false);
      this.$sudoku_submit_form.find('button').prop('disabled', false);
      return this.$sudoku_reset_button.removeClass('mdl-button--disabled');
    };

    SudokuSolver.prototype.reset = function() {
      if (!this.xhr_waiting) {
        return this.$puzzle_interface.find('input').val('');
      }
    };

    return SudokuSolver;

  })();

  $(function() {
    var solver;
    return solver = new window.SudokuSolver;
  });

}).call(this);
