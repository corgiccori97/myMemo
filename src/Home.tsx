import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NotebookModal from './Components/NotebookModal';
import { useRecoilValue } from 'recoil';
import { authenticatedState } from './atoms';

interface NotebookInfo {
    title: string;
}

function Home() {
    const isAuthenticated = useRecoilValue(authenticatedState);
    // 노트북 상태
    const [notebooks, setNotebooks] = useState<{notebook_id: number; notebook_name: string; thumbnail: string}[]>([]);

    // localStorage에 노트북 title 저장(v6에서는 Link to에 props를 넘겨줄 수가 없어서 로컬스토리지 활용)
    const saveTitle = (title:string, thumbnail: string) => {
        localStorage.setItem('title', title);
        if (thumbnail) {
            localStorage.setItem('backgroundURL', thumbnail);
        } else {
            localStorage.setItem('backgroundURL', '');
        }
    };
    const [add, setAdd] = useState(false);
    
    const navigate = useNavigate();
    const onClick = () => {
        if (isAuthenticated) {
            setAdd(prev => !prev);
        } else {
            alert("로그인하고 노트북을 추가해 보세요!");
            navigate("/signin");
        };
    };

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
        onClick={onClick}
        className="rounded-full px-8 pt-2.5 text-4xl font-medium uppercase leading-normal my-auto font-body flex-none stamp-effect"
        >
            Add NOTEBOOK here
        </button>
        <NotebookModal 
        usage='add'
        isOpen={add}
        onClose={() => setAdd(false)}
        />
        <div className="flex flex-wrap mx-auto border border-dashed rounded-[50%] w-1/2 border-gray-400 justify-center body px-15 py-8">
            {notebooks.map((notebook) => (
                <div 
                key={notebook.notebook_id}
                className="m-2 p-2 rounded-xl cursor-pointer hover:font-extrabold stamp-effect">

                    <Link
                    key={notebook.notebook_id} 
                    to={`/notebook/${notebook.notebook_id}`} onClick={() => saveTitle(notebook.notebook_name, notebook.thumbnail)}>{notebook.notebook_name}</Link>
                </div>
            ))}
        </div>
        </div>
    );
}

export default Home;