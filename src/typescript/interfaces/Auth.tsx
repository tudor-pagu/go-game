import User from "../User"

interface Auth {
    signInWithGoogle : () => void,
    signInAsGuest : (displayName:string) => void,
    signOut : () => void,
    getCurrentUser : () => User | null,
    /**
     * Makes the component refresh whenever the user changes
     * @returns 
     */
    useAuthState : () => void;
}

export default Auth;