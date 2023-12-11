import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

const EditMenu = () => {
    const [open, setOpen] = useState(false);
    return (
        <>
        <button className="w-10 h-10 stamp-effect animate-bounce bg-yellow-400 rounded-full z-10"
        onClick={() => setOpen(prev => !prev)}>
            {/* <svg fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"></path>
            </svg> */}
        </button>
        <AnimatePresence>
            { open &&         
            <motion.div 
            initial={{ scaleX: 0, x: '-5%', transformOrigin: 'left center' }}
            animate={{ scaleX: 1, x: '-5%' }}
            exit={{ scaleX: 0, x: '-5%'}}
            transition={{ duration: 0.3 }}
            className="flex justify-center items-center bg-yellow-400 text-black font-bold p-2 rounded-full text-sm z-0">
                <button className="flex self-center items-center stamp-effect hover:text-green-800"
                // onClick={clipboardDownload}
                >
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
                <button className="flex items-center hover:text-red-500 stamp-effect">
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
        </>

    );
};

export default EditMenu;