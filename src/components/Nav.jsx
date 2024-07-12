import { useEffect, useState } from "react";
import "./assets/formStyle.css";
import Datepicker from "react-tailwindcss-datepicker";
import { useRouter } from 'next/navigation';
export { Nav };

function Nav() {
    const [currentPage, setcurrentPage] = useState('leaveList');

    const [bossId, setBossId] = useState(null);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userId = sessionStorage.getItem('userId');
            fetchBossId(userId);
        }
    }, []);
    const router = useRouter();

    const fetchBossId = async (userId) => {
        const response = await fetch(`http://localhost:8080/api/employees/${userId}`, {
            method: "GET",
            headers: { 'content-type': 'application/json' }
        });
        const userInfo = await response.json();
        if (userInfo.bossId) {
            setBossId(userInfo.bossId);
        }
        if (userInfo.username) {
            setUserName(userInfo.username);
        }
    };
    console.log('userName:', userName);
    console.log('bossId:', bossId);

    const handleLogout = () => {
        // Perform logout logic here
        // For example, you could clear the user's session or token
        // and then redirect them to the login page

        // Example logout logic
        localStorage.removeItem('user');
        router.push('/');
    };
    return (
        <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">Employee Leave Management</span>
            </div>
            <div className="block lg:hidden">
                <button
                    id="nav"
                    className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white"
                >
                    <svg
                        className="fill-current h-3 w-3"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M2 5h16v1H2V5zm0 5h16v1H2v-1zm16 4H2v1h16v-1z"
                        />
                    </svg>
                </button>
            </div>
            <div
                id="nav-content"
                className="w-full block flex-grow lg:flex lg:items-center lg:w-auto"
            >
                <div className="text-sm lg:flex-grow justify-between">
                    {bossId === null ? (
                        <a
                            href="/account/requestList"
                            className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'requestList'
                                ? 'text-white font-semibold'
                                : 'text-teal-200 hover:text-white'
                                } mr-4`}
                            onClick={() => setcurrentPage("requestList")}
                        >
                            Leave Request
                        </a>
                    ) : (
                        <a
                            href="/account/leaveList"
                            className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'leaveList'
                                ? 'text-white font-semibold'
                                : 'text-teal-200 hover:text-white'
                                } mr-4`}
                            onClick={() => setcurrentPage("leaveList")}
                        >
                            Leave List
                        </a>
                    )}
                </div>
                <div className="text-sm lg:flex-grow text-right">
                    <a
                        href="/account/profile"
                        className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'logout'
                            ? 'text-white font-semibold'
                            : 'text-teal-200 hover:text-white'
                            } mr-4`}
                       
                    >
                        {userName}
                    </a>

                    <a
                        href="#"
                        className={`block mt-4 lg:inline-block lg:mt-0 ${currentPage === 'logout'
                            ? 'text-white font-semibold'
                            : 'text-teal-200 hover:text-white'
                            } mr-4`}
                        onClick={() => handleLogout()}
                    >
                        Logout
                    </a>
                </div>
            </div>
        </nav>
    )
}