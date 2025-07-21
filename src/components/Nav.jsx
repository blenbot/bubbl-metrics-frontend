import React from 'react';
import '../index.css';
import Bubbl from '../assets/Bubbl.png';


export default function Nav() {
    return (
        <nav className='z-15 fixed top-10 left-15 right-15 shadow-md bg-orange-400 rounded-xl py-3 px-6 md:px-8 lg:px-12 font-white font-[700]'>
            <div className='flex justify-between items-center gap-x-7 max-w-7xl mx-auto'>
                <div className='flex items-center gap-x-3'>
                    <img src={Bubbl} alt="bubbl-logo" className="h-8 w-8" />
                    <span className='text-xl text-gray-800'>Bubbl Metrics</span>
                </div>
                <div className='text-sm text-gray-600'>
                    Real-time Dashboard
                </div>
            </div>
        </nav>
    );
}