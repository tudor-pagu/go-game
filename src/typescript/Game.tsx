import { List } from 'immutable';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import BoardView from './BoardView';
import './Database'
import { add_to_collection } from './Database';
import { Board, getEmptyBoard, updateBoard } from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';

function Game() {
    const {gameID} = useLoaderData() as {gameID:string};

    const [boardSize, setBoardSize] = useState(13);
    const [board, setBoard] = useState(getEmptyBoard(boardSize));
    const [boardHistory, setBoardHistory] = useState(List<Board>());

    const [currentPlayer, setCurrentPlayer] = useState<Player>(Cell.Black);

    const playerMove = (p: Position) => {
        const newBoard = updateBoard(board, p, currentPlayer, boardHistory);
        if (newBoard instanceof Error) {
            window.alert(newBoard.message);
        } else {
            setBoard(newBoard);
            setBoardHistory(boardHistory.push(board));
            setCurrentPlayer((currentPlayer == Cell.White) ? Cell.Black : Cell.White);
        }
    }

    return (

        <div className="App">
            <BoardView playerMove={playerMove} board={board} currentPlayer={currentPlayer} />
        </div>
    );
}

function loader({ params }: any) {
    const gameID = params.gameID;
    return { gameID };
}
export { loader };
export default Game;
