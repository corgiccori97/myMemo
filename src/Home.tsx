import { Link } from 'react-router-dom';
import Addbtn from './Components/Add';
import Join from './Routes/Join';
import { useState } from 'react';

function Home() {
    const [loggedIn, setLoggedIn] = useState(false);
    return (
        <div className="flex justify-between">
            <Addbtn />
            {loggedIn? <></> : (
                <div className="flex space-x-3">
                    <Link to="/join">회원가입</Link>
                </div>
            )}
        </div>
    );
}

export default Home;