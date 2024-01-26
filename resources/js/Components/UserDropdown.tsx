import React, { useEffect, useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { FaUserCircle } from 'react-icons/fa'; // Importing a user icon from react-icons

const UserDropdown = () => {
    const [user, setUser] = useState<number | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/current-user');
                setUser(response.data.name); // Assuming response.data contains the user's name
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    return (
        <Dropdown>
            <Dropdown.Trigger>
                <span className="inline-flex">
                    <button
                        type="button"
                        className="inline-flex items-center border border-transparent text-sm leading-4 font-medium text-gray-500  hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                    >
                        <FaUserCircle className="w-10 h-10 text-blue-500" /> {/* User icon */}
                        
                        {/* {user} */}

                        {/* <svg
                            className="ml-2 -mr-0.5 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg> */}
                    </button>
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                        </span>
                </span>
            </Dropdown.Trigger>

            <Dropdown.Content>
        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
        <Dropdown.Link href={route('logout')} method="post" as="button">
            Log Out
        </Dropdown.Link>
    </Dropdown.Content>
    </Dropdown>
    );
};

export default UserDropdown;
