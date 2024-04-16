import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'react-feather';
import Cookies from 'js-cookie';

const Header = () => {
    const user = Cookies.get('username') || '';
    const navigate = useNavigate();

    const handleLogout = () => {
        const cookies = Cookies.get();
        for (const cookie in cookies) {
            Cookies.remove(cookie);
        }
        navigate('/login');
    };

    return (
        <div className='bg-blue-400 w-screen h-32 border-b border-black font-serif'>
            <h2 className='text-center text-white text-3xl font-bold'>Dashboard</h2>
            <p className='text-yellow-200 text-xl p-3'>
                Welcome back, <u><strong>{`${user.charAt(0).toUpperCase()}${user.slice(1).toLowerCase()}`}</strong></u>
            </p>
            <div className='flex justify-end mr-2 mt-[-80px]'>
                <button className='outline outline-offset-3 outline-1 bg-red-500 text-black hover:bg-blue-600 hover:text-white hover:outline-offset-3 px-4 rounded-full' onClick={handleLogout}>
                    <LogOut size={16} />
                </button>
            </div>
        </div>
    )
}

export default Header;
