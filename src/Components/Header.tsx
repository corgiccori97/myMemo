import { Link } from 'react-router-dom';

interface HeaderProps {
    authenticated: boolean;
}

function Header(props: HeaderProps) {
    console.log(props.authenticated);
    return (
        <div className='flex justify-between relative mt-2 mx-2'>
            <div className="flex space-x-3 font-bold text-gray-400">
                { props.authenticated ? (
                    // 회원
                    <>
                    <Link to="/signout">로그아웃</Link>
                    </>
                ) : (
                    // 비회원
                    <>
                    <Link to="/join">회원가입</Link>
                    <Link to="/signin">로그인</Link>
                    </>
                ) }
            </div>
        </div>
    );
}

export default Header;