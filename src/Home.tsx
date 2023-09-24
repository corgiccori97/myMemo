import { useState, useEffect } from 'react';
import ChipList from './Components/ChipList';

function Home() {
    // 데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:3001/paint')
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }, []);

    return (
        <>
        </>
    );
}

export default Home;