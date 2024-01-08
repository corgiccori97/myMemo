import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

interface UserInfo {
    email: string;
    password: string;
    passwordConfirm: string;
    nickname?: string;
}

function Join() {
    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<UserInfo>({
        mode: "onChange",
    });
    const [isJoined, isJoinedSet] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (data:UserInfo) => {
        try {
            await fetch('http://localhost:3001/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
            if (response.ok) {
                alert("회원가입이 완료되었어요!");
                isJoinedSet(true);
                navigate("/signin");
            } else {
                alert("이미 존재하는 이메일입니다.");
                reset();
            }
            })
        }
        catch (error) {
            console.log("error")
        }

    };

    return (
        <>
        <button 
        className="flex items-center space-x-2 mx-auto text-gray-800 mt-[10%] mb-2">
            <svg fill="none" 
            className="w-6 h-6"
            stroke="currentColor" 
            strokeWidth="1.5"
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" 
            aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
            </svg>
            <Link to="/">홈으로 돌아가기</Link>
        </button>
        <form 
        className="w-1/4 mx-auto p-10 text-xl text-center bg-slate-300 bg-opacity-40"
        onSubmit={handleSubmit(onSubmit)}
        name="userInfo">
            <h1 className="font-extrabold text-gray-800">회원가입하고 내 메모를 저장하세요</h1>
            <span className="font-body text-2xl">JOIN US!</span>
            <hr />
            <div className="flex flex-col space-y-4 text-start">
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
                    className="text-gray-600 text-sm cols-span-2 rounded-xl pl-2 w-3/4"
                    />
                </label>
                {/* 비밀번호 */}
                <label className="font-body text-yellow-400">
                    PASSWORD
                    <br />
                    <input {...register("password", {
                        required: "*필수항목입니다.", 
                        minLength: 8
                    })}
                    type="password"
                    name="password"
                    className="text-gray-800 rounded-xl pl-2 center w-3/4"
                    placeholder="********" 
                    /> 
                </label>
                {errors.password && errors.password.type === "minLength" && <span className="text-red-600 text-xs">8자 이상으로 입력해주세요</span>}
                {/* 비밀번호 확인 */}
                <label className="font-body text-yellow-400">
                    PASSWORD CONFIRM
                    <br />
                    <input {...register("passwordConfirm", {
                        required: "*필수항목입니다",
                        validate: (val:string) => {
                            if (watch("password") != val) {
                                return "비밀번호가 일치하지 않습니다.";
                            }
                        }
                    })} 
                    type="password" 
                    name="passwordConfirm"
                    className="text-gray-800 rounded-xl pl-2 w-3/4"
                    placeholder="********"
                    /> 
                </label>
                { watch("password") !== watch("passwordConfirm") ? <span className="text-red-600 text-xs">비밀번호가 일치하지 않습니다.</span> : ""}
            </div>
            <button 
            type="submit"
            className="mt-3 inline-block font-bold px-28 hover:text-yellow-400 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">제출</button>
        </form>
        </>
    );
}

export default Join;