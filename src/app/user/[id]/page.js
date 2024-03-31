"use client"


import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, doc, getDoc,getDocs, addDoc, updateDoc,FieldValue ,arrayUnion, getFirestore, query, where} from "firebase/firestore";
import { useParams } from 'next/navigation'
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";

export default function UserPage() {
    const id = useParams().id
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]); // Add state for posts
    const router = useRouter();

    const db = getFirestore(firebase_app);


    useEffect(() => {   
        const fetchPoster = async () => {
          try {
            const userRef = doc(collection(db, "users"), id);
            const userSnap = await getDoc(userRef);
    
            if (!userSnap.exists) {
              throw new Error("User not found");
            }
            setUser(userSnap.data());
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        };
        const fetchPosts = async () => {
            try {
              const postsRef = collection(db, "posts");
              const q = query(postsRef, where("userId", "==", id)); // Query by userId
              const querySnapshot = await getDocs(q);
              setPosts(querySnapshot.docs.map((doc) => {return { ...doc.data(), id: doc.id };}));
            } catch (err) {
              console.error("Error fetching posts:", err);
            }
          };
        if (id != null) { // Check if ID exists before fetching
          fetchPoster();
          fetchPosts();
        }
      }, [id]); // Re-run on ID change


    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{user.displayName}</h1>
            <h1>{user.email}</h1>
                 {/* Display posts */}
      {posts.length > 0 ? (
        <div>
          <h2>Posts:</h2>
          {posts.map((post) => (
            <div key={post.id} className="mb-8 p-4 rounded-lg shadow-md bg-white">
              <h2
                className="text-xl font-bold cursor-pointer hover:underline"
                onClick={() => router.push("/article/"+post.id)}
              >
                {post.title}
              </h2>
              <p className="text-gray-700">{post.text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
        </div>
    )
}