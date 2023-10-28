import { useState } from 'react';
import { Rnd } from 'react-rnd';
import { useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { isListChanged } from '../atoms';

interface ChipProps {
    sentence?:string;
    index: number;
    photo_url?: string;
    created_time: string;
}

interface PositionProps {
    x: number;
    y: number;
}

interface SizeProps {
    width: number;
    height: number;
}

export function Chip({sentence, index, photo_url, created_time}: ChipProps) {
    const [isClicked, setIsClicked] = useState(false); 
    const [, SetDeleted] = useRecoilState(isListChanged);
    let notebook_id = useParams();
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
                    SetDeleted(`deleted:${chip_id}`)
                }
            })
        } catch(err) {
            alert(err);
        }
    };

    return (
        <>
        <Rnd
        default={{
            x: 0,
            y: 0,
            width: 300,
            height: 300,
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
            className='hover:text-red-500'>수정</button>
            <span>|</span>
            <button type="button"
            className='hover:text-red-500 hover:ring-2'
            onClick={() => deleteChip(index)}>
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
        </>
    );
}