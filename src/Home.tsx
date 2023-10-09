import { useEffect } from 'react';
import Addbtn from './Components/Add';

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
        <div className="h-screen text-center relative">
            <Addbtn />
        </div>
    );
}

export default Home;