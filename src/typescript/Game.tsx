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
    black:User,
    white:User,
}
const defaultUser:User = {
    uid:"1",
    displayName:"joe",
    photoURL:"123",
}
const GameRecord = Record<GameProps>({
    name:"default name",
    boardSize : 13,
    board : getEmptyBoard(13),
    boardHistory : List<Board>(),
    currentPlayer : Cell.White,
    id:"1234",
    black:defaultUser,
    white:defaultUser,
});

type Game = RecordOf<GameProps>;

export type {Game, GameProps};
export { GameRecord };