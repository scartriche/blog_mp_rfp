'use client'
import React from "react";
import signUp from "@/firebase/signup";
import { useRouter } from 'next/navigation'
import { getFirestore, doc, setDoc, addDoc, collection } from "firebase/firestore";
import firebase_app from "@/firebase/config";

function Page() {
    const [displayName, setDisplayName] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const router = useRouter()

    const handleForm = async (event) => {
        event.preventDefault()

        const { result, error } = await signUp(email, password);

        if (error) {
            return console.log(error)
        }

        const newUser = {email: result.user.email, displayName: displayName};
        const db = getFirestore(firebase_app);
        // Get a reference to the Firestore collection
        await setDoc(doc(db, "users", result.user.uid), newUser);       
        return router.push("/user/"+result.user.uid)
    }
    return (
        <div className="wrapper flex items-center justify-center h-screen">
          <div className="form-wrapper">
            <h1 className="text-4xl font-bold mb-8">Sign up</h1>
            <form onSubmit={handleForm} className="form max-w-md mx-auto">

            <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">Display Name</label>
                <input 
                  onChange={(e) => setDisplayName(e.target.value)} 
                  required 
                  type="text" 
                  name="displayName" 
                  id="displayName" 
                  placeholder="Pierre Francois" 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>


              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  type="email" 
                  name="email" 
                  id="email" 
                  placeholder="example@mail.com" 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  type="password" 
                  name="password" 
                  id="password" 
                  placeholder="password" 
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white px-4 py-2 rounded-md"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      );      
}

export default Page;