# Sudoku Solver
## About
A Java-based Sudoku puzzle solver, using a backtracking algorithm and the concept of depth first search.

The script is hosted on Heroku <a href="http://sudoku-solver-mdl.herokuapp.com/">. The one-page site uses the <a href="http://www.getmdl.io/">Material Design Lite</a> template, based off Google's Material Design concepts.

When the user requests a puzzle to be solved, the JavaScript calls the a PHP file (solver/call_solver.php), which executes the SudokuSolver Java class (solver/SudokuSolver).

## Site Development Environment
The site developments process utilizes template languages:
* Slim: compiles into HTML
* CoffeeScript: compiles into JavaScript
* SASS: compiles into CSS

## Credits
Built by <a href="http://www.codereloadrepeat.com">Jake Larson</a>. Feel free to take a peek at my other projects, <a href="http://www.codereloadrepeat.com/portfolio">here</a>.