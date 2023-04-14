import { collection, connectFirestoreEmulator, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc } from "firebase/firestore";
import { List } from "immutable";
import { useEffect, useState } from "react";
import { Game, GameRecord } from "../Game";
import { Board, BoardCell } from "../GameLogic";
import Database from "../interfaces/Database";
import Cell from "../PlayerEnum";
import User from "../User";
import {db} from "./FirebaseApp";

function gameToFirestore(game:Game) : any {
    return {
        json : JSON.stringify(game.toJS()),
    }
    //return {boardSize,board:JSON.stringify(board.toJS()),boardHistory:JSON.stringify(boardHistory.toJS())   ,currentPlayer,uid:"123"}
}

function firestoreToGame(gameJSON:any) : Game {
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
        black:game.black,
        white:game.white,
        isAccepted:game.isAccepted,
        isFinished:game.isFinished,
        captures:[game.captures[0], game.captures[1]],
        winner:null,
    });
}

function firestoreToUser(firestoreUser:any) : User {
    return {
        uid : firestoreUser.uid,
        displayName : firestoreUser.displalyName,
        photoURL : firestoreUser.photoURL,
    }
}

function useGame(gameId: string): Game | null {
    const [game, setGame] = useState<null|Game>(null);
    useEffect(() => {
        const unsub = onSnapshot(doc(db, "games", gameId), (doc) => {
            setGame(firestoreToGame(doc.data()));
        });

        return () => {
            unsub();
        }
    }, []);
    return game;
}

function setGame (gameId:string, newGame:Game) {
    return setDoc(doc(db,"games",gameId), gameToFirestore(newGame)); 
}

function deleteGame(gameId:string):Promise<void> {
    return deleteDoc(doc(db,'games',gameId));
}

function useActiveGames():List<Game>|null {
    const [activeGame, setActiveGames] = useState<null|List<Game>>(null);
    useEffect(()=> {
        onSnapshot(query(collection(db,"games")), (res) => {
            setActiveGames(List(res.docs.map((doc)=>firestoreToGame(doc.data()))));
        })
    }, [])
    return activeGame;
}

function useUser(userId:string):User|null {
    const [user,setUser] = useState<User|null>(null);
    useEffect(() => {
        getDoc(doc(db,"users",userId)).then((res) => {
            return firestoreToUser(res.data());
        });
    }, []);
    return user;
}

function setUser(user:User) : Promise<void> {
    return setDoc(doc(db,"users",user.uid), user);
}


const Firestore : Database = {
    useGame,
    setGame,
    deleteGame,
    useActiveGames,
    useUser,
    setUser: setUser
}

export default Firestore;