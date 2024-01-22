import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { atomTheme } from '../atoms';

interface EditMenuProps {
    onCopyClicked: () => void;
    onFlipClicked: (state:boolean) => void;
}

const EditMenu = ({ onCopyClicked, onFlipClicked }:EditMenuProps) => {
    const [flipped, setFlipped] = useState(false);
    const toggleFlipped = () => {
        setFlipped(prev => !prev);
        onFlipClicked(flipped);
    };
    const [open, setOpen] = useState(false);
    const notebook_id = useParams();
    const navigate = useNavigate();
    // 다크모드
    const [theme, setTheme] = useRecoilState(atomTheme);
    const toggleDarkMode = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // 노트북 삭제
    const deleteNotebook = () => {
        if (window.confirm("정말 삭제하시겠어요?")) {
            try {
                fetch('http://localhost:3001/deletenote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify([notebook_id.id]), 
                })
                .then((res) => {
                    if (res.ok) {
                        alert("삭제되었습니다.");
                        navigate("/");
                    }
                })
            } catch(err) {
                console.log(err);
            }
        } 
    };
    return (
        <>
        <div
        className="flex space-x-3 items-center justify-center absolute text-gray-500 rounded-md">
            <button onClick={toggleFlipped}
            className="w-10 h-10 cursor-pointer stamp-effect p-2">
                <svg 
                className=""
                data-slot="icon" 
                fill="none" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"></path>
                </svg>
            </button>
            <button onClick={toggleDarkMode}
            className="w-10 h-10 cursor-pointer stamp-effect p-2">
                {theme === "light" ? (
                    <svg 
                    data-slot="icon" 
                    fill="none"
                    strokeWidth="1" 
                    stroke="currentColor"
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"></path>
                    </svg>
                ) : (
                    <svg 
                    data-slot="icon" fill="none" strokeWidth="1" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"></path>
                    </svg>
                )}
            </button>
            <button className="w-10 h-10 stamp-effect rounded-full z-10 p-2"
            onClick={() => setOpen(prev => !prev)}>
                <svg data-slot="icon" 
                fill="none" 
                strokeWidth="1" 
                stroke="currentColor"
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"></path>
                </svg>
            </button>
            <AnimatePresence>
                { open &&         
                <motion.div 
                initial={{ scaleX: 0, x: '-5%', transformOrigin: 'left center' }}
                animate={{ scaleX: 1, x: '-5%' }}
                exit={{ scaleX: 0, x: '-5%'}}
                transition={{ duration: 0.02 }}
                className="flex justify-center items-center bg-slate-100 bg-opacity-50 text-black font-semibold p-2 ml-2 rounded-full text-sm z-0">
                    <button className="flex self-center items-center stamp-effect hover:text-green-800" onClick={onCopyClicked}>
                    <svg 
                    className="w-4 h-4"
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="1.5" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true">
                    <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z">
                    </path>
                    </svg>
                    <span> 클립보드에 복사하기</span>
                    </button>
                    <span className="mx-5">|</span>
                    <button className="flex items-center hover:text-red-500 stamp-effect" onClick={() => deleteNotebook()}>
                        <svg 
                        className="w-4 h-4 peer"
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="1.5" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0">
                        </path>
                        </svg>
                        현재 노트북 삭제하기
                    </button>
                </motion.div>
                }
            </AnimatePresence>

        </div> 
        </>

    );
};

export default EditMenu;