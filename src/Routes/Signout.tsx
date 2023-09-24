import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Signout() {
    const navigate = useNavigate();
    useEffect(() => {
        fetch('http://localhost:3001/signout')
        .then(res => {
            if (res) {
                console.log(res);
            }
            else {
                console.log("뭔가 잘못됨");
            }
            navigate("/");
        })
    }, []);
    return null;
}