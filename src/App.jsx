import React from 'react';
import Nav from './components/Nav';
import Body from './components/Body';

export default function App() {
    return(
        <>
        <div className='min-h-screen bg-white'>
        <Nav />
        <Body />
        </div>
        </>
    );
}