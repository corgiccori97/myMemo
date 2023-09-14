import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
    const onSubmit = async (data:LoginInfo) => {
        try {
            const res = await fetch('http://localhost:3001/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if (json.isSignedIn === "True") {
                    alert("로그인 성공");
                    SetCurrentState("SignedIn");
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
        <form 
        className="w-1/2 mx-auto"
        onSubmit={handleSubmit(onSubmit)}
        name="loginInfo">
            <h1 className="font-extrabold text-gray-800">이메일, 비밀번호로 로그인하세요</h1>
            <span className="font-body text-2xl">SIGN IN!</span>
            <hr />
            <div className="flex flex-col">
                {/* 이메일 */}
                <label
                className="font-body text-yellow-300 mt-2">
                    EMAIL
                    <br />
                    <input {...register("email", {
                        required: "*필수항목입니다.",
                    })}
                    type="email" 
                    name="email"
                    className="text-gray-600 text-sm cols-span-2 underline underline-offset-4"
                    // placeholder="이메일" 
                    />
                </label>
                {/* 비밀번호 */}
                <label className="font-body text-yellow-300">
                    PASSWORD
                    <br />
                    <input {...register("password", {
                        required: "*필수항목입니다.", 
                    })}
                    type="password"
                    name="password"
                    className="text-gray-800 border"
                    /> 
                </label>
            </div>
            <button 
            type="submit">제출</button>
            <br />
            { currentState === "Wrong" ? <span className="text-red-600 text-xs">존재하지 않는 유저이거나 비밀번호가 틀렸어요!</span> : <></> }
        </form>
        </>
    );
}

export default SignIn;