import { useEffect, useState } from 'react';
import Addbtn from './Components/Add';
import { useForm } from 'react-hook-form';

interface NotebookInfo {
    title: string;
}

function Home() {
    // 노트북 상태
    const [notebooks, setNotebooks] = useState<String[]>([]);

    // 데이터 불러오기
    useEffect(() => {
        fetch('http://localhost:3001/paint', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
            },
            credentials: 'include'          
        })
        .then(res => res.json())
        .then(json => {
            setNotebooks(json.map((j: {notebook_name: string}) => j.notebook_name));
        })
    }, []);

    // 노트북 추가
    const { 
        register,
        handleSubmit 
    } = useForm<NotebookInfo>();
    const onSubmit = async (data:NotebookInfo) => {
        try {
            await fetch('http://localhost:3001/notebook', {
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body: JSON.stringify(data),
                credentials: 'include'
            })
            .then((res) => {
                if (res.ok) {
                    setNotebooks([...notebooks, data.title]);
                }
            })
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="h-screen text-center relative">
            <Addbtn />
            <form onSubmit={handleSubmit(onSubmit)}>
                <label>
                    <input {...register("title", {
                        required: "*노트북 제목을 입력하세요!",
                    })} 
                    placeholder="새로운 노트북 제목" />
                </label>
                <br />
                <button 
                className=" bg-white p-2 rounded-xl
                hover:bg-gray-100 hover:text-gray-700"
                type="submit">노트북 생성!</button>
            </form>
            <div className="flex ">
                {notebooks.map((notebook) => (
                    <div className="bg-white m-2">{notebook}</div>
                ))}
            </div>
        </div>
    );
}

export default Home;