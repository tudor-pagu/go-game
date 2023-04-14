import Immutable, { List, Record, RecordOf } from 'immutable';
import React, { useEffect, useRef, useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import BoardView from './BoardView';
import './interfaces/Database'
import { Board, BoardCell, getEmptyBoard, updateBoard } from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import * as Database from "./interfaces/Database";
import { setConstantValue, updateJsxFragment } from 'typescript';
import Firestore from './services/Firestore';
import { Game, GameRecord } from './Game';
import FireAuth from './services/FirebaseAuth';
import styles from "../css/GameComp.module.css";
import User from './User';
import { Button } from '@chakra-ui/react';

function useDimensions() {
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
        window.addEventListener('resize', () => {
            setHeight(window.innerHeight);
            setWidth(window.innerWidth);
        });
    }, []);
    return [height, width];
}

function GameComp() {

    const ref = useRef<HTMLDivElement | null>(null);
    // const factor = Math.min(height,width)/300;
    const { gameID } = useLoaderData() as { gameID: string };

    // Database.add_to_collection("games",GameRecord().id,gameToData(GameRecord()));

    const handleResize = () => {
        console.log("hi");
        if (ref.current) {

            let viewPortHeight = (window.innerHeight - ref.current.offsetTop);
            if (viewPortHeight >= 480) {
                viewPortHeight *= 0.95;
            }
            const viewPortWidth = window.innerWidth;
            const min = Math.min(viewPortHeight, viewPortWidth);

            const dimension = ((min <= 768) ? min : min * 0.8);
            //ref.current.
            ref.current.style.width = `${dimension}px`;
            ref.current.style.height = `${dimension}px`;
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
        handleResize();
    })


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

    const pass = () => {
        const playerUser = ((game.black?.uid === user.uid) ? Cell.Black : Cell.White);
        if (game.currentPlayer === playerUser) {
            const newGame = game
                .set('boardHistory', game.boardHistory.push(game.board))
                .set("currentPlayer", (game.currentPlayer == Cell.White) ? Cell.Black : Cell.White)
            Firestore.setGame(gameID, newGame);
        } else {
            window.alert("It is not your turn!");
        }
    }
    return (

        <div className={styles.fullContainer}>
            <div className='flex-1 justify-center flex'>
                <div ref={ref} className={styles.goBoard}>
                    <BoardView userPlayer={game.black?.uid === user?.uid ? Cell.Black : Cell.White} playerMove={playerMove} board={game.board} currentPlayer={game.currentPlayer} />
                </div>
            </div>
            <div>
                <ScoreScreen game={game} pass={pass} />
            </div>
        </div>
    );
}


const UserInfo = (props: { captures: number, user: User | null, theme: string }) => {
    return (<div className={props.theme + " " + styles.userInfo}>{
        props.user !== null ?
            <>
                <div className={styles.displayName}>
                    {
                        props.user.displayName
                    }
                </div>
                <div className={styles.captures}>
                    {`Captures : ${props.captures}`}
                </div>
            </> :
            <div> Unkown player </div>

    }
    </div>)
}
const ScoreScreen = (props: { game: Game, pass: () => void }) => {
    return (
        <div className={styles.scoreScreen}>
            <div className='flex flex-col items-center gap-3'>
                <div className='flex gap-2'>
                    <UserInfo captures={0} user={props.game.black} theme={styles.black} />
                    <UserInfo captures={0} user={props.game.white} theme={styles.white} />
                </div>
                <div className={styles.passButton}>
                    <Button size='sm' colorScheme='blue' onClick={props.pass}>Pass</Button>
                </div>
            </div>
        </div>
    )
}

function loader({ params }: any) {
    const gameID = params.gameID;
    return { gameID };
}
export { loader };

export default GameComp;
