import userEvent from '@testing-library/user-event';
import { List } from 'immutable';
import React, { useEffect, useState } from 'react';
import { redirect } from 'react-router-dom';
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
            <FindGames activeGames={games} user={user}/>
            <SpectateGames />
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
    return (game.black != null && game.white != null) && (game.black.uid === props.user.uid || game.white.uid === props.user.uid);
  })
  return (
    <div className='flex flex-col items-center'>
      <SectionHeading>
        Your Games
      </SectionHeading>
      <Divider></Divider>
      <div>
        {
          myChallenges.size > 0 ?
            myChallenges.map((game) => {
              return <MyGameListing game={game} />
            }).toArray()
            : <EmptyMessage>You are not in any games!</EmptyMessage>
        }
      </div>

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
                <>
                  <Tr>
                    <Td>{game.name}</Td>
                    <Td>{game.black?.displayName ?? "-"}</Td>
                    <Td>{game.white?.displayName ?? "-"}</Td>
                    <Td>{`${game.boardSize}x${game.boardSize}`}</Td>
                    <Td>{props.renderActionButton(game)}</Td>
                  </Tr>
                </>

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
    return (!(game.black != null && game.white != null)) && (game.black?.uid === props.user.uid || game.white?.uid === props.user.uid);
  })

  const acceptButton = (game: Game) => {
    if ((game.black?.uid === props.user.uid) || (game.white?.uid === props.user.uid)) {
      return <Button size={['xs', 'sm', 'md']} colorScheme='red' onClick={() => { Firestore.deleteGame(game.id) }}>Delete</Button>
    }
    return (
      <Button size={['xs', 'sm', 'md']} colorScheme='green'>Accept</Button>
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
    return (!(game.black != null && game.white != null)) && (game.black?.uid !== props.user.uid && game.white?.uid !== props.user.uid);
  });

  const acceptButton = (game: Game) => {
    return <Button size={['xs', 'sm', 'md']} colorScheme='green' onClick={() => {}}>Accept</Button>

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

const SpectateGames = () => {
  return (
    <div>
      <SectionHeading>
        Your Games
      </SectionHeading>
      <Divider></Divider>
    </div>
  )
}

export default App;
