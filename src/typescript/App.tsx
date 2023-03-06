import userEvent from '@testing-library/user-event';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
import BoardView from './BoardView';
import './Database'
import { add_to_collection } from './Database';
import {Game} from './GameComp';
import {Board, getEmptyBoard, updateBoard} from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import SignIn from './SignButton';
import User from './User';

interface Props {
  getCurrentUser : () => User | null;
  getUsers : () => Promise<List<User>>;
  getGames : () => Promise<List<Game>>;
  signIn : () => void;
}
function App({getCurrentUser,getUsers,getGames,signIn} : Props) {
  const [asyncData,setAsyncData] = useState<[User | null, List<User>, List<Game>] | null>(null);
  useEffect(() => {
    Promise.all([getCurrentUser(), getUsers(), getGames()]).then((data) => {
      setAsyncData(data);
    })
  });
  
  if (asyncData==null) {
    return <div>loading...</div>
  }

  const [user, users,games] = asyncData;
  const idToUser = (id:string) => {
    return users.find((user) => user.uid == id);
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
              games.filter((game) => game.whiteID == user.uid || game.blackID == user.uid).map((game) => {
                return (
                  <div className="flex">
                    <div>{`${idToUser(game.blackID)?.displayName} vs. ${idToUser(game.whiteID)?.displayName}`}</div>
                    <button onClick={() => {redirect(`game/${game.id}`)}}>Play</button>
                  </div>
                )
              })
            }
          </div>
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
