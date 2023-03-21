import React from 'react'
import { Outlet } from 'react-router-dom';
import Button from './Button';
import FireAuth from './services/FirebaseAuth';
import SignButton from './SignButton';
import SignIn from './SignButton';

type Props = {

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
                        <Button onClick={FireAuth.signIn}>Sign in</Button>
                }
            </div>
            <div>
                <Outlet />
            </div>
        </div>
    )
}

export default Header;