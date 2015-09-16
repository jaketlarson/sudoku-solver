<?php
$puzzle = $_GET['puzzle'];
echo $puzzle;
exec("java SudokuSolver $puzzle 2>&1", $output);
print_r($output);
?>