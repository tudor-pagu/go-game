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

interface GameProps {
    name:string,
    boardSize:number,
    board:Board,
    boardHistory:List<Board>,
    currentPlayer:Player,
    id:string,
    blackID:string,
    whiteID:string,
}

const GameRecord = Record<GameProps>({
    name:"default name",
    boardSize : 13,
    board : getEmptyBoard(13),
    boardHistory : List<Board>(),
    currentPlayer : Cell.White,
    id:"1234",
    blackID:"",
    whiteID:"",
});

type Game = RecordOf<GameProps>;

interface GameData {
    json : string;
}
function gameToData(game:Game) : GameData {
    return {
        json : JSON.stringify(game.toJS()),
    }
    //return {boardSize,board:JSON.stringify(board.toJS()),boardHistory:JSON.stringify(boardHistory.toJS())   ,currentPlayer,uid:"123"}
}

function dataToGame(gameJSON:GameData) : Game {
    const game = JSON.parse(gameJSON.json);
    function numberToBoardCell(x:any) {
        if (x === 0) {
            return Cell.White;
        } else if (x === 1) {
            return Cell.Black;
        } else {
            return Cell.Empty; 
        }
    }
    function convertToBoard(v:[[number]]):Board {
        return List<List<BoardCell>>(v.map((val:any)=>List<BoardCell>(val.map((x:any)=>numberToBoardCell(x)))));
    }

    return GameRecord({
        name:game.name,
        boardSize: game.boardSize,
        board: convertToBoard(game.board),
        boardHistory:List<Board>(game.boardHistory.map((v:any)=>convertToBoard(v))),
        currentPlayer: (game.currentPlayer == 1) ? Cell.Black : Cell.White,
        id:game.id,
        blackID:game.blackID,
        whiteID:game.whiteID,
    });
}

function GameComp() {
    const { gameID } = useLoaderData() as { gameID: string };
    
   // Database.add_to_collection("games",GameRecord().id,gameToData(GameRecord()));
    

    const [gameJson,setGame] = Database.useDatabaseState<any>("games",gameID);
    if (gameJson === undefined) {
        return <div>loading...</div>
    }

    const game = dataToGame(gameJson);
    
    function update<TProps extends object>(obj:RecordOf<TProps>, key : keyof TProps) {
        const f = (newValue:typeof obj[typeof key]) => {
            return obj.set(key, newValue);
        }
        return f;
    }

    const [board,setBoard] = [game.board,update(game,"board")];
    const [boardHistory,setBoardHistory] = [game.boardHistory,update(game,"boardHistory")];

    const [currentPlayer,setCurrentPlayer] = [game.currentPlayer,update(game,"currentPlayer")];


    const playerMove = (p: Position) => {
        const newBoard = updateBoard(board, p, currentPlayer, boardHistory);
        if (newBoard instanceof Error) {
            window.alert(newBoard.message);
        } else {
            const newGame = GameRecord({
                board:newBoard,
                boardHistory: boardHistory.push(board),
                currentPlayer:(currentPlayer == Cell.White) ? Cell.Black : Cell.White,
            })
            setGame(gameToData(newGame));
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
export { loader, gameToData, dataToGame, GameRecord };
export type {Game};
export default GameComp;
