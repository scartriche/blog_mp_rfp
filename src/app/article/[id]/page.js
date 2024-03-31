"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  FieldValue,
  arrayUnion,
  getFirestore,
} from "firebase/firestore";
import { useParams } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import Link from "next/link";

export default function PostPage() {
  const id = useParams().id;

  const [post, setPost] = useState(null);
  const [originalPoster, setOriginalPoster] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [commentTitle, setCommentTitle] = useState("");
  const [commentText, setCommentText] = useState("");

  const db = getFirestore(firebase_app);

  const { user } = useAuthContext();

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    try {
      const postRef = doc(collection(db, "posts"), id);

      // Create the comment object with user data (adjust based on your user model)
      const comment = {
        title: commentTitle,
        text: commentText,
      };

      // Update the post's comments array with the new comment
      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });

      setPost({ ...post, comments: [...post.comments, comment] });
      setCommentTitle("");
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      // Handle the error appropriately, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      let postId = "";
      try {
        const postRef = doc(collection(db, "posts"), id);
        const postSnap = await getDoc(postRef);

        if (!postSnap.exists) {
          throw new Error("Post not found");
        }
        postId = postSnap.data().id;
        setPost(postSnap.data());
      } catch (err) {
        setError(err.message);
      }
      return postId;
    };

    if (id) {
      // Check if ID exists before fetching
      fetchPost();
    }
  }, [id]); // Re-run on ID change

  useEffect(() => {
    const fetchPoster = async (postId) => {
      try {
        const userRef = doc(collection(db, "users"), postId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists) {
          throw new Error("User not found");
        }
        
        setOriginalPoster({id: userSnap.id, ...userSnap.data()});
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (post != null) {
      // Check if ID exists before fetching
      fetchPoster(post.userId);
    }
  }, [post]); // Re-run on ID change

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>Post not found!</div>;
  }
  // Render post content using post object
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold">{post.title}</h1>
      <Link
        href={`/user/${originalPoster.id}`}
        className="text-2xl font-bold underline"
      >
        {originalPoster.displayName}
      </Link>
      <p className="text-gray-700">{post.text}</p>

      {/* Comments Section */}
      {post.comments &&
        post.comments.length > 0 && ( // Check for comments array and length
          <div className="mt-8">
            <h2>Commentaires</h2>
            {post.comments.map((comment) => (
              <div
                key={comment.id || Math.random()}
                className="mb-4 p-4 rounded-lg border border-gray-300"
              >
                <h3 className="text-lg font-bold">{comment.title}</h3>
                <p className="text-gray-700">{comment.text}</p>
              </div>
            ))}
          </div>
        )}

      {/* No Comments Message (Optional) */}
      {!post.comments ||
        (post.comments.length === 0 && (
          <div className="mt-8 text-gray-500">Il n'y pas de commentaires. Soyez le premier !</div>
        ))}

      {user && (
        <div className="mt-8">
          <h2>Ajouter un commentaire</h2>
          <form onSubmit={handleCommentSubmit}>
            <div className="mb-4">
              <label
                htmlFor="commentTitle"
                className="block text-sm font-medium text-gray-700"
              >
                Titre du commentaire
              </label>
              <input
                type="text"
                id="commentTitle"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={commentTitle}
                onChange={(e) => setCommentTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="commentText"
                className="block text-sm font-medium text-gray-700"
              >
                Commentaire
              </label>
              <textarea
                id="commentText"
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              Submit Comment
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
