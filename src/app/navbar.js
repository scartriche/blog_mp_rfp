"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useAuthContext } from "@/context/AuthContext";
import firebase_app from "@/firebase/config";
import {
    onAuthStateChanged,
    getAuth
} from 'firebase/auth';

const auth = getAuth(firebase_app);

export default function Navbar() {
  const { user } = useAuthContext();
  return (
    <nav className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0">
              <Link href="/">
                <span className="text-white">
                  <Image src="/logo.svg" alt="Logo" width={40} height={40} />
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </span>
              </Link>
              {user == null && (
                <>
                  <Link href="/signin">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Login
                    </span>
                  </Link>
                  <Link href="/signup">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      Register
                    </span>
                  </Link>
                </>
              )}
              {user != null && (
                <>
                  <Link href="/new_article">
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      New Post
                    </span>
                  </Link>

                  <Link href={`/user/${user.uid}`}>
                    <span className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                      My Profile
                    </span>
                  </Link>

                  <Link href="#">
                    <span
                      className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent default link behavior
                        auth.signOut();
                      }}
                    >
                      Logout
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
