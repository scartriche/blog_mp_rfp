"use client";
import React from "react";
import firebase_app from "@/firebase/config";
import addData from "@/firebase/firestore/addData";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";

function Page() {
  const { user } = useAuthContext();
  const [title, setTitle] = React.useState("");
  const [text, setText] = React.useState("");
  const router = useRouter();

  async function submitPost() {
    const newPost = { title: title, text: text, userId: user.uid, comments: [] };
    // addData("posts",newPost);
    const db = getFirestore(firebase_app);
    // Get a reference to the Firestore collection
    const postsCollection = collection(db, "posts");
    // Create a new document with the title and text
    try {
      // Add the new document to the collection
      let docRef = await addDoc(postsCollection, newPost);
      return router.push("/article/" + docRef.id);

      console.log("Document written with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  }

  const handleForm = async (event) => {
    event.preventDefault();
    submitPost();
  };

  return (
    <div className="wrapper flex flex-col items-center">
      <div className="form-wrapper w-full max-w-md px-8 py-10 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Créer votre nouvel article</h1>
        <form onSubmit={handleForm} className="form">
          <label htmlFor="articleTitle" className="flex flex-col mb-4">
            <p className="text-gray-700 mb-1">Title</p>
            <input
              onChange={(e) => setTitle(e.target.value)}
              required
              type="text"
              name="title"
              id="articleTitle"
              placeholder="Quel est le titre de l'article"
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <label htmlFor="articleText" className="flex flex-col mb-4">
            <p className="text-gray-700 mb-1">Text</p>
            <input
              onChange={(e) => setText(e.target.value)}
              required
              type="text"
              name="text"
              id="articleText"
              placeholder="Entrer votre texte"
              className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </label>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Plublier l'article
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
