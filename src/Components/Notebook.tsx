import { useParams } from 'react-router';
import Addbtn from './Add';
import EditMenu from './EditMenu';
import { useState, useEffect, useRef } from 'react';
import { Chip } from './Chip';
import { useRecoilValue  } from 'recoil';
import { isListChanged } from '../atoms';
import html2canvas from 'html2canvas';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

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
    let backgroundURL = localStorage.getItem('backgroundURL');
    // 헤더 접고 펼 수 있도록(flipped, setFlipped) 구현
    const [flipped, setFlipped] = useState<boolean>(true);
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
    let isChanged = useRecoilValue(isListChanged);
    let [copyClicked, SetCopyClicked] = useState(false);
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
        SetCopyClicked(true);
        if (!divRef.current) return;
        try {
            const div = divRef.current;
            const canvas = await html2canvas(div, {scale: 2});
            canvas.toBlob((blob) => {
                if (blob) {
                    navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
                    alert("클립보드에 복사되었어요!!!");
                    SetCopyClicked(false);
                }
            });
        } catch (err) {
            console.log(err);
        };
    };

    return (
        <>
        <button
        onClick={() => setFlipped(prev => !prev)}
        className="cursor-pointer stamp-effect p-2"
        >
            <svg 
            className="w-4 h-4"
            data-slot="icon" 
            fill="none" 
            strokeWidth="1.5" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"></path>
            </svg>
        </button>
        <AnimatePresence>
            {flipped && 
            <motion.div
            animate={{ scaleY: flipped ? 1 : 0 }}>
                <div className="flex self-center space-x-3">
                    <h1 
                    className="text-4xl font-extrabold"> 
                    {title} 
                    </h1>
                    <EditMenu 
                    onCopyClicked={clipboardDownload} />
                </div>
                <Addbtn notebook_id = { idNumber } />
            </motion.div>
            }
        </AnimatePresence>
        {/* boundary 영역 시작 */}
        <div 
        ref={divRef}
        id="boundary"
        className="grow w-[100%] h-[100%] bg-cover"
        >
            {backgroundURL && 
                <img 
                className="w-[100%] h-[100%] bg-auto"
                src={require(`../assets/${backgroundURL}`)} alt="background" />
            }
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