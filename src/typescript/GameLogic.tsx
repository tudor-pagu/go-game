import Immutable, { List, Range } from "immutable"
import Player from "./Player";
import Cell from "./PlayerEnum";
import Position from "./Position";

type BoardCell = Cell.White | Cell.Black | Cell.Empty;

type Board = List<List<BoardCell>>;

function getEmptyBoard(boardSize: number): Board {
    return List(Range(0, boardSize).map(row => List(Range(0, boardSize).map(col => {
            return Cell.Empty;
        }))))
}


function inBounds(x:number, y:number, n:number) : boolean {
    return (0 <= x && x < n && 0 <= y && y < n);
}
function getGroup(board:Board, pos : Position) : Position[] {
    const dx = [0,0,-1,1];
    const dy = [1,-1,0,0];
    Range(0,4).map(k => {
        const new_col = pos.row 
        if (inBounds(dx,dy,board.size))
    });
}

function countLiberties(board : Board, pos : Position) : number {
    function getGroups(board:Board, pos : Position, groups:Position[]) : Position[] {
        if (board.get(pos.col)?.get(pos.row) != Cell.Empty) {
            group = getGroup(board, pos);
        } 
    }
}

function clearCaptured(board:Board, lastMove : Position) : board {

}

function updateBoard(board:Board , pos:Position, player : Player) : Error | Board {
    const {row,col} = pos;
    if ((row < 0 || row > board.size) || (col < 0 || col > board.size)) {
        return Error("Out of Bounds");
    }
    const rawNewBoard = board.set(row, board.get(row)!!.set(col, player));
    const newBoard = clearCaptured(rawNewBoard , pos);
    
    if (countLiberties(newBoard, pos) == 0) {
        return Error("Cannot place piece in captured teritory");
    }
}

export {getEmptyBoard, updateBoard};
export type { Board, BoardCell};
