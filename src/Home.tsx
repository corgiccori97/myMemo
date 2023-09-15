import { Link } from 'react-router-dom';
import Addbtn from './Components/Add';
import { useEffect, useState } from 'react';

function Home() {
    const [checkSession, SetCheckSession] = useState(false);
    useEffect(() => {
        console.log("check-session start");
        fetch('http://localhost:3001/check-session')
        .then(res => res.json())
        .then(json => {
            console.log(json);
            if (json.sessionExists === 'True') {
                SetCheckSession(true);
            }
        })
    }, []);
    return (
        <div className="flex justify-between">
            <Addbtn />
            <div className="flex space-x-3">
                { checkSession ? (
                    <>
                    <a href="/signout">로그아웃</a>
                    </>
                ) : (
                    <>
                    <Link to="/join">회원가입</Link>
                    <Link to="/signin">로그인</Link>
                    <a href="/signout">로그아웃</a>
                    </>
                ) }
            </div>
        </div>
    );
}

export default Home;