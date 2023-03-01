import { Range } from 'immutable';
import React from 'react'
import BoardCellView from './BoardCellView';
import { Board, BoardCell } from './GameLogic'

type Props = {
    board : Board
}


function BoardView(props: Props) {
  const board = props.board.board;
  const boardSize = board.size;

  return (
    <div className='flex flex-col'>
    {
      Range(0,boardSize).map((row) => (<div className="flex">{ 
        Range(0, boardSize).map((col) => {
          return (
            <BoardCellView cell={board.get(row)?.get(col) ?? BoardCell.Empty}/>
          )
      }).toArray()}</div>)).toArray()
    }
    </div>
  )
}

export default BoardView;