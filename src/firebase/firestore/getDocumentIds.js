import { collection, getDocs, getFirestore } from "firebase/firestore";
import { firestore } from "../config";


export default async function getDocumentIds(collectionName) {
    const docIds = [];

    try {
        const db = getFirestore(); 
        const querySnapshot = await getDocs(collection(db, collectionName));

        querySnapshot.forEach((doc) => {
            docIds.push(doc.id);
        });
    } catch (error) {
        console.error("Error getting document IDs:", error);
    }

    return docIds;
}
