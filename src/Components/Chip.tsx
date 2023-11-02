import { useEffect, useState } from 'react';
import { DraggableData, Rnd } from 'react-rnd';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { isListChanged } from '../atoms';
import Modal from './ChipModal';

interface ChipProps {
    sentence?:string;
    chip_id: number;
    index: number;
    photo_url?: string;
    created_time: string;
    onPositionChange: (i:number, x:number, y:number) => void;
    position?: string;
}

interface MemoInfo {
    content?: string;
    image?: string;
}

interface SizeProps {
    width: number;
    height: number;
}

export function Chip({sentence, chip_id, index, photo_url, created_time, onPositionChange, position}: ChipProps) {
    let notebook_id = useParams();
    const [isClicked, setIsClicked] = useState(false); 
    const [editState, setEditState] = useState(false); 
    const [, setDeleted] = useRecoilState(isListChanged);
    // const [x, y] = position.split(' ').map(v => Number(v));
    const [x, y] = (position ? position.split(' ').map(v => Number(v)) : [0, 0]);

    const handleStop = (e:any, data:DraggableData) => {
        onPositionChange(index, data.x, data.y);
    };

    
    // 삭제
    const deleteChip = (chip_id:number) => {
        try {
            fetch('http://localhost:3001/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify([notebook_id, chip_id])              
            })
            .then((res) => {
                if (res.ok) {
                    alert("삭제되었어요.");
                    setDeleted(`deleted:${chip_id}`)
                }
            })
        } catch(err) {
            alert(err);
        }
    };

    return (
        <>
        <Rnd
        // 드래그 멈추면 handleStop 함수 실행 => 각 chip의 좌표값을 localStorage에 저장(key: chip_id)
        onDragStop={handleStop}
        default={{
            x:x,
            y:y,
            width: 100,
            height: 100
        }}
        >
            {/* hover하면 created_time, detail 뜨도록 하기  */}
            <div 
            onClick={() => setIsClicked(prev => !prev)}
            className={`peer mb-4 relative p-2 brightness-100 ${isClicked ? 'border border-dashed border-red-400 rounded-md animate-pulse  text-gray-500 active:brightness-75' : ''}`}>
                <img src={ photo_url } alt="" />
                <span>{ sentence }</span>
                </div>            
            {/* 클릭했을 때 수정, 삭제 버튼 */}
            { isClicked ? (
            <div className='font-bold flex space-x-2 justify-center'>
            <button type="button"
            className='hover:text-red-500'
            onClick={() => {setEditState(true)}}>수정</button>
            <span>|</span>
            <button type="button"
            className='hover:text-red-500 hover:ring-2'
            onClick={() => deleteChip(chip_id)}>
                삭제
            </button>                
            </div>
            ) : "" }
            {/* 마우스 올렸을 때 created_time, 상세 내용 나오게 수정 */}
            <div className="invisible relative peer-hover:visible text-xs text-white bg-gray-400 w-1/2 m-auto before:-top-2 before:absolute before:border-l-[8px] before:border-l-transparent before:border-b-[10px] before:border-b-gray-400 before:border-r-[8px] before:border-r-transparent before:mx-[20%] rounded-lg">
                <span className="relative">{ created_time }</span>
            </div>
        </Rnd>
        <br />
        {/* 수정 */}
        <Modal 
        usage='edit'
        notebook_id={+notebook_id.id!}
        isOpen={editState}
        onClose={() => setEditState(false)}
        content={sentence}
        image={photo_url}
        chip_id={chip_id}
        />
        </>
    );
        }