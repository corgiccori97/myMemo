import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import ReactTypingEffect from 'react-typing-effect';
import NotebookModal from './Components/NotebookModal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { authenticatedState } from './atoms';

interface NotebookInfo {
    title: string;
}

function Home() {
    const isAuthenticated = useRecoilValue(authenticatedState);
    // 노트북 상태
    const [notebooks, setNotebooks] = useState<{notebook_id: number; notebook_name: string; thumbnail: string}[]>([]);
    // localStorage에 노트북 title 저장(v6에서는 Link to에 props를 넘겨줄 수가 없어서 로컬스토리지 활용)
    const saveTitle = (title:string) => {
        localStorage.setItem('title', title);
    };
    const [add, setAdd] = useState(false);

    // 노트북 데이터 불러오기
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
                ...json.map((j: {notebook_id: number; notebook_name: string; thumbnail: string }) => ({
                    notebook_id: j.notebook_id, 
                    notebook_name: j.notebook_name,
                    thumbnail: j.thumbnail,
                }))
            ]);
        }) 
    }, []);
    console.log(notebooks);
    return (
        <div className='mt-[10%]'>
        <button
        type="button"
        onClick={() => setAdd(prev => !prev)}
        className="rounded-full px-8 pt-2.5 text-4xl font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] my-auto font-body flex-none"
        >
            Add NOTEBOOK here
        </button>
        { isAuthenticated ?  (
            <NotebookModal 
            usage='add'
            isOpen={add}
            onClose={() => setAdd(false)}
            />
        ) : (
            <>
            <span>로그인하고 노트북을 추가해 보세요!</span>
            </>
        )}
        <div className="flex flex-wrap mx-auto border border-dashed rounded-[50%] w-1/2 border-gray-400 justify-center body px-15 py-8">
            {notebooks.map((notebook) => (
                <div className='bg-white m-2 p-2 rounded-xl cursor-pointer hover:font-extrabold'>
                    <img src={`./public/${notebook.thumbnail}`} alt='' />
                    <Link
                    key={notebook.notebook_id} 
                    to={`/notebook/${notebook.notebook_id}`} onClick={() => saveTitle(notebook.notebook_name)}>{notebook.notebook_name}</Link>
                </div>
            ))}
        </div>
        </div>
    );
}

export default Home;