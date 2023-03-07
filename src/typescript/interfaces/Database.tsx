import User from '../User';
import { dataToGame, Game, gameToData } from '../GameComp';
import { List } from 'immutable';
import { setDocument, getCollection, useDatabaseState, useCollectionData  } from '../services/Firebase';

async function getUsers() : Promise<List<User>> {
    const x = await getCollection("users");
    return List<User>(x);
}
async function getGames() : Promise<List<Game>> {
    const x = await getCollection("games");
    return List<Game>(x.map((game) => dataToGame(game)));
}


export {
    getCollection,
    setDocument,
    useDatabaseState,
    getUsers,
    getGames,
    useCollectionData,
}