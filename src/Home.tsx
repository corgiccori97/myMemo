import { useState, useEffect } from 'react';
import ChipList from './Components/ChipList';
import Addbtn from './Components/Add';

function Home() {
    useEffect(() => {
        console.log("check-session start");
        fetch('http://localhost:3001/check-session')
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if (json.sessionExists === true) {
                console.log("session!!!!!! exists!!!");
            }
            else {
                console.log("세션없어..");
            }
        })
    }, []);
    // 데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:3001/paint')
        .then(res => res.json())
        .then(json => {
            console.log(json);
        })
    }, []);

    return (
        <div className="h-screen text-center">
            <Addbtn />
        </div>
    );
}

export default Home;