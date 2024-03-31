"use client"

import Image from "next/image";

import React, { useState, useEffect } from "react";
import { Link } from "next/link";
import { firestore } from "@/firebase/config";
import getDocumentIds from "@/firebase/firestore/getDocumentIds";
import firebase_app from "@/firebase/config";
import {collection, getDocs, getDoc, doc, getFirestore } from "firebase/firestore";
import { useRouter } from 'next/navigation'


const db = getFirestore(firebase_app)

const fetchPosts = async () => {
  const postsCollection = collection(db, "posts");
  const querySnapshot = await getDocs(postsCollection);
  const postsData = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id,
    url: `/article/${doc.id}`, }));
  return postsData;
};



export default function Home() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const getPosts = async () => {
      const fetchedPosts = await fetchPosts();
      setPosts(fetchedPosts);
    };
    
    getPosts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filteredPosts = posts.filter((post) => {
    // Case-insensitive search within title and text fields
    return post.title.toLowerCase().includes(searchText.toLowerCase()) ||
      post.text.toLowerCase().includes(searchText.toLowerCase());
  });

  return (
    <div className="container mx-auto px-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </div>
      {filteredPosts.map((post) => (
        <div key={post.id} className="mb-8 p-4 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-bold cursor-pointer hover:underline" onClick={() => router.push(post.url)}>
            {post.title}
          </h2>
          <p className="text-gray-700">{post.text}</p>
        </div>
      ))}
    </div>
  );
}