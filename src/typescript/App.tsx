import React, { useState } from 'react';
import BoardView from './BoardView';
import './Database'
import { add_to_collection } from './Database';
import {getEmptyBoard} from "./GameLogic"

function App() {
  const [boardSize, setBoardSize] = useState(13);  
  const [board, setBoard] = useState(getEmptyBoard(boardSize));

  return (
    
    <div className="App">
      <BoardView board={board} />
    </div>
  );
}

export default App;
