import React, { useState } from 'react';
import BoardView from './BoardView';
import './Database'
import { add_to_collection } from './Database';
import {getEmptyBoard, updateBoard} from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';

function App() {
  const [boardSize, setBoardSize] = useState(13);  
  const [board, setBoard] = useState(getEmptyBoard(boardSize));

  const [currentPlayer, setCurrentPlayer] = useState<Player>(Cell.Black);
  
  const playerMove = (p : Position) => {
    const newBoard = updateBoard(board, p, currentPlayer);
    if (newBoard instanceof Error) {
        window.alert(newBoard.message);
    } else {
      setBoard(newBoard);
      setCurrentPlayer((currentPlayer == Cell.White) ? Cell.Black : Cell.White);
    }
  }

  return (
  
    <div className="App">
      <BoardView playerMove={playerMove} board={board} currentPlayer={currentPlayer}/>
    </div>
  );
}

export default App;
