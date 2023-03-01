import Immutable, { List, Range } from "immutable"

enum BoardCell {
    Black,
    White,
    Empty
}

interface Board {
    board: List<List<BoardCell>>,
}

function getEmptyBoard(boardSize: number): Board {
    return {
        board: List(Range(0, boardSize).map(row => List(Range(0, boardSize).map(col => {
            return BoardCell.Empty;
        }))))
    };
}

export {getEmptyBoard, BoardCell};
export type { Board };
