import userEvent from '@testing-library/user-event';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import { NavigateFunction, redirect, useNavigate } from 'react-router-dom';
import BoardView from './BoardView';
import './interfaces/Database'
import { Game } from './Game';
import { Board, getEmptyBoard, updateBoard } from "./GameLogic"
import Player from './Player';
import Cell from './PlayerEnum';
import Position from './Position';
import SignIn from './SignButton';
import User from './User';
import CreateGameButton from './CreateGameButton';
import FireAuth from './services/FirebaseAuth';
import Firestore from './services/Firestore';
import { Box, Button, Center, Divider, Flex, Heading, Stack, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import styles from '../css/App.module.css';

function App() {
  const games = Firestore.useActiveGames();
  const user = FireAuth.useCurrentUser();

  if (games === null) {
    return <div>loading...</div>
  }

  return (
    <div>
      <Center >{
        user != null ?
          <Flex direction="column" gap="2" className={styles.mainContainer}>
            <YourGames activeGames={games} user={user} />
            <YourChallenges activeGames={games} user={user} />
            <FindGames activeGames={games} user={user} />
            <SpectateGames activeGames={games} user={user} />
          </Flex>
          : <div>log in first</div>
      }
      </Center>

    </div>
  );
}

const SectionHeading = (props: React.PropsWithChildren<{}>) => {
  return (
    <Heading textAlign="center" size={['md', 'md', 'lg']}>
      {
        props.children
      }
    </Heading>
  )
}

const EmptyMessage = (props: React.PropsWithChildren<{}>) => {
  return (<Box textAlign="center">{
    props.children
  }
  </Box>)
}

const MyGameListing = (props: { game: Game }) => {
  return (<div>
    {
      props.game.name
    }
  </div>)
}

const YourGames = (props: { activeGames: List<Game>, user: User }) => {
  const myChallenges = props.activeGames.filter((game) => {
    return (game.isAccepted === true && game.isFinished === false) && (game.black != null && game.white != null) && (game.black.uid === props.user.uid || game.white.uid === props.user.uid);
  })

  //console.log(props.activeGames.get(0));

  const navigate = useNavigate();
  const playButton = (game:Game) => {
    return <Button onClick={() =>{spectateGame(navigate, game)}} colorScheme='green' size={['xs', 'sm', 'md']}>Play</Button>
  }
  return (
    <div className='flex flex-col items-center'>
      <SectionHeading>
        Your Games
      </SectionHeading>
      <Divider></Divider>
      <div>
        {
          myChallenges.size > 0 
            ? <GamesList games={myChallenges} renderActionButton={playButton}/>
            : <EmptyMessage>You are not in any games!</EmptyMessage>
        }
      </div>
        <div className='h-2'></div>
      <CreateGameButton />
    </div>
  )
}

const GamesList = (props: { games: List<Game>, renderActionButton: (game: Game) => React.ReactNode }) => {
  return (
    <TableContainer>
      <Table variant='simple' size={['xs', 'md', 'lg']}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Black</Th>
            <Th>White</Th>
            <Th>size</Th>
          </Tr>
        </Thead>
        <Tbody>
          {
            props.games.map((game) => {
              return (
                  <Tr key={game.id}>
                    <Td>{game.name}</Td>
                    <Td>{game.black?.displayName ?? "-"}</Td>
                    <Td>{game.white?.displayName ?? "-"}</Td>
                    <Td>{`${game.boardSize}x${game.boardSize}`}</Td>
                    <Td>{props.renderActionButton(game)}</Td>
                  </Tr>

              )
            })
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
}
const YourChallenges = (props: { activeGames: List<Game>, user: User }) => {
  const myActiveGames = props.activeGames.filter((game) => {
    return (game.isAccepted === false) && (game.black?.uid === props.user.uid || game.white?.uid === props.user.uid);
  })
  const navigate=useNavigate();
  const acceptButton = (game: Game) => {
    if ((game.black?.uid === props.user.uid) || (game.white?.uid === props.user.uid)) {
      return <Button size={['xs', 'sm', 'md']} colorScheme='red' onClick={() => { Firestore.deleteGame(game.id) }}>Delete</Button>
    }
    return (
      <Button size={['xs', 'sm', 'md']} onClick={() => {acceptGame(game, props.user).then(()=>{spectateGame(navigate,game)})}} colorScheme='green'>Accept</Button>
    )
  }
  return (
    <div className='flex flex-col items-center'>
      <SectionHeading>
        Your challenges
      </SectionHeading>
      <Divider></Divider>
      <div>
        {
          myActiveGames.size > 0 ?
            <GamesList games={myActiveGames} renderActionButton={acceptButton} />
            : <EmptyMessage>You are not in any games!</EmptyMessage>
        }
      </div>
    </div>
  )
}

const FindGames = (props: { activeGames: List<Game>, user: User }) => {
  const otherChallenges = props.activeGames.filter((game) => {
    return (game.isAccepted === false) && (!(game.black != null && game.white != null)) && (game.black?.uid !== props.user.uid && game.white?.uid !== props.user.uid);
  });

  const navigate = useNavigate();

  const acceptButton = (game: Game) => {
    return <Button size={['xs', 'sm', 'md']} colorScheme='green' onClick={() => {acceptGame(game, props.user).then(()=>{spectateGame(navigate,game)})}}>Accept</Button>
  }

  return (
    <div className='flex flex-col items-center'>
      <SectionHeading>
        Find Games
      </SectionHeading>
      <Divider></Divider>
      <div>
        {
          otherChallenges.size > 0 ?
            <GamesList games={otherChallenges} renderActionButton={acceptButton} />
            : <div>There are no other challenges</div>
        }
      </div>
    </div>
  )
}

const SpectateGames = (props: { activeGames: List<Game>, user: User }) => {
  const navigate = useNavigate();

  const games = props.activeGames.filter((game) => {
    return game.isAccepted === true && game.isFinished === false && (!(game.black?.uid === props.user.uid || game.white?.uid === props.user.uid))
  });
  const spectateButton = (game: Game) => {
    return <Button size={['xs', 'sm', 'md']} colorScheme='gray' onClick={()=>{spectateGame(navigate, game)}}>
      Spectate
    </Button>
  }
  return (
    <div>
      <SectionHeading>
        Spectate Games
      </SectionHeading>
      <Divider></Divider>
      <div className='flex flex-col items-center'>
        {
          games.size > 0
            ? <GamesList games={games} renderActionButton={spectateButton} />
            : <div>There are no games to spectate</div>
        }
      </div>
    </div>
  )
}

///user - user wants to accept a certain game
function acceptGame(game:Game, user:User) : Promise<void>{
  if (game.isAccepted===false && (game.black === null || game.white===null)) {
    const key = (game.black===null) ? "black" : "white";
    const newGame = game.set(key , user).set("isAccepted", true);
    return Firestore.setGame(game.id, newGame);
  }
  return Promise.reject("Game not valid");
}

function spectateGame(navigate:NavigateFunction, game:Game) {
  navigate(`game/${game.id}`);
}

export default App;
