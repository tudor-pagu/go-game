import Immutable, { List, Record, RecordOf } from 'immutable';
import React, { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import BoardView from './BoardView';
import './Database'
import { add_to_collection } from './Database';
import { Board, BoardCell, getEmptyBoard, updateBoard } from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import * as Database from "./Database";
import { updateJsxFragment } from 'typescript';

interface Game {
    boardSize:number,
    board:Board,
    boardHistory:List<Board>,
    currentPlayer:Player,
}

function gameToJSON({boardSize,board,boardHistory,currentPlayer}:Game) {
    return {boardSize,board:JSON.stringify(board.toJS()),boardHistory:JSON.stringify(boardHistory.toJS())   ,currentPlayer,uid:"123"}
}
function Game() {
    const { gameID } = useLoaderData() as { gameID: string };
    /*
    
    const [boardSize, setBoardSize] = useState(13);
    const [board, setBoard] = useState(getEmptyBoard(boardSize));
    const [boardHistory, setBoardHistory] = useState(List<Board>());

    const [currentPlayer, setCurrentPlayer] = useState<Player>(Cell.Black);

    Database.add_to_collection("games",{boardSize,board:JSON.stringify(board.toJS()),boardHistory:JSON.stringify(boardHistory.toJS())   ,currentPlayer,uid:"123"});
    */

    const [gameAux,setGame] = Database.useDatabaseState<any>("games",gameID);
    if (gameAux === undefined) {
        return <div>loading...</div>
    }
    function processDatabaseData(gameAux:any):Game {
        function f(x:any) {
            if (x === 0) {
                return Cell.White;
            } else if (x === 1) {
                return Cell.Black;
            } else {
                return Cell.Empty; 
            }
        }
        
        function convertToBoard(v:any):Board {
            return List<List<BoardCell>>(v.map((val:any)=>List<BoardCell>(val.map((x:any)=>f(x)))));
        }
        return {
            boardSize: gameAux.boardSize,
            board: convertToBoard(JSON.parse(gameAux.board)),
            boardHistory:List<Board>(JSON.parse(gameAux.boardHistory).map((v:any)=>convertToBoard(v))),
            currentPlayer: (gameAux.currentPlayer == 1) ? Cell.Black : Cell.White,

        }
    }

    const GameRecord = Record(processDatabaseData(gameAux));
    const game:RecordOf<Game> = GameRecord();
    
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
            setGame(gameToJSON(newGame));
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
