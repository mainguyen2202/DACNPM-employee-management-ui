"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { Layout } from "@/components/account";
import { Nav } from "@/components/Nav.jsx";

export default function Profile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');

  
  
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userId = sessionStorage.getItem('userId');
            fetchUserData(userId);
            updateProfile(userId);
        }
      
     
    }, []);

    const fetchUserData = async (userId) => {
        const response = await fetch(`https://employee-leave-api.onrender.com/api/employees/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const userData = await response.json();
        setUsername(userData.username);
        setEmail(userData.email);
        setFullName(userData.fullName);
        setPosition(userData.position);
      };
  
    const updateProfile = async ( userId) => {
    //   e.preventDefault();
      const updatedData = {
       
      
        fullName,
       
      };
     
      const response = await fetch(`https://employee-leave-api.onrender.com/api/employees/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      if (response.ok) {
        console.log('Profile updated successfully');
      } else {
        console.error('Failed to update profile');
      }
    };
 
    return (
        <>
            <Layout>
                <Nav />
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <form id="profileForm" className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30">
                        <h1 className="mb-8 text-3xl font-semibold text-center">Profile</h1>
                        <input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            placeholder="Username"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                            disabled
                        />
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                            disabled
                        />
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            type="text"
                            placeholder="Full Name"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <input
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            type="text"
                            placeholder="Position"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                            disabled
                        />
                        <button
                            type="submit"
                            className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                            onClick={updateProfile}
                        >
                            Update Profile
                        </button>
                    </form>
                    <ToastContainer
                        className="toast-container"
                        toastClassName="toast"
                        bodyClassName="toast-body"
                        progressClassName="toast-progress"
                        theme='colored'
                        transition={Zoom}
                        autoClose={5}
                        hideProgressBar={true}
                    ></ToastContainer>
                </main>
            </Layout>
        </>
    );
}