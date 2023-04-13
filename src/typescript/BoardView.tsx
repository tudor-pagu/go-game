import { List, Range } from 'immutable';
import React from 'react'
import BoardCellView from './BoardCellView';
import { Board, BoardCell } from './GameLogic'
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import styles from "../css/BoardCell.module.css"

type Props = {
  board: Board,
  currentPlayer: Player,
  playerMove: (p: Position) => void,
  userPlayer: Player,
}

const handicap9 = List([{ row: 2, col: 2 }, { row: 2, col: 6 }, { row: 4, col: 4 }, { row: 6, col: 2 }, { row: 6, col: 6 }]);
const handicap13 = List([{ row: 3, col: 3 }, { row: 3, col: 9 }, { row: 6, col: 6 }, { row: 9, col: 3 }, { row: 9, col: 9 }]);
const handicap19 = List([3, 9, 15]).flatMap((row) => List([3, 9, 15]).map(col => ({ row, col })));

const handicapPositions = List<List<Position>>().set(9, handicap9).set(13, handicap13).set(19, handicap19);


function BoardView(props: Props) {
  const board = props.board;
  const boardSize = board.size;

  function getPositionY(row: number) {
    if (row == 0) return "Top";
    if (row == boardSize - 1) return "Bottom";
    return "Middle";
  }

  function getPositionX(col: number) {
    if (col == 0) return "Left";
    if (col == boardSize - 1) return "Right";
    return "Middle";
  }

  const styleGrid = {
    gridTemplateColumns: `repeat(${props.board.size + 2}, minmax(0, 1fr))`,
  };

  return (
    <div className={styles.board}>
      
      <div style={styleGrid} className={styles.mainGrid}>
        <div></div>
        <>{
          Range(0, props.board.size).map(col => {
            return <div className={styles.numberBoard}>
              {
                String.fromCharCode('A'.charCodeAt(0) + col)
              }
            </div>
          })
        }
        </>

        <div>
        </div>
        <>
          {
            Range(0, props.board.size).map((row) => {
              return (
                <>
                  <div className={styles.numberBoard}> {
                    props.board.size - row
                  }

                  </div>
                  <>{
                    Range(0, props.board.size).map((col) => {
                      return <BoardCellView key={row * 100 + col} userPlayer={props.userPlayer} boardSize={props.board.size} isHandicap={handicapPositions.has(boardSize) && (handicapPositions.get(boardSize)?.findIndex(p => p.row == row && p.col == col) ?? -1) >= 0} playerMove={props.playerMove} position={{ row, col }} currentPlayer={props.currentPlayer} positionY={getPositionY(row)} positionX={getPositionX(col)} cell={board.get(row)?.get(col) ?? Cell.Empty} />
                    }
                    )}
                  </>

                  <div className={styles.numberBoard}> {
                    props.board.size - row 
                  }

                  </div>
                </>
              )
            })
          }
        </>

        <div></div>
        <>{
          Range(0, props.board.size).map(col => {
            return <div className={styles.numberBoard}>
              {
                String.fromCharCode('A'.charCodeAt(0) + col)
              }
            </div>
          })
        }
        </>

        <div>
        </div>
      </div>
    </div>
  )
}

export default BoardView;