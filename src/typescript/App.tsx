import userEvent from '@testing-library/user-event';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import BoardView from './BoardView';
import './interfaces/Database'
import {Game} from './GameComp';
import {Board, getEmptyBoard, updateBoard} from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import SignIn from './SignButton';
import User from './User';
import { useAuthState } from './interfaces/Auth';
import Button from './Button';
import ModalComp from './ModalComp';
import { useCollectionData } from './interfaces/Database';

interface Props {
  getCurrentUser : () => User | null;
}
function App({getCurrentUser} : Props) {
  const user = getCurrentUser();
  const users = useCollectionData<User>("users");
  const games = useCollectionData<Game>("games");
  useAuthState();
  
  if (users==undefined || games == undefined) {
    return <div>loading...</div>
  }

  console.log(users,games);

  const idToUser = (id:string) => {
    return users.find((user) => user.uid == id);
  }

  const createGameModal = () => {

  };

  return (
    <div className='flex justify-around bg-sky-100 h-screen'>
      {
        user &&
      <div className='flex flex-col items-center'>
        <div>
          <h1>Your Games</h1>
          <div>
            {
              games.filter((game) => game.whiteID == user.uid || game.blackID == user.uid).map((game) => {
                console.log(games);
                return (
                  <div className="flex">
                    <div>{`${idToUser(game.blackID)?.displayName} vs. ${idToUser(game.whiteID)?.displayName}`}</div>
                    <button onClick={() => {redirect(`game/${game.id}`)}}>Play</button>
                  </div>
                )
              })
            }
          </div>
          {/*<Button onClick={createGameModal}> Create Game </Button>*/}
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
  );
}

export default App;
