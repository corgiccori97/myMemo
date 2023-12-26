import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Darkbg from './Darkbg';
import { useRecoilState } from 'recoil';
import { isListChanged } from '../atoms';

interface NotebookModalInfo {
    usage: string;
    isOpen: boolean;
    onClose: () => void;
}

interface NotebookInfo {
    title?: string;
    thumbnail?: string;
}

const NotebookModal = ({ usage, isOpen, onClose }:NotebookModalInfo) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
    } = useForm();
    // 모든 필드가 다 채워졌는지 확인용. 아니면 경고메시지 출력
    const [isFilled, setIsFilled] = useState("");
    // 사진 미리보기용 
    const [imagePreview, setImagePreview] = useState("");
    // 사진 데이터용
    const [dataImage, setDataImage] = useState<File | null>(null);
    
    const formImage = watch('thumbnail');
    // recoil
    const [isChanged, SetIsChanged] = useRecoilState(isListChanged);
    console.log(isChanged);

    useEffect(() => {
        if (formImage && formImage.length) {
            const file = formImage[0];
            const imageURL = URL.createObjectURL(file);
            console.log(file, imageURL);
            setImagePreview(imageURL);
            setDataImage(file);
        }
    }, [formImage]);

    const onSubmit = async (data:NotebookInfo) => {
        if (!data.title) {
            setIsFilled("제목을 정해주세요!");
        } else {
            const formData = new FormData();
            formData.append("title", data.title);
            if (dataImage) {
                formData.append("thumbnail", dataImage, "thumbnail.jpg");
            }
            try {
                const response = await fetch('http://localhost:3001/notebook', {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });
                if (response.ok) {
                    const json = await response.json();
                    reset();
                    setImagePreview("");
                    SetIsChanged(`notebook added`);
                    alert("노트북이 추가됐어요!")
                } else {

                    alert("노트북 추가 중 오류가 발생했습니다.");
                }
            } catch(err) {
                console.log(err);
            }
        }
    };

    if (!isOpen) return null;
    return (
        <>
        <Darkbg>
        <div
        className="w-1/2 self-center rounded-xl p-5 mx-auto bg-gray-100">
            <div className="flex mb-2 justify-between">
                {/* 제목 */}
                <h1
                className="text-2xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
                    노트북을 추가하세요 ʕ ๑ •̀ᴗ-ʔ ✧
                </h1>
                {/* X 버튼 */}
                <button
                type="button"
                onClick={onClose}
                className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                data-te-modal-dismiss
                aria-label="Close">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6">
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>                
            </div>
            <hr className="mb-3"/>
            {/* form 시작 */}
            <form onSubmit={handleSubmit(onSubmit)}>
            {/* 사진 */}
            {/* 사진 preview */}
            <img src={imagePreview} alt="" />
            <input
            type="text"
            className="block bg-gray-100 w-full px-0 text-sm text-gray-800 border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
            {...register("title", { 
                required: "*제목을 입력하세요!",
            })} 
            placeholder="노트북 이름" 
            maxLength={20} />
            {/* 사진 첨부  / 삭제 아이콘 */}
            <div className='flex justify-end items-center'>
                <label className="hover:text-yellow-600 flex">
                    <input 
                    type="file" 
                    hidden 
                    {...register("thumbnail")} />
                    <svg 
                    className="w-6 h-6" 
                    aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" fill="none" 
                    viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
                    </svg>
                <span>썸네일 첨부</span>
                </label>
                <span className='p-2'>|</span>
                {/* 사진 삭제 */}
                <button
                className='hover:text-yellow-600 mr-1 flex'
                onClick={() => {setImagePreview("")}}>
                    <svg fill="none" 
                    stroke="currentColor"
                    strokeWidth="1.5" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                    className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                    </svg> 
                <span>사진 삭제</span>
                </button> 
            </div>
            {/* Modal footer: 제출, 닫기 버튼 */}
            <div className="flex mt-2 space-x-1 justify-center items-center">
                {/* 제출 버튼 */}
                <button 
                type="submit"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-400">제출</button>
                {/* 닫기 버튼 */}
                <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-400 ml-2"
                data-te-modal-dismiss
                data-te-ripple-init
                data-te-ripple-color="light">
                닫기
                </button>
            </div>
            </form>          
        </div>
        </Darkbg>
        </>
    );
};

export default NotebookModal;