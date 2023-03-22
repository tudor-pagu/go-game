import { Button, Modal, ModalHeader, ModalOverlay, useDisclosure, ModalContent, ModalCloseButton, ModalBody, Flex, Input, Text, Image } from '@chakra-ui/react';
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
        <Button colorScheme='blue' variant='ghost' size='md' onClick={onOpen}>Sign in</Button>

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
    const user = FireAuth.useCurrentUser();
    return (
        <div >
            <div className='flex justify-between gap-3 items-center shadow-sm z-10 relative pl-4'>
                <Text fontSize="1rem" fontWeight="bold">
                    Tudor Go
                </Text>
                <div className='flex items-center'>
                    <div className='font-bold text-md'>
                        {
                            user &&
                            user.displayName
                        }
                    </div>
                    <div>
                        {
                            user && 
                            <Image src={user.photoURL ?? undefined}></Image>
                        }
                    </div>
                    {
                        user ?
                            <Button size="sm" variant="ghost" colorScheme='blue' onClick={FireAuth.signOut}>Sign Out</Button> :
                            <SignInModal />
                    }
                </div>
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Header;