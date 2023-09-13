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
    const onSubmit = async (data:LoginInfo) => {
        try {
            const response = await fetch('http://localhost:3001/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.ok) {
                alert("로그인 성공");
                navigate("/");
            } else {
                console.log(response);
            }
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
        </form>
        </>
    );
}

export default SignIn;