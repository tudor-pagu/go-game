import React, { cloneElement, useState } from 'react'
import { BoardCell } from './GameLogic'
import "../boardcell.css"
import Player from './Player'
import Cell from './PlayerEnum'
import Position from './Position'
import { getPositionOfLineAndCharacter } from 'typescript'

type Props = {
  cell: BoardCell,
  positionX: "Left" | "Middle" | "Right",
  positionY: "Top" | "Middle" | "Bottom",
  currentPlayer: Player,
  position: Position,
  playerMove: (p: Position) => void,
}

const BoardCellView = (props: Props) => {
  const [isTransparent, setIsTransparent] = useState(false);
  return (
    <div className={(props.positionX!='Middle' ? "flex":"")}>
      {
        props.positionY == "Top" &&
        <div className='number-board'>
          {
            props.position.col
          }
        </div>
      }

    {
        props.positionX == "Left" &&
        <div className='number-board'>
          {
            props.position.col
          }
        </div>
      }

      <div onClick={() => { if (props.cell == Cell.Empty) { props.playerMove(props.position) } }} className={'board-cell ' + props.positionX + " " + props.positionY} onMouseEnter={() => { setIsTransparent(true) }} onMouseLeave={() => { setIsTransparent(false) }}>

        {
          props.positionX != "Left" &&
          <div className='cross-hori-left'>

          </div>
        }


        {
          props.positionX != "Right" &&
          <div className='cross-hori-right'>

          </div>
        }

        {
          props.positionY != "Top" &&
          <div className='cross-vert-top'>

          </div>
        }

        {
          props.positionY != "Bottom" &&
          <div className='cross-vert-bottom'>

          </div>
        }

        <div className="middle-dot">

        </div>

        {
          props.cell != Cell.Empty ?
            <div className={'piece ' + (props.cell == Cell.White ? "white " : "black ")}>

            </div>
            : (
              isTransparent &&
              <div className={'piece ' + (props.currentPlayer == Cell.White ? "white " : "black ") + (isTransparent ? "transparent" : "")}>

              </div>
            )
        }
      </div>

      {
        props.positionY == "Bottom" &&
        <div className='number-board'>
          {
            props.position.col
          }
        </div>
      }

{
        props.positionX == "Right" &&
        <div className='number-board'>
          {
            props.position.col
          }
        </div>
      }
    </div>
  )
}

export default BoardCellView;