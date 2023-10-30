import { useParams } from 'react-router';
import Addbtn from './Add';
import { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Chip } from './Chip';
import { useRecoilValue } from 'recoil';
import { isListChanged } from '../atoms';

interface ChipProps {
    content?: string; 
    photo_url?: string;
    index: number;
    created_time: string;
}

const Notebook = () => {
    // 로컬스토리지에 저장된 notebook 제목
    const title = localStorage.getItem('title');
    // id 이용해서 memochip들 가져오기
    let { id }= useParams();
    const idNumber = parseInt(id!);
    const [chips, setChips] = useState<ChipProps[]>([]);
    const [, setPosition] = useState({ x: 0, y: 0 });
    const trackPosition = (data:any) => {
        setPosition({ x: data.x, y: data.y });
    }
    const isChanged = useRecoilValue(isListChanged);

    // 데이터 불러오기
    useEffect(() => {
        setChips([]);
        fetch('http://localhost:3001/paintm', {
            method: 'POST',
            headers: {
                'Content-Type':'application/json',

            },
            credentials: 'include',        
            body: JSON.stringify([idNumber]),
        })
        .then(res => res.json())
        .then(json => {
            console.log(json);
            json.map((j: {content: string; photo_url: string; chip_id: number; created_at: string }) => {
                setChips(prev => [
                    ...prev,
                    {
                        index: j.chip_id,
                        content: j.content,
                        photo_url: j.photo_url,
                        created_time: j.created_at,
                    }
                ])
            });
        })
        .catch(err => console.log(err));
    }, [, isChanged]);

    return (
        <>
        <Addbtn notebook_id = { idNumber } />
        <h1 className="text-2xl font-extrabold"> {title} </h1>
        <ul className="space-y-3 space-x-3">
        {chips.map((chip) => (
            <li 
            key={chip.index}>
                <Chip 
                index={chip.index}
                sentence={chip.content}
                photo_url={chip.photo_url}
                created_time={chip.created_time} />
            </li>
        ))}
        </ul>
        {/* 메모
        {chips.map((chip) => (   
            <>
            <Draggable onDrag={(e, data) => trackPosition(data)}>
            <div className="inline-block cursor-pointer">
                {chip.photo_url && (
                    <img src={chip.photo_url} alt="" />
                )}
                <span className="text-lg">{chip.content}</span>
            </div>
            </Draggable>
            <br />
            </>
        ))} */}
        </>
    ); 
}

export default Notebook;