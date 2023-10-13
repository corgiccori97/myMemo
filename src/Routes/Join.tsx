import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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
        formState: { errors }
    } = useForm<UserInfo>({
        mode: "onChange",
    });
    const [isJoined, isJoinedSet] = useState(false);
    const navigate = useNavigate();
    const onSubmit = async (data:UserInfo) => {
        try {
            const response = await fetch('http://localhost:3001/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("회원가입이 완료되었어요!");
                isJoinedSet(true);
                navigate("/signin");
            } else {
                console.log(response);
            } 
        }
        catch (error) {
            console.log("error")
        }
    };

    return (
        <>
        <form 
        className="w-1/2 mx-auto relative"
        onSubmit={handleSubmit(onSubmit)}
        name="userInfo">
            <h1 className="font-extrabold text-gray-800">회원가입하고 내 메모를 저장하세요</h1>
            <span className="font-body text-2xl">JOIN US!</span>
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
                    className="text-gray-600 text-sm cols-span-2"
                    // placeholder="이메일" 
                    />
                </label>
                {/* 비밀번호 */}
                <label className="font-body text-yellow-300">
                    PASSWORD
                    <br />
                    <input {...register("password", {
                        required: "*필수항목입니다.", 
                        minLength: 8
                    })}
                    type="password"
                    name="password"
                    className="text-gray-800"
                    placeholder="********" 
                    /> 
                </label>
                {errors.password && errors.password.type === "minLength" && <span className="text-red-600 text-xs">8자 이상으로 입력해주세요</span>}
                {/* 비밀번호 확인 */}
                <label className="font-body text-yellow-300">
                    PASSWORD CONFIRM
                    <br />
                    <input {...register("passwordConfirm", {
                        required: "*필수항목입니다",
                    })} 
                    type="password" 
                    name="passwordConfirm"
                    className="text-gray-800"
                    placeholder="********"
                    /> 
                </label>
                { watch("password") !== watch("passwordConfirm") ? <span className="text-red-600 text-xs">비밀번호가 일치하지 않습니다.</span> : ""}
            </div>
            <button 
            type="submit">제출</button>
        </form>
        </>
    );
}

export default Join;