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

  const styleGrid = {
    gridTemplateColumns:`grid-template-columns: repeat(${props.board.size}, minmax(0, 1fr));`,
  };

  return (
    <div className='flex'>
      <div className='big-go-board' style={styleGrid}>
      {
        Range(0,boardSize).map((row) => (<>{ 
          Range(0, boardSize).map((col) => {
            return (
              <BoardCellView playerMove={props.playerMove} position={{row, col}} currentPlayer={props.currentPlayer} positionY={getPositionY(row)} positionX={getPositionX(col)} cell={board.get(row)?.get(col) ?? Cell.Empty}/>
            )
        }).toArray()}</>)).toArray()
      }
      </div>
    </div>
  )
}

export default BoardView;