# Sudoku Solver
## About
A Java-based Sudoku puzzle solver, using a backtracking algorithm and the concept of depth first search.

The script is hosted on Heroku at <a href="http://sudoku-solver-mdl.herokuapp.com/">sudoku-solver-mdl.herokuapp.com</a>. The one-page site uses the <a href="http://www.getmdl.io/">Material Design Lite (MDL)</a> template, based off Google's Material Design concepts.

When the user requests a puzzle to be solved, the JavaScript calls the a PHP file (solver/call_solver.php), which executes the SudokuSolver Java class (solver/SudokuSolver).

## Site Development Environment
The site developments process utilizes template languages:
* <a href="http://slim-lang.com/">Slim</a>: compiles into HTML
* <a href="http://coffeescript.org/">CoffeeScript</a>: compiles into JavaScript
* <a href="http://sass-lang.com/">SASS</a>: compiles into CSS

## Credits
Built by <a href="http://www.codereloadrepeat.com">Jake Larson</a>. Feel free to take a peek at my other projects, <a href="http://www.codereloadrepeat.com/portfolio">here</a>.