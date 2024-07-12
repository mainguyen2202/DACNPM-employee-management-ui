"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { Layout } from "@/components/account";

export default function Forgot() {
    const [email, setEmail] = useState('');
    const router = useRouter();
    // const handleSendMail = async (e) => {
    //     e.preventDefault();

    //     if (!validate()) {
    //         return;
    //     }

    //     const forgotPasswordDTO = {
    //         email: email
    //     };

    //     try {
    //         // https://employee-leave-api.onrender.com
    //         // https://employee-leave-api.onrender.com
    //         const response = await fetch(" https://employee-leave-api.onrender.com/api/forgot-password/verify-email", {
    //             method: "POST",
    //             headers: { 'content-type': 'application/json' },
    //             body: JSON.stringify(forgotPasswordDTO)
    //         });

    //         console.log("response", response.status);
    //         console.log("response", response);

    //         if (response.status === 200) {
    //             toast.success('Password reset instructions sent to your email.');
    //         } else {
    //             toast.error('Failed to send password reset email. Please try again.');
    //         }
    //     } catch (err) {
    //         toast.error('Failed: ' + err.message);
    //     }
    // };
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const forgotPasswordDTO = {
            email: email
        };

        try {
            // https://employee-leave-api.onrender.com
            // https://employee-leave-api.onrender.com
            const response = await fetch(`https://employee-leave-api.onrender.com/api/forgot-password/verify-email/${email}`, {
                method: "POST",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(forgotPasswordDTO)
            });

            console.log("response", response.status);
            console.log("response", response);

            if (response.status === 200) {
                toast.success('Password reset instructions sent to your email.');
                localStorage.setItem('email', email); // Lưu email vào localStorage
                router.push('/auth/otp');
            } else {
                toast.error('Failed to send password reset email. Please try again.');
            }
        } catch (err) {
            toast.error('Failed: ' + err.message);
        }
    }
    


    const validate = () => {
        let result = true;

        if (email === '' || email === null) {
            result = false;
            console.log('Please Enter Email');
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            result = false;
            console.log('Please Enter a valid Email');
        }
        return result;
    };
    return (
        <>
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <form id="yourFormId"
                        className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30">
                        <h1 className="mb-8 text-3xl font-semibold text-center">Forgot Password</h1>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="Email"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />

                        {/* <button
                            type="button"
                            className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                            onClick={handleSendMail}
                        >
                            Send Mail
                        </button> */}

                        <button
                            type="button"
                            className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                            onClick={handleSendOTP}
                        >
                            Send OTP
                        </button>

                        {/* <p className="text-sm opacity-50">
                            Don't have an account?{" "}
                            <a href="/auth/reset" className="text-blue-500">
                                Reset
                            </a>
                            <a href="/auth/otp" className="text-blue-500">
                                otp
                            </a>
                        </p> */}
                    </form>
                    <ToastContainer
                        className="toast-container"
                        toastClassName="toast"
                        bodyClassName="toast-body"
                        progressClassName="toast-progress"
                        theme='colored'
                        transition={Zoom}
                        autoClose={10}
                        hideProgressBar={true}
                    ></ToastContainer>
                </main>
            </Layout>
        </>
    );
}