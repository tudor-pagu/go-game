import User from "../User"

interface Auth {
    signInWithGoogle : () => void,
    signInAsGuest : (displayName:string) => void,
    signOut : () => void,
    /**
     * Makes the component refresh whenever the user changes
     * @returns 
     */
    useCurrentUser : () => null | User;
}

export default Auth;