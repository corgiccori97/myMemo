import { useParams } from 'react-router';
import Addbtn from './Add';
import { useState, useEffect, useRef } from 'react';
import { Chip } from './Chip';
import { useRecoilValue } from 'recoil';
import { isListChanged } from '../atoms';
import html2canvas from 'html2canvas';

interface ChipProps {
    content?: string; 
    photo_url?: string;
    chip_id: number;
    index: number;
    created_time: string;
    onPositionChange?: (i:number, x:number, y:number) => void;
    onSizeChange?: (i:number, font:number, width: string, height: string) => void;
}

const Notebook = () => {
    // 로컬스토리지에 저장된 notebook 제목
    const title = localStorage.getItem('title');
    // id 이용해서 memochip들 가져오기
    let { id }= useParams();
    const idNumber = parseInt(id!);
    const [chips, setChips] = useState<ChipProps[]>([]);
    // 좌표
    const [positions, setPositions] = useState<string[]>([]);
    // 엘리먼트 사이즈
    const [elementSizes, setElementSizes] = useState<string[]>([]);
    // 폰트 사이즈
    const [fontSizes, setFontSizes] = useState<string[]>([]);
    // recoil
    const isChanged = useRecoilValue(isListChanged);
    let chipNumber = 0;

    //로컬스토리지에 저장된 chip 좌표 불러오기
    useEffect(() => {
        let chipPositions = localStorage.getItem('position_chip');
        let fontSizes = localStorage.getItem('font_size_chip');
        let elementSizes = localStorage.getItem('element_size_chip');
        if (chipPositions) {
            setPositions(JSON.parse(chipPositions));
        }
        if (fontSizes) {
            setFontSizes(JSON.parse(fontSizes));
        }
        if (elementSizes) {
            setElementSizes(JSON.parse(elementSizes));
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

    // 좌표 설정
    const handlePositionChange = (index:number, x:number, y:number) => {
        let dummyPosition = [...positions];
        dummyPosition[index] = `${x} ${y}`;
        setPositions(dummyPosition);
        localStorage.setItem('position_chip', JSON.stringify(positions));
    };

    // 크기 설정
    const handleSizeChange = (index:number, size:number, width: string, height: string) => {
        let dummyFontSize = [...fontSizes];
        let dummyElementSize = [...elementSizes];
        dummyFontSize[index] = size + "";
        dummyElementSize[index] = `${width} ${height}`;
        setFontSizes(dummyFontSize);
        setElementSizes(dummyElementSize);
        localStorage.setItem('font_size_chip', JSON.stringify(fontSizes));
        localStorage.setItem('element_size_chip', JSON.stringify(elementSizes));
    };

    // 클립보드 저장
    const divRef = useRef<HTMLDivElement>(null);
    const clipboardDownload = async () => {
        if (!divRef.current) return;
        try {
            const div = divRef.current;
            const canvas = await html2canvas(div, {scale: 2});
            canvas.toBlob((blob) => {
                if (blob) {
                    navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                    alert("클립보드에 복사되었어요!!!");
                }
            });
        } catch (err) {

        };
    };

    return (
        <>
        <h1 className="text-4xl font-extrabold flex-none"> {title} </h1>
        <Addbtn notebook_id = { idNumber } />
        <button
        className="flex self-center mr-5 items-center"
        onClick={clipboardDownload}>
        <svg 
        className="w-10 h-100"
        fill="none" 
        stroke="currentColor"
        strokeWidth="1.5" 
        viewBox="0 0 24 24" 
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true">
        <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"></path>
        </svg>
        <span>클립보드에 복사하기</span>
        </button>
        {/* boundary 영역 시작 */}
        <div 
        ref={divRef}
        id="boundary"
        className="grow">
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
                    onSizeChange={handleSizeChange}
                    position={positions[chip.index]}
                    font_size={Number(fontSizes[chip.index])}
                    element_size={elementSizes[chip.index]}
                    />
                </li>
            ))}
            </ul>
        </div>
        </>
    ); 
}

export default Notebook;