import Immutable, { List, Record, RecordOf } from 'immutable';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import BoardView from './BoardView';
import './interfaces/Database'
import { Board, BoardCell, getEmptyBoard, updateBoard } from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import * as Database from "./interfaces/Database";
import { updateJsxFragment } from 'typescript';
import Firestore from './services/Firestore';
import { GameRecord } from './Game';
import FireAuth from './services/FirebaseAuth';

function GameComp() {
    const { gameID } = useLoaderData() as { gameID: string };

    // Database.add_to_collection("games",GameRecord().id,gameToData(GameRecord()));

    const user = FireAuth.useCurrentUser();
    const game = Firestore.useGame(gameID);

    if (game === null || user === null) {
        return <div>loading...</div>
    }

    const playerMove = (p: Position) => {
        const newBoard = updateBoard(game.board, p, game.currentPlayer, game.boardHistory);
        if (newBoard instanceof Error) {
            window.alert(newBoard.message);
        } else {
            const newGame = game
                .set("board", newBoard)
                .set("boardHistory", game.boardHistory.push(game.board))
                .set("currentPlayer", (game.currentPlayer == Cell.White) ? Cell.Black : Cell.White)
            /* const newGame = GameRecord({
                 board:newBoard,
                 boardHistory: game.boardHistory.push(game.board),
                 currentPlayer:(game.currentPlayer == Cell.White) ? Cell.Black : Cell.White,
             })*/
            Firestore.setGame(gameID, newGame);
        }
    }

    return (

        <div className="App">
            <BoardView userPlayer={game.black?.uid === user?.uid ? Cell.Black : Cell.White} playerMove={playerMove} board={game.board} currentPlayer={game.currentPlayer} />
        </div>
    );
}

function loader({ params }: any) {
    const gameID = params.gameID;
    return { gameID };
}
export { loader };

export default GameComp;
