"use client";
import { useEffect, useState } from "react";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation'
import { Layout } from "@/components/account";

export default function Reset() {

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    const [email, setEmail] = useState('20130321@st.hcmuaf.edu.vn');

    // const [email, setEmail] = useState('');
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedEmail = localStorage.getItem('email');
            if (storedEmail) {
                setEmail(storedEmail);
            }
        }
    }, []);

    const ProceedResetPassword = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const resetPasswordDTO = {
            password: newPassword
        };

        try {
            // http://localhost:8080
            const response = await fetch(`https://employee-leave-api.onrender.com/api/employees/change-password/${email}`, {
                method: "PUT",
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(resetPasswordDTO)
            });

            console.log("response", response.status);
            console.log("response", response);

            if (response.status === 200) {
                toast.success('Password reset successfully.');
                router.push('/');
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        } catch (err) {
            toast.error('Failed: ' + err.message);
        }
    };


    const validate = () => {
        let result = true;

        if (newPassword === '' || newPassword === null) {
            result = false;
            console.log('Please Enter New Password');
        } else if (newPassword.length < 8) {
            result = false;
            console.log('New Password must be at least 8 characters long');
            alert('New Password must be at least 8 characters long');
        }

        if (confirmPassword === '' || confirmPassword === null) {
            result = false;
            console.log('Please Confirm New Password');
        } else if (newPassword !== confirmPassword) {
            result = false;
            console.log('New Password and Confirm Password do not match');
            alert('New Password and Confirm Password do not match');
        }

        return result;
    };
    return (
        <>
            <Layout>
                <main className="flex min-h-screen flex-col items-center justify-between p-24">
                    <form id="yourFormId"
                        className="flex flex-col items-center justify-between w-full max-w-md p-8 bg-white rounded-xl shadow-lg dark:bg-zinc-800/30">
                        <h1 className="mb-8 text-3xl font-semibold text-center">Reset Password</h1>

                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            type="password"
                            placeholder="New Password"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />
                        <input
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type="password"
                            placeholder="Confirm New Password"
                            className="w-full p-4 mb-4 border border-gray-300 rounded-lg dark:border-neutral-800"
                        />

                        <button
                            type="submit"
                            className="w-full p-4 mb-4 text-white bg-gradient-to-r from-sky-500 to-blue-500 rounded-lg"
                            onClick={ProceedResetPassword}
                        >
                            Reset Password
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