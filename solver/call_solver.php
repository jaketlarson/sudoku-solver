<?php
$puzzle = $_GET['puzzle'];
echo $puzzle;
exec("java SudokuSolver ".$puzzle." 2>&1", $output);
echo $output[0];
?>