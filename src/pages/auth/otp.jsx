"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { Layout } from "@/components/account";
import "./css/otp.css";

export default function Otp() {
    // const email = localStorage.getItem('email');
    const email = useState('ksekwamote@gmail.com');

    const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
    const [resendCountdown, setResendCountdown] = useState(56);

    const handleInputChange = (index, value) => {
        const updatedCode = [...verificationCode];
        updatedCode[index] = value;
        setVerificationCode(updatedCode);
    };

    const handleVerify = async (e) => {
        try {
            // Construct the request payload
            const payload = {
                email,
                verificationCode: verificationCode.join(''),
            };

            // Send a POST request to the server to verify the code
            const response = await fetch('https://employee-leave-api.onrender.com/api/forgot-password/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                // Verification successful, redirect to the password reset page
                router.push('/auth/reset-password');
            } else {
                // Verification failed, display an error message
                alert('Invalid verification code. Please try again.');
            }
        } catch (error) {
            console.error('Error verifying code:', error);
            alert('An error occurred while verifying the code. Please try again later.');
        }
    }









    const handleResend = () => {
        // Implement your resend logic here
        console.log('Resend OTP');
        startResendCountdown();
    };

    const startResendCountdown = () => {
        setResendCountdown(56);
        const interval = setInterval(() => {
            setResendCountdown((prevCount) => prevCount - 1);
            if (resendCountdown === 0) {
                clearInterval(interval);
            }
        }, 1000);
    };






    return (
        <>
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <form id="yourFormId"
                        className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30">
                        <h1 className="mb-8 text-3xl font-semibold text-center">Email Verification</h1>
                        {/* <div className="container"> */}
                        <p>We have sent a code to your email</p>
                        <p> {email}</p>
                        <div className="input-container">
                            {verificationCode.map((_, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={verificationCode[index]}
                                    onChange={(e) => handleInputChange(index, e.target.value)}
                                />
                            ))}
                        </div>
                        <button className="verify-button" onClick={handleVerify}>
                            Verify Account
                        </button>
                        <a href="#" className="resend-link" onClick={handleResend}>
                            Didn't receive code? Resend OTP in {resendCountdown}s
                        </a>
                        {/* </div> */}
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