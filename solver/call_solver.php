<?php
$puzzle = $_GET['puzzle'];
exec("java SudokuSolver ".$puzzle." 2>&1", $output);
print($output[0]);
?>