import firebase_app from "../config";
import { getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";

const db = getFirestore(firebase_app)
export default async function addData(collectionName, data) {
    let result = null;
    let error = null;

    try {
        const maCollection = collection(db, collectionName);
        result = await addDoc(maCollection, data);
        /*result = await setDoc(doc(db, collection, id), data, {
            merge: true,
        });*/
        router.push("/")
    } catch (e) {
        error = e;
    }

    return { result, error };
}