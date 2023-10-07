import { Link } from 'react-router-dom';
import Addbtn from './Add';
import { useState } from 'react';

function Header() {
    const [checkSession, setCheckSession] = useState(false);
    return (
        <div className='flex justify-between'>
            <div className="flex space-x-3">
                { checkSession ? (
                    <>
                    </>
                ) : (
                    <>
                    <Link to="/join">회원가입</Link>
                    <Link to="/signin">로그인</Link>
                    <Link to="/signout">로그아웃</Link>
                    </>
                ) }
            </div>
        </div>
    );
}

export default Header;