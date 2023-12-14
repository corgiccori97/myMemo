import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { authenticatedState, userIdState } from '../atoms';
interface  LoginInfo {
    email: string;
    password: string;
}

function SignIn() {
    const {
        register,
        handleSubmit,
    } = useForm<LoginInfo>();
    const navigate = useNavigate();
    const [currentState, SetCurrentState] = useState("");
    // 리코일 값
    const [, setAuthenticated] = useRecoilState(authenticatedState);
    const [, setUserId] = useRecoilState(userIdState);
    
    const onSubmit = async (data:LoginInfo) => {
        try {
            await fetch('http://localhost:3001/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if (json.isSignedIn) {
                    alert("로그인 성공");
                    SetCurrentState("SignedIn");
                    // 리코일 값 업데이트
                    setAuthenticated(true);
                    setUserId(data.email);
                    navigate("/");
                }
                else {
                    SetCurrentState("Wrong");
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <>
        <button 
        className="flex items-center space-x-2 mx-auto text-gray-800 mt-[10%] mb-2">
            <Link to="/">홈으로 돌아가기</Link>
            <span> | </span>
            <Link to="/join">회원가입하러 가기</Link>
        </button>
        <form 
        className="w-1/4 mx-auto p-10 text-xl text-center bg-slate-300 bg-opacity-40"
        onSubmit={handleSubmit(onSubmit)}
        name="loginInfo">
            <h1 className="font-extrabold text-gray-800">이메일, 비밀번호로 로그인하세요</h1>
            <span className="font-body text-2xl">SIGN IN!</span>
            <hr />
            <div className="flex flex-col text-start">
                {/* 이메일 */}
                <label
                className="font-body text-yellow-400 mt-2">
                    EMAIL
                    <br />
                    <input {...register("email", {
                        required: "*필수항목입니다.",
                    })}
                    type="email" 
                    name="email"
                    className="text-gray-600 text-sm cols-span-2 underline underline-offset-4 rounded-xl w-3/4 h-7"
                    // placeholder="이메일" 
                    />
                </label>
                {/* 비밀번호 */}
                <label className="font-body text-yellow-400 mt-2">
                    PASSWORD
                    <br />
                    <input {...register("password", {
                        required: "*필수항목입니다.", 
                    })}
                    type="password"
                    name="password"
                    className="text-gray-800 border rounded-xl w-3/4 h-8"
                    /> 
                </label>
            </div>
            <button 
            type="submit"
            className="mt-3 inline-block font-bold px-28 hover:text-yellow-400 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">제출</button>
            <br />
            { currentState === "Wrong" ? <span className="text-red-600 text-xs">존재하지 않는 유저이거나 비밀번호가 틀렸어요!</span> : <></> }
        </form>
        </>
    );
}

export default SignIn;