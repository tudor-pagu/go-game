import { useState } from "react";

interface DocumentData {
    /** A mapping between a field and its value. */
    [field: string]: any;
}

async function setDocument<T extends DocumentData>(collection:string, id:string, object:T) {
    const oldCollection = JSON.parse(window.localStorage.getItem(collection) ?? "{}");
    oldCollection[id]=object;
    window.localStorage.setItem(collection,JSON.stringify(oldCollection));
}

async function getCollection(collection:string) : Promise<any[]> {
    return Promise.resolve(Array.from(Object.values((JSON.parse(window.localStorage.getItem(collection) ?? "{}") as any[]))));
}

function useDatabaseState<T>(collection:string,documentPath:string) : [T|undefined,<T extends DocumentData>(newVal:T)=>void] {
    const aux = JSON.parse(window.localStorage.getItem(collection) ?? "null");
    const [val,setVal] = useState(aux ? aux[documentPath] : undefined);
    return [val,setVal];
}

/**
 * Takes a collection and a document path, and gives the value of that document, as well as a function to update it, and refreshes the component when
 * the value changes. T is the type of the object that it receives from the database.
*/

export {
    setDocument,
    getCollection,
    useDatabaseState,
}