import userEvent from '@testing-library/user-event';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import BoardView from './BoardView';
import './interfaces/Database'
import {Game} from './Game';
import {Board, getEmptyBoard, updateBoard} from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import SignIn from './SignButton';
import User from './User';
import Button from './Button';
import ModalComp from './ModalComp';
import FireAuth from './services/FirebaseAuth';
import Firestore from './services/Firestore';

function App() {
 // const user = FireAuth.getCurrentUser();
  //const games = Firestore.useActiveGames();
/*  FireAuth.useAuthState();
  
  if (games === null) {
    return <div>loading...</div>
  }

  return (
    <div className='flex justify-around bg-sky-100 h-screen'>
      {
        user &&
      <div className='flex flex-col items-center'>
        <div>
          <h1>Your Games</h1>
          <div>
            {
              games.filter((game) => game.white?.uid == user.uid || game.black?.uid == user.uid).map((game) => {
                console.log(games);
                return (
                  <div className="flex">
                    <div>{`${game.black?.displayName} vs. ${game.white?.displayName}`}</div>
                    <button onClick={() => {redirect(`game/${game.id}`)}}>Play</button>
                  </div>
                )
              })
            }
          </div>
          <ModalComp currentUserID={user.uid}/>
          </div>
        <div>
          <h1>Your Challenges</h1>
        </div>
      </div>
      }
      <div className='flex flex-col items-center'>
        <div>
          <h1>Other People's Games</h1>
        </div>
        <div>
          <h1>Other People's Challenges</h1>
        </div>
      </div>
    </div>
  );*/
  return (<></>);
}

export default App;
