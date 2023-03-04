import { Range } from 'immutable';
import React from 'react'
import BoardCellView from './BoardCellView';
import { Board, BoardCell } from './GameLogic'
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import "../boardcell.css";

type Props = {
    board : Board,
    currentPlayer : Player,
    playerMove : (p:Position) => void,
}


function BoardView(props: Props) {
  const board = props.board;
  const boardSize = board.size;

  function getPositionY(row : number) {
    if (row == 0) return "Top";
    if (row == boardSize - 1) return "Bottom";
    return "Middle";
  }

  function getPositionX(col : number) {
    if (col == 0) return "Left";
    if (col == boardSize - 1) return "Right";
    return "Middle";
  }

  return (
    <div className='flex'>
      <div className='flex flex-col big-go-board'>
      {
        Range(0,boardSize).map((row) => (<div className="flex w-full">{ 
          Range(0, boardSize).map((col) => {
            return (
              <BoardCellView playerMove={props.playerMove} position={{row, col}} currentPlayer={props.currentPlayer} positionY={getPositionY(row)} positionX={getPositionX(col)} cell={board.get(row)?.get(col) ?? Cell.Empty}/>
            )
        }).toArray()}</div>)).toArray()
      }
      </div>
    </div>
  )
}

export default BoardView;