<?php
exec("java SudokuSolver 5 2>&1", $output);
print_r($output);
?>