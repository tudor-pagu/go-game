import { List, Record, RecordOf } from "immutable";
import { Board, getEmptyBoard } from "./GameLogic";
import Player from "./Player";
import Cell from "./PlayerEnum";
import User from "./User";

interface GameProps {
    name:string,
    boardSize:number,
    board:Board,
    boardHistory:List<Board>,
    currentPlayer:Player,
    id:string,
    black:User|null,
    white:User|null,
    isAccepted : boolean,
    isFinished : boolean,
    captures : [number,number], /// captures[0] will just be black captures, captures[1] for white
    winner:null|"black"|"white",
}

const GameRecord = Record<GameProps>({
    name:"default name",
    boardSize : 13,
    board : getEmptyBoard(13),
    boardHistory : List<Board>(),
    currentPlayer : Cell.White,
    id:"1234",
    black:null,
    white:null,
    isAccepted:false,
    isFinished:false,
    captures : [0,0],
    winner:null,
});

type Game = RecordOf<GameProps>;

export type {Game, GameProps};
export { GameRecord };