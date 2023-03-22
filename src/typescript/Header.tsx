import { Button, Modal, ModalHeader, ModalOverlay, useDisclosure, ModalContent, ModalCloseButton, ModalBody, Flex, Input } from '@chakra-ui/react';
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';
import FireAuth from './services/FirebaseAuth';
import SignButton from './SignButton';
import SignIn from './SignButton';

type Props = {

}

const SignInModal = () => {
    const [displayName, setDisplayName] = useState("");
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (<div>
        <Button colorScheme='blue' onClick={onOpen}>Sign in</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Sign in</ModalHeader>
                <ModalCloseButton />

                <ModalBody>
                    <Flex direction="column" gap="6px">
                        <form onSubmit={(e) => { e.preventDefault(); setDisplayName(""); FireAuth.signInAsGuest(displayName); onClose(); }}>
                            <Flex gap="10px" alignItems="center">
                                <Input required placeholder="name" value={displayName} onChange={(e) => { setDisplayName(e.target.value) }}></Input>
                                <Button height="60px"
                                    type="submit" style={{
                                        whiteSpace: "normal",
                                        wordWrap: "break-word",
                                    }}> Sign in as guest </Button>
                            </Flex>
                        </form>
                        <Button onClick={FireAuth.signInWithGoogle}> Sign in with Google </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    </div>)
}

const Header = (props: Props) => {
    const user = FireAuth.getCurrentUser();
    FireAuth.useAuthState();
    return (
        <div>
            <div className='bg-blue-400 flex justify-end gap-3 items-center'>
                <div>
                    {
                        user &&
                        user.displayName
                    }
                </div>
                {
                    user ?
                        <Button onClick={FireAuth.signOut}>Sign Out</Button> :
                        <SignInModal />
                }
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Header;