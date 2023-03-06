import React from 'react'
import { Outlet } from 'react-router-dom';
import { getCurrentUser, signIn, SignOut, useAuthStateDb } from './Database';
import SignButton from './SignButton';
import SignIn from './SignButton';

type Props = {

}

const Header = (props: Props) => {
    const user = useAuthStateDb();
    const userInfo = getCurrentUser();
    return (
        <div>
            <div className='bg-blue-400 flex justify-end gap-3'>
                <div>
                    {
                        userInfo &&
                        userInfo.displayName
                    }
                </div>
                {
                    user ?
                        <SignButton action={SignOut} text="Sign Out" /> :
                        <SignButton action={signIn} text="Sign in" />
                }
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Header;