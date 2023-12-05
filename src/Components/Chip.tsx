import { useEffect, useRef, useState } from 'react';
import { DraggableData, ResizableDelta, Rnd, RndResizeCallback } from 'react-rnd';
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
    onSizeChange: (i:number, size:number, width: string, height: string) => void;
    position?: string;
    font_size?:number;
    element_size: string;
}

export function Chip({sentence, chip_id, index, photo_url, created_time, onPositionChange, onSizeChange, position, font_size, element_size}: ChipProps) {
    let notebook_id = useParams();
    const [isClicked, setIsClicked] = useState(false); 
    const [editState, setEditState] = useState(false); 
    const [, setDeleted] = useRecoilState(isListChanged);
    const [x, y] = (position ? position.split(' ').map(v => Number(v)) : [0, 0]);
    const fontSize = (font_size ? font_size : 16);
    let [width, height] = (element_size ? element_size.split(' ').map(v => parseInt(v, 10)) : [100, 100]);
    console.log(index, width, height, element_size);

    const handlePosition = (e:any, data:DraggableData) => {
        onPositionChange(index, data.x, data.y);
    };

    const handleSize = (e:any, dir:any, ref:HTMLElement, delta:ResizableDelta) => {
        // console.log(ref.style.width, ref.style.height);
        // 폰트 사이즈 deltaRatio에 따라 변경하기
        let newFontSize = 0;
        const deltaRatio = Math.sqrt(
            delta.width * delta.width + delta.height * delta.height
        );
        if (delta.width + delta.height > 0) {
            newFontSize = Math.floor(fontSize + deltaRatio / 5);
        } else {
            newFontSize = Math.floor(fontSize - deltaRatio / 5);
            if (newFontSize < 16) newFontSize = 16;
        }
        onSizeChange(index, newFontSize, ref.style.width, ref.style.height);
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
        // 드래그 멈추면 handlePosition 함수 실행 => 각 chip의 좌표값을 localStorage에 저장(key: chip_id)
        onDragStop={handlePosition}
        onResizeStop={handleSize}
        minWidth={50}
        minHeight={50}
        default={{
            x:x,
            y:y,
            width:width,
            height:height
        }}
        bounds={"#boundary"}
        className={`realtive group mb-4 p-2 ${isClicked ? 'border border-dashed border-red-500 animate-pulse  text-gray-500 active:brightness-65' : ''}`}
        onClick={() => setIsClicked(prev => !prev)}
        >
            { photo_url ? (
            <img 
            className={`w-[${width}px] h-[${height / 2}px]`}
            src={ process.env.PUBLIC_URL + photo_url} alt="" />
            ) : "" }
            <span style={{ fontSize: `${fontSize}px` }}>{sentence}</span>
            {/* 마우스 올렸을 때 created_time, 상세 내용 나오게 수정 */}            
            <div 
            className="invisible group-hover:visible text-xs text-white bg-gray-400 w-1/2 mx-auto mt-2 rounded-lg break-words">
                <span>{ created_time }</span>
            </div>
        {/* 클릭했을 때 수정, 삭제 버튼 */}
        { isClicked ? (
        <div className='font-bold space-x-2 '>
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