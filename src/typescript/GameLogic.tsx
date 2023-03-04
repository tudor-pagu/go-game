import Immutable, { List, Range } from "immutable"
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
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

///Get a list with all the pieces in group of position pos
function getGroup(board:Board, pos : Position) : List<Position> {
    const value = board.get(pos.row)?.get(pos.col) ?? Cell.Empty;

    if (value == Cell.Empty) {
        return List();
    }

    const dx = [0,0,-1,1];
    const dy = [1,-1,0,0];
    return Range(0,4).map(k => {
        const new_row = pos.row + dy[k];
        const new_col = pos.col + dx[k];
        if (inBounds(new_row,new_col,board.size) && board.get(new_row)?.get(new_col) === value) {
            return getGroup(board.set(pos.row, board.get(pos.row)!!.set(pos.col, Cell.Empty)), {row:new_row, col:new_col});
        } else {
            return List<Position>();
        }
    }).toList().flatMap(list => list).push(pos);
}

function countLiberties(board : Board, pos : Position) : number {
    function cell_adjacent(pos1:Position, pos2:Position) {
        return ((pos1.row == pos2.row) && Math.abs(pos1.col - pos2.col) == 1) ||    
                ((pos1.col == pos2.col) && Math.abs(pos1.row - pos2.row) == 1)
    }

    function adjacent(pos: Position, group : List<Position>) : boolean {
        return group.filter((groupPos) => cell_adjacent(pos, groupPos)).size > 0;
    }

    const group = getGroup(board, pos);
    return Range(0,board.size).reduce((sum:number,row:number) => {
        return sum + Range(0,board.size).reduce((sum2:number, col:number) => {
            if ((board.get(row)?.get(col) == Cell.Empty) && adjacent({row,col}, group)) {
                return sum2 + 1;
            } else {
                return sum2;
            }
        }, 0);
    },0)
}


function removeGroup(board: Board, group: List<Position>) {
    return board.map((v,row) => v.map((val,col) => (group.findIndex((p) => (p.row == row && p.col == col)) >= 0) ? Cell.Empty : val));
}

function clearCaptured(board:Board, lastMove : Position, pos:Position|null = {row:0, col:0}) : Board {
    
    if (pos === null) {
        return board;
    }
    function getNextPos(pos:Position) {
        if (pos.row == board.size - 1 && pos.col == board.size - 1) {
            return null;
        }
        if (pos.col == board.size - 1) {
            return {row : pos.row + 1 , col : 0};
        }

        return {row : pos.row , col : pos.col + 1};
    };

    const nextPos = getNextPos(pos);
    
    if ((board.get(pos.row)?.get(pos.col) ?? Cell.Empty) === Cell.Empty) {
        return clearCaptured(board, lastMove, nextPos);
    }

    const liberties = countLiberties(board, pos);
    const group = getGroup(board, pos);

    const newBoard = (liberties == 0 && (!(group.findIndex(p=>p.row==lastMove.row && p.col==lastMove.col)>=0))) ? removeGroup(board, group) : board;

    return clearCaptured(newBoard, lastMove, nextPos);
}

function updateBoard(board:Board , pos:Position, player : Player, boardHistory:List<Board>) : Error | Board {
    const {row,col} = pos;
    if ((row < 0 || row > board.size) || (col < 0 || col > board.size)) {
        return Error("Out of Bounds");
    }
    const rawNewBoard = board.set(row, board.get(row)!!.set(col, player));
    const newBoard = clearCaptured(rawNewBoard , pos);
    
    if (countLiberties(newBoard, pos) == 0) {
        return Error("Cannot place piece in captured teritory");
    }

    if (boardHistory.size > 0 && Immutable.is(newBoard, boardHistory.get(-1))) {
        return Error("cannot immediately recapture piece");
    }

    return newBoard;
}

export {getEmptyBoard, updateBoard};
export type { Board, BoardCell};
