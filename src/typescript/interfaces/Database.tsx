import { List } from "immutable";
import { Game } from "../Game";
import User from "../User";

interface Database {
    /**
     * returns the board state of a certain id,
     * and updates the value and causes a re-render
     * anytime the board is updated server-side
     * @param boardId 
     * @returns 
     */
    useGame: (gameId:string) => Game | null,
    setGame : (gameId:string, newGame:Game) => Promise<void>,
    deleteGame:(gameId:string) => Promise<void>
    /**
     * Returns all currently active games
     * @returns 
     */
    useActiveGames:()=>List<Game>|null,
    useUser:(userId:string)=>User|null,
    setUser:(user:User)=>Promise<void>,
}

export default Database;