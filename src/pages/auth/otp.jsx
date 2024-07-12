"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { Layout } from "@/components/account";
import "./css/otp.css";
import { warning, success, showToastRight, error } from "@/services/alert.service";

export default function Otp() {
    const [verificationCode, setVerificationCode] = useState([]);
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedEmail = localStorage.getItem('email');
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, []);

    console.log('email', email);

    const handleInputChange = (index, value) => {
        const updatedCode = [...verificationCode];
        updatedCode[index] = value;
        setVerificationCode(updatedCode);
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            // Construct the request payload
            const payload = {
                email,
                verificationCode: verificationCode.join(''),
            };
            console.log('email', email);
            console.log('verificationCode', verificationCode);

            // Send a POST request to the server to verify the code
            const response = await fetch(
                `http://localhost:8080/api/forgot-password/verify-otp/${verificationCode}/${email}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                }

            );
            console.log('response', response);

            if (response.status === 200) {

                // Verification successful, redirect to the password reset page
                router.push('/auth/reset-password');
                // Parse the response JSON data
                const data = await response.json();

                // Check if the verification was successful



                // Verification failed, display an error message
                toast.warning(data.message || 'Invalid verification code. Please try again.');

            } else {
                // Verification failed, display an error message
                toast.error('An error occurred while verifying the code. Please try again later.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            toast.error('An error occurred while verifying the code. Please try again later.');
        }
    };

    return (
        <>
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <form
                        id="yourFormId"
                        className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30"
                    >
                        <h1 className="mb-8 text-3xl font-semibold text-center">Email Verification</h1>
                        <p>We have sent a code to your email</p>
                        <p>{email}</p>
                        <div className="input-container">
                            {Array.from({ length: 6 }, (_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={verificationCode[index] || ''}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                        <button className="verify-button" onClick={handleVerify}>
                            Verify Account
                        </button>
                    </form>
                    <ToastContainer
                        className="toast-container"
                        toastClassName="toast"
                        bodyClassName="toast-body"
                        progressClassName="toast-progress"
                        theme="colored"
                        transition={Zoom}
                        autoClose={10}
                        hideProgressBar={true}
                    ></ToastContainer>
                </main>
            </Layout>
        </>
    );
}