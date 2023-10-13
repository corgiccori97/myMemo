import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

interface NotebookInfo {
    title: string;
}

function Home() {
    // 노트북 상태
    const [notebooks, setNotebooks] = useState<{notebook_id: number; notebook_name: string}[]>([]);

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
            setNotebooks(prev => [
                ...prev,
                ...json.map((j: {notebook_id: number; notebook_name: string }) => ({
                    notebook_id: j.notebook_id, 
                    notebook_name: j.notebook_name
                }))
            ]);
        }) 
    }, []);

    // 노트북 추가
    const { 
        register,
        handleSubmit,
        reset,
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
            .then((res) => res.json())
            .then((json) => {
                setNotebooks([...notebooks, {notebook_id:json[0].id, notebook_name: data.title}]);
                reset({title: ""});
            })
        }
        catch (err) {
            console.log(err);
        }
    };

    return (
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>
                <input {...register("title", {
                    required: "*노트북 제목을 입력하세요!",
                })} 
                placeholder="새로운 노트북 제목" />
            </label>
            <br />
            <button 
            className=" bg-white p-2 rounded-xl text-gray-800
            hover:bg-gray-100 hover:text-gray-600 font-body water-text"
            type="submit">+ NOTEBOOK list +</button>
        </form>
        <div className="flex flex-wrap mx-auto border border-dashed rounded-[50%] w-1/2 border-gray-400 justify-center body">
            {notebooks.map((notebook) => (
                <div className=" bg-[#ffffff] m-2 p-2 rounded-xl cursor-pointer hover:ring-2 ring-blue-400">
                    <Link to={`/notebook/${notebook.notebook_id}`}>{notebook.notebook_name}</Link>
                </div>
            ))}
        </div>
        </>
    );
}

export default Home;