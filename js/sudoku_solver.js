(function() {
  window.SudokuSolver = (function() {
    function SudokuSolver() {
      console.log('test');
    }

    return SudokuSolver;

  })();

  $(function() {
    var solver;
    console.log('init file');
    return solver = new window.SudokuSolver;
  });

}).call(this);
