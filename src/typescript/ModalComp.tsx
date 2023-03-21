import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, Text, useDisclosure } from '@chakra-ui/react';
import React, { useState } from 'react'
import {v4 as uuid} from "uuid";
import { Board, getEmptyBoard } from './GameLogic';
import { List } from 'immutable';
import Cell from './PlayerEnum';
import Player from './Player';
import Firestore from './services/Firestore';
import { GameRecord } from './Game';
import FireAuth from './services/FirebaseAuth';

type Props = {
    currentUserID : string,
}

function random(a:number,b:number) : number {
    return Math.floor(Math.random() * (b-a+1)) + a;
}
const ModalComp = (props: Props) => {
    const defaultValues = {
        boardSize : "13",
        gameName: "",
        color : "random",
    }
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [boardSize, setBoardSize] = useState(defaultValues.boardSize);
    const [gameName, setGameName] = useState(defaultValues.gameName);
    const [color, setColor] = useState(defaultValues.color);
    
    const user = FireAuth.getCurrentUser();
    FireAuth.useAuthState();

    const submitForm : React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        setBoardSize(defaultValues.boardSize);
        setGameName(defaultValues.gameName);
        setColor(defaultValues.color);
        onClose();

        const currentPlayer:Player = (color=="white") ? Cell.White : ((color=="black") ? Cell.Black : (random(0,1) == 0 ? Cell.White : Cell.Black))
        const [black,white] = (currentPlayer == Cell.White) ? [null,user] : [user,null];
        const game = GameRecord({
            name : gameName,
            boardSize : Number(boardSize),
            board : getEmptyBoard(Number(boardSize)),
            boardHistory : List<Board>(),
            currentPlayer : currentPlayer,
            id:uuid(),
            black:black,
            white:white,
        })
        Firestore.setGame(game.id,game);
    };

    return (
        <div>
            <Button colorScheme="blue" onClick={onOpen}>Create game</Button>
            <Modal isOpen={isOpen} onClose={onClose}>
                <form onSubmit={submitForm}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Game settings</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text textAlign={"center"}>Game name</Text>
                            <Input placeholder={"Game Name"} value={gameName} onChange={(event) => { setGameName(event.target.value) }} required></Input>
                            <RadioGroup onChange={setBoardSize} value={boardSize}>
                                <Stack direction='row' justifyContent={"space-around"}>
                                    <Radio value="9">9x9</Radio>
                                    <Radio value="13">13x13</Radio>
                                    <Radio value="19">19x19</Radio>
                                </Stack>
                            </RadioGroup>

                            <Text textAlign={"center"}>Your Color</Text>
                            <RadioGroup onChange={setColor} value={color}>
                                <Stack direction='row' justifyContent={"space-around"}>
                                    <Radio value="black">Black</Radio>
                                    <Radio value="white">White</Radio>
                                    <Radio value="random">Random</Radio>
                                </Stack>
                            </RadioGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button type={'submit'} colorScheme="blue" mr={3}>Create Game</Button>
                            <Button variant="ghost">Close</Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </div>
    )
}
export default ModalComp;