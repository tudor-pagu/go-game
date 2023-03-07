import React from 'react'
import { Outlet } from 'react-router-dom';
import Button from './Button';
import { getCurrentUser, signIn, signOut, useAuthState } from './interfaces/Auth';
import SignButton from './SignButton';
import SignIn from './SignButton';

type Props = {

}

const Header = (props: Props) => {
    const user = useAuthState();
    const userInfo = getCurrentUser();
    return (
        <div>
            <div className='bg-blue-400 flex justify-end gap-3 items-center'>
                <div>
                    {
                        userInfo &&
                        userInfo.displayName
                    }
                </div>
                {
                    user ?
                        <Button onClick={signOut}>Sign Out</Button> :
                        <Button onClick={signIn}>Sign in</Button>
                }
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Header;