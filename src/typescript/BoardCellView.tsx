import React, { cloneElement, useState } from 'react'
import { BoardCell } from './GameLogic'
import "../boardcell.css"
import Player from './Player'
import Cell from './PlayerEnum'
import Position from './Position'
import { getPositionOfLineAndCharacter } from 'typescript'
import User from './User'

type Props = {
  cell: BoardCell,
  positionX: "Left" | "Middle" | "Right",
  positionY: "Top" | "Middle" | "Bottom",
  currentPlayer: Player,
  position: Position,
  boardSize:number,
  isHandicap:boolean,
  playerMove: (p: Position) => void,
  userPlayer : Player,
}

const BoardCellView = (props: Props) => {
  const [isTransparent, setIsTransparent] = useState(false);
  const isActive = props.cell === Cell.Empty && props.userPlayer === props.currentPlayer;
  return (
    <div className={(props.positionX!='Middle' ? "board-cell-edge":"") + " board-cell-main " + props.positionX + " " + props.positionY}>
      {
        props.positionY == "Top" &&
        <div className={'number-board number-top ' + props.positionX}>
          {
            String.fromCharCode("A".charCodeAt(0) + props.position.col)
          }
        </div>
      }

    {
        props.positionX == "Left" &&
        <div className='number-board number-left'>
          {
            props.boardSize - props.position.row
          }
        </div>
        }

      <div onClick={() => { if (isActive) { props.playerMove(props.position) } }} className={'board-cell ' + props.positionX + " " + props.positionY} onMouseEnter={() => { setIsTransparent(true) }} onMouseLeave={() => { setIsTransparent(false) }}>

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
          props.isHandicap && 
          <div className='handicap-dot'>

          </div>
        }

        {
          props.cell != Cell.Empty ?
            <div className={'piece ' + (props.cell == Cell.White ? "white " : "black ")}>

            </div>
            : (
              (isTransparent && isActive) &&
              <div className={'piece ' + (props.currentPlayer == Cell.White ? "white " : "black ") + (isTransparent ? "transparent" : "")}>

              </div>
            )
        }
      </div>

      {
        props.positionY == "Bottom" &&
        <div className={'number-board number-bottom ' + props.positionX}>
          {
            String.fromCharCode("A".charCodeAt(0) + props.position.col)
          }
        </div>
      }

{
       props.positionX == "Right" &&
        <div className={'number-board number-right '+props.positionY}>
          {
            props.boardSize - props.position.row
          }
        </div>
      }
    </div>
  )
}

export default BoardCellView;