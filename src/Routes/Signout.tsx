import { useEffect } from 'react';
import { authenticatedState, userIdState } from '../atoms';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';

export default function Signout() {
    const [, setAuthenticated] = useRecoilState(authenticatedState);
    const [, setUserId] = useRecoilState(userIdState);

    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3001/signout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(res => {
            if (res.ok) {
                    setAuthenticated(false);
                    setUserId("");
                    navigate("/");        
            } else {
                alert("로그아웃 실패");
            }
        })
    }, []);
    return null;
}