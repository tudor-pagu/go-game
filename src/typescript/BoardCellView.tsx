import React, { cloneElement, useState } from 'react'
import { BoardCell } from './GameLogic'
import "../boardcell.css"
import Player from './Player'
import Cell from './PlayerEnum'
import Position from './Position'
import { getPositionOfLineAndCharacter } from 'typescript'
import User from './User'
import styles from "../css/BoardCell.module.css"

type Props = {
  cell: BoardCell,
  positionX: "Left" | "Middle" | "Right",
  positionY: "Top" | "Middle" | "Bottom",
  currentPlayer: Player,
  position: Position,
  boardSize: number,
  isHandicap: boolean,
  playerMove: (p: Position) => void,
  userPlayer: Player,
}

const BoardCellView = (props: Props) => {
  const [isTransparent, setIsTransparent] = useState(false);
  const isActive = props.cell === Cell.Empty && props.userPlayer === props.currentPlayer;
  return (
      <div className={styles.cell}>
        <div>
          {
            props.positionX != "Left" &&
            <div className={styles.crossHoriLeft}>

            </div>
          }


          {
            props.positionX != "Right" &&
            <div className={styles.crossHoriRight}>

            </div>
          }

          {
            props.positionY != "Top" &&
            <div className={styles.crossVertTop}>

            </div>
          }

          {
            props.positionY != "Bottom" &&
            <div className={styles.crossVertBottom}>

            </div>
          }

          {
            props.isHandicap &&
            <div className={styles.handicapDot}>

            </div>
          }
        </div>
      </div>
  )
}

export default BoardCellView;