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
    chip_id: number;
    index: number;
    created_time: string;
    onPositionChange?: (i:number, x:number, y:number) => void;
}

const Notebook = () => {
    // 로컬스토리지에 저장된 notebook 제목
    const title = localStorage.getItem('title');
    // id 이용해서 memochip들 가져오기
    let { id }= useParams();
    const idNumber = parseInt(id!);
    const [chips, setChips] = useState<ChipProps[]>([]);
    const [positions, setPositions] = useState<string[]>([]);
    const isChanged = useRecoilValue(isListChanged);
    let chipNumber = 0;

    //로컬스토리지에 저장된 chip 좌표 불러오기
    useEffect(() => {
        let chipPositions = localStorage.getItem('position_chip');
        if (chipPositions) {
            setPositions(JSON.parse(chipPositions));
        }
    }, []);

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
                        index: chipNumber++,
                        chip_id: j.chip_id,
                        content: j.content,
                        photo_url: j.photo_url,
                        created_time: j.created_at,
                    }
                ]);
            });
        })
        .catch(err => console.log(err));
    }, [, isChanged]);

    const handlePositionChange = (index:number, x:number, y:number) => {
        let dummyPosition = [...positions];
        dummyPosition[index] = `${x} ${y}`;
        setPositions(dummyPosition);
        localStorage.setItem('position_chip', JSON.stringify(positions));
    };

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
                chip_id={chip.chip_id}
                sentence={chip.content}
                photo_url={chip.photo_url}
                created_time={chip.created_time}
                onPositionChange={handlePositionChange}
                position={positions[chip.index]}
                />
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