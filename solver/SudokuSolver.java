import java.util.Arrays;
import java.util.ArrayList;

public class SudokuSolver {
	static int[][] puzzle;
	
	public SudokuSolver(int[][] unsolved_puzzle) {
		puzzle = unsolved_puzzle;
	}
	
	// Returns [row, col]
	public static int[] findNextFreeSquare() {
		boolean foundSpot = false;
		int[] freeSpot = new int[2];
		
		for(int row = 0; row < puzzle.length; row++) {
			if(foundSpot) break;
			for(int col = 0; col < puzzle[row].length; col++) {
				if(puzzle[row][col] == 0) {
					freeSpot[0] = row;
					freeSpot[1] = col;
					foundSpot = true;
					break;
				}
			}
		}
		
		// If no available moves, then the board is full.
		// Return [-1, -1] in this special case.
		if(!foundSpot) {
			freeSpot[0] = -1;
			freeSpot[1] = -1;
		}
		
		return freeSpot;
	}
	
	public static ArrayList<Integer> legalMoves(int[] spot) {
		// int[] spot parameter = [row, col]

		// Rules:
		// 1. Unique number per 3x3 square
		// 2. Unique in row
		// 3. Unique in column
		
		ArrayList<Integer> possible_moves = new ArrayList<>();
		
		// Since sudoku is a square, use the length of a row as the possible move
		// value range.
		for(int move = 1; move <= puzzle[0].length; move++) {
			boolean is_legal = true;

			// See if number exists in row
			for(int j = 0; j < puzzle[spot[0]].length; j++) {
				if(puzzle[spot[0]][j] == move) {
					is_legal = false;
					break;
				}
			}
			if(!is_legal) continue;
			
			// See if number exists in column
			for(int j = 0; j < puzzle[spot[1]].length; j++) {
				if(puzzle[j][spot[1]] == move) {
					is_legal = false;
					break;
				}
			}
			if(!is_legal) continue;
			
			// See if number exists in square
			// Square (int[row, col]) holds indices square in row and column [(0, 1, or 2), (0, 1, or 2)]
			int square_row = spot[0]/3;
			int square_col = spot[1]/3;

			for(int j = square_row*3; j < square_row*3+3; j++) {
				for(int k = square_col*3; k < square_col*3+3; k++) {
					if(puzzle[j][k] == move) {
						is_legal = false;
						break;
					}
				}
			}
			
			if(is_legal) {
				possible_moves.add(move);
			}
		}
		
		return possible_moves;
	}
	
	public boolean solve() {
		int[] next_free_spot = findNextFreeSquare();
		
		// If the next free move is [-1, -1], there are no available moves..
		// The board is solved!
		if(next_free_spot[0] == -1 && next_free_spot[1] == -1) return true;
		
		ArrayList<Integer> legal_moves = legalMoves(next_free_spot);
		
		if(legal_moves.size() > 0) {
			for(int i = 0; i < legal_moves.size(); i++) {
				puzzle[next_free_spot[0]][next_free_spot[1]] = legal_moves.get(i);
				if(solve()) {
					puzzle[next_free_spot[0]][next_free_spot[1]] = legal_moves.get(i);
					return true;
				} else {
					puzzle[next_free_spot[0]][next_free_spot[1]] = 0;
				}
			}
		}
		return false;
	}
	
	public boolean isLegal() {
		// isLegal() makes sure the submitted puzzle is legal, before attempting to solve.
		// The run time will be longer, but invalid inputs will cause a never-ending loop.
		// It would be cool to find a way to minimize the work done here.

		// Check horizontally
		for(int i = 0; i < puzzle.length; i++) {
			int[] h_digits = new int[puzzle.length]; // digits on the horizontal (this row)
			for(int j = 0; j < puzzle[i].length; j++) {
				if(puzzle[i][j] > 0) {
					if(h_digits[puzzle[i][j]-1] > 0) {
						return false;
					} else {
						h_digits[puzzle[i][j]-1] = puzzle[i][j];
					}
				}
			}
		}
		
		// Check vertically
		for(int i = 0; i < puzzle.length; i++) {
			int[] v_digits = new int[puzzle.length]; // digits on the vertical (this column)
			for(int j = 0; j < puzzle.length; j++) {
				if(puzzle[j][i] > 0) {
					if(v_digits[puzzle[j][i]-1] > 0) {
						return false;
					} else {
						v_digits[puzzle[j][i]-1] = puzzle[j][i];
					}
				}
			}
		}

		// Check 3x3 squares now, per possible move
		for(int move = 1; move <= puzzle.length; move++) {
			// Move through 3x3 squares vertically
			for(int i = 0; i < puzzle.length / 3; i++) {
				
				// Move through 3x3 squares horizontally
				for(int j = 0; j < puzzle.length / 3; j++) {
					// Check if horizontal lines in this row of this 3x3 square == this move

					// move_count tracks number of occurrences of this move in this 3x3 square
					int move_count = 0;
					for(int k = j*3; k < j*3+3; k++) {
						if(puzzle[i*3+0][k] == move || puzzle[i*3+1][k] == move || puzzle[i*3+2][k] == move) {
							if(move_count == 0) {
								move_count++;
//debug:								System.out.println(move +" set near ["+i*3+"]["+k+"] or ["+i*3+1+"]["+k+"] or ["+i*3+2+"]["+k+"]");
							} else {
//debug:								System.out.println(move +" invalid near ["+i*3+"]["+k+"]");
								return false;
							}
						}
					}
				}
			}
		}
		
		return true;
	}
	
	public void showCurrentPuzzle() {
		// Spits out readable form of puzzle
		for(int i = 0; i < puzzle.length; i++) {
			System.out.println(Arrays.toString(puzzle[i]));
		}
	}
	
	public String toString() {
		// Return puzzle entries separated by spaces,
		// starting from first row, first column to last row, last column
		String entries_string = "";
		for(int i = 0; i < puzzle.length; i++) {
			for(int j = 0; j < puzzle[i].length; j++) {
				entries_string += Integer.toString(puzzle[i][j]) +" ";
			}
		}
		
		return entries_string.trim();
	}

	public static void main(String[] args) {
		// dev_mode changes environment to a testable mode from IDE.
		// When dev_mode is false, the output and input are strings of entries.
		// When dev_mode is true, the input is int[][].
		boolean dev_mode = false;
		
		if(!dev_mode) {
			int args_index;

			// Make sure the number of entries is the size of a sudoku puzzle (81 entries total)
			if(args.length != 9*9) {
				System.out.println("invalid");
				System.exit(1);
			}
			
			int[][] input_puzzle = new int[9][9];
			for(int i = 0; i < input_puzzle.length; i++) {
				for(int j = 0; j < input_puzzle[i].length; j++) {
					args_index = i*input_puzzle.length + j;
					input_puzzle[i][j] = Integer.parseInt(args[args_index]);
				}
			}
			
			SudokuSolver solver = new SudokuSolver(input_puzzle);
			
			if(solver.isLegal()) {
				solver.solve();
				System.out.println(solver.toString());

			} else {
				System.out.println("invalid");
			}

		} else {
			// Log start time for performance statistic
			long start = System.currentTimeMillis();

			// Test puzzles
			//int[][] puzzle = {{3, 0, 0, 4, 5, 0, 1, 0, 6}, {2, 5, 0, 1, 9, 0, 0, 3, 0}, {0, 1, 8, 0, 0, 0, 0, 9, 0}, {0, 9, 0, 0, 1, 0, 0, 0, 5}, {6, 0, 0, 0, 2, 0, 0, 0, 1}, {7, 0, 0, 0, 4, 0, 0, 6, 0}, {0, 3, 0, 0, 0, 0, 6, 7, 0}, {0, 6, 0, 0, 7, 1, 0, 5, 8}, {5, 0, 7, 0, 6, 9, 0, 0, 2}};
			//int[][] puzzle = {{3, 2, 0, 0, 6, 7, 0, 0, 5}, {0, 5, 1, 9, 0, 0, 3, 6, 0}, {0, 0, 8, 0, 0, 0, 0, 0, 7}, {4, 1, 0, 0, 0, 0, 0, 0, 0,}, {5, 9, 0, 1, 2, 4, 0, 7, 6}, {0, 0, 0, 0, 0, 0, 0, 1, 9}, {1, 0, 0, 0, 0, 0, 6, 0, 0}, {0, 3, 9, 0, 0, 6, 7, 5, 0}, {6, 0, 0, 5, 1, 0, 0, 8, 2}};
			int[][] puzzle = {{8, 4, 0, 2, 0, 0, 0, 0, 0}, {9, 3, 0, 8, 0, 0, 0, 0, 0}, {0, 7, 0, 1, 0, 0, 5, 0, 0}, {0, 0, 8, 0, 0, 0, 0, 7, 0}, {1, 0, 4, 0, 0, 0, 6, 0, 9}, {0, 5, 0, 0, 0, 0, 4, 0, 0}, {0, 0, 7, 0, 0, 6, 0, 4, 0}, {0, 0, 0, 0, 0, 5, 0, 1, 6}, {0, 0, 0, 0, 0, 8, 0, 5, 2}};
			
			SudokuSolver solver = new SudokuSolver(puzzle);
			System.out.println("Your puzzle input:");
			solver.showCurrentPuzzle();

			if(solver.isLegal()) {
				if(solver.solve()) {
					System.out.println("\nYour puzzle has been solved! Here it is:");
					solver.showCurrentPuzzle();
				} else {
					System.out.println("\nInvalid puzzle, could not solve.");
				}
			} else {
				System.out.println("\nYour puzzle is illegal.");
			}

			long time = System.currentTimeMillis() - start;
			System.out.println("\nYour puzzle was solved (or attempted) in "+ time +" milliseconds!");
		}
			

			
	}
}
