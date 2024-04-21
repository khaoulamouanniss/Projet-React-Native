//File of functions js

/**
 * This function is designed to generate a random integer between two terminals, min and max, included
 * @param {*} min the minimum limit of the interval
 * @param {*} max the maximum limit of the interval
 * @returns a random integer 
 */
function generateNumberRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generates a 2D table representing the puzzle. The boxes are filled randomly, except for the last box that is left blank.
 * @returns the 2D table representing the puzzle 
 */
export function generatePuzzle(maxLine, maxColumn, empty) {
    const boxes = new Array(maxLine * maxColumn); // A 1D array of length equal to the total number of boxes in the puzzle
    
    boxes.fill(0); // default fill(0) starts at 0 up to length
    boxes.forEach((v, idx) => boxes[idx] = idx + 1); // => [1, 2, 3 , ... , length]
    boxes[boxes.length - 1] = empty;

    // The mix is done by exchanging each box with another random position in the table.
    for (let i = boxes.length - 2; i > 0; i--) {
        const j = generateNumberRnd(0, i);
        [boxes[i], boxes[j]] = [boxes[j], boxes[i]]; // changes elements of i and j indexes
      }
  
    let puzzle2D = [];
    //The initial array boxes are divided into sub-arrays of maxColumn length, each corresponding to a line in the puzzle
    for (let i = 0; i < maxLine; i++) {
      puzzle2D.push(boxes.slice(i * maxColumn, (i + 1) * maxColumn));
    }

    return puzzle2D;
}

/**
 * Exchange two boxes in the 2D table
 * @param {*} l1 first box line position
 * @param {*} c1 first box column position
 * @param {*} l2 second box line position
 * @param {*} c2 second box column position
 * @param {*} ct2D a 2D table that contain the boxes to swipe
 * @returns a new 2D table that contains the 2 boxes swaped
 */
export function swapBoxes(l1, c1, l2, c2, ct2D) {

    let newPuzzle2D = ct2D.map(row => [...row]); // cloning
  [newPuzzle2D[l1][c1], newPuzzle2D[l2][c2]] = [newPuzzle2D[l2][c2], newPuzzle2D[l1][c1]]; // exchange

  return newPuzzle2D;
}

/**
 * Checks if a box adjacent to a given position is empty
 * @param {*} l line position
 * @param {*} c column position
 * @param {*} ct2D 2D table
 * @returns the coordinates of the empty box
 * @param {*} params the dimensions of the puzzle
 * @returns the position of the empty box if exists if not null
 */
export function adjacentIsEmpty(l, c, ct2D, params) {
    const directions = [[0, -1], [-1, 0], [0, 1], [1, 0]]; // Up, Left, Down, Right
    for (let [dl, dc] of directions) {
        const nl = l + dl, nc = c + dc;
        if (nl >= 0 && nl < params.maxLine && nc >= 0 && nc < params.maxColumn && ct2D[nl][nc] === params.empty) return [nl, nc]; 
    }
    return null; 
}

/**
 * Determines if the puzzle is solved correctly, checking if all the boxes are in ascending order, except the last one that must be empty.
 * @param {*} ct2D 2D table (the puzzle)
 * @returns boolean
 */
export function isWinner(ct2D, params) {

    let counter = 1;
    for (let i = 0; i < params.maxLine; i++) {
        for (let j = 0; j < params.maxColumn; j++) {
            if (i === params.maxLine - 1 && j === params.maxColumn - 1) {
                if (ct2D[i][j] !== params.empty) return false; // Last box must be empty
            } else {
                if (ct2D[i][j] !== counter) return false; // The other boxes must be in order croissant
                counter++;
            }
        }
    }
    return true; 
}

 /**
  * This function is called when the user interacts with a square in the puzzle. It checks if the adjacent box is empty and, if so, swaps the boxes and updates the number of movements. It also checks whether the puzzle is solved.
  * @param {*} l line position
  * @param {*} c culumn position
  * @param {*} puzzle2D the puzzle that caontains the box to move
  * @param {*} params contains the dimension of the puzzle
  * @param {*} setPuzzle2D the set to update puzzle2D
  * @param {*} selectionMoves the statistics of moves
  * @param {*} setSelectionMoves the set to update the statistics
  * @param {*} setIsSolved the set to update solved if the puzzle is solved
  */
export const move_cb = (l, c, puzzle2D, params, setPuzzle2D,selectionMoves, setSelectionMoves, setIsSolved) => {
    const emptyPosition = adjacentIsEmpty(l, c, puzzle2D, params);
    if (emptyPosition) {
        const [emptyL, emptyC] = emptyPosition;
        const newPuzzle2D = swapBoxes(l, c, emptyL, emptyC, puzzle2D);
        setPuzzle2D(newPuzzle2D);
        const newMoves = selectionMoves.moves + 1;
        let newBestMoves = selectionMoves.bestMoves;
        let newWorstMoves = selectionMoves.worstMoves;

        if (isWinner(newPuzzle2D, params)) {
            if ((newMoves < newBestMoves) || newBestMoves === 0) newBestMoves = newMoves;
            if (newMoves > newWorstMoves) newWorstMoves = newMoves;
            setIsSolved(true);
        }

        setSelectionMoves({
            moves: newMoves,
            bestMoves: newBestMoves,
            worstMoves: newWorstMoves
        });
    }
};

/**
 * A function to generate a new puzzle
 * @param {*} params the dimensions of the puzzle
 * @param {*} setPuzzle2D the set to update puzzle2D
 * @param {*} setSelectionMoves the set to update moves statistics
 * @param {*} setIsSolved the set to update solved
 */
export const newPuzzle = (params, setPuzzle2D, setSelectionMoves, setIsSolved) => {
    setPuzzle2D(generatePuzzle(params.maxLine, params.maxColumn, params.empty));
    setSelectionMoves({ moves: 0, bestMoves: 0, worstMoves: 0 });
    setIsSolved(false);
};