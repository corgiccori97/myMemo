import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import { isListChanged } from '../atoms';

interface ModalProps {
    usage: string;
    notebook_id: number;
    isOpen: boolean;
    onClose: () => void;
    content?: string;
    image?: string;
    chip_id?: number;
};

interface MemoInfo {
    content?: string;
    image?: string;
}

const Modal = ({ usage, notebook_id, isOpen, onClose, content, image, chip_id }: ModalProps) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
    } = useForm();
    // image preview
    const [imagePreview, setImagePreview] = useState("");
    // Blob 객체로 바꾼 이미지
    const [convertedImage, setConvertedImage] = useState<Promise<Blob> | null>(null);
    const [isFilled, setIsFilled] = useState("");
    const [, setIsMemoAddedState] = useRecoilState(isListChanged);

    // 이미지 blob 객체로 만들기(데이터베이스용)
    const formImage = watch('image');
    const convertToBlob = (image:File):Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(new Blob([reader.result], {type: image.type}));
                } else {
                    reject(new Error("Failed to convert image to Blob"));
                }
            };
            reader.onerror = (err) => {
                reject(err);
            };
            reader.readAsArrayBuffer(image);
        });
    };

    useEffect(() => {
        if (formImage && formImage.length) {
            const file = formImage[0];
            const convertedImage = convertToBlob(file);
            const imageURL = URL.createObjectURL(file);
            setImagePreview(imageURL);
            setConvertedImage(convertedImage);
        }
    }, [formImage]);

    const onSubmit = async (data:MemoInfo) => {
        // add인지, edit인지 수정 => 일단 add로만
        if (!data.content && !imagePreview) {
            setIsFilled("최소 하나의 필드를 채워주세요.");
        } else {
            // 추가할 경우
            const formData = new FormData();
            formData.append("notebook_id", notebook_id+"");
            if (data.content) {
                formData.append("content", data.content);
            };
            if (convertedImage) {
                formData.append("image", await convertedImage, "image.jpg");
            };
            console.log(formData);
            if (usage === 'add') {
                try {
                    const response = await fetch('http://localhost:3001/add', {
                        method: 'POST',
                        body: formData,
                        credentials:'include',
                    });
                    if (response.ok) {
                        const json = await response.json();
                        reset();
                        setImagePreview("");
                        setIsMemoAddedState(`add ${json.chip_id}`);
                        alert("메모를 추가했어요!");
                    } else {
                        console.error("Error while adding memo");
                        alert("메모 추가 중 오류가 발생했어요");
                    }
                } catch (err) {
                    console.log(err);
                    alert("예상치 못한 오류가 발생했어요");
                }
            }
            // if (usage === 'add') {
            //     try {
            //         const imageBlob = await convertedImage; // Blob 기다렸다가
            //         console.log(imageBlob);
            //         await fetch("http://localhost:3001/add", {
            //             method: "POST",
            //             headers: {
            //                 "Content-Type": "application/json",
            //             },
            //             body: JSON.stringify([notebook_id, data.content, imageBlob]),
            //             credentials: 'include',
            //         })
            //         .then((res) => res.json())
            //         .then((json) => {
            //             if (json) {
            //                 reset();
            //                 setImagePreview("");
            //                 setIsMemoAddedState(`added ${json.chip_id}`);
            //                 alert("메모를 추가했어요!");
                            
            //             }
            //         })
            //     } catch (err) {
            //         console.log(err);
            //         alert("예상치 못한 오류가 발생했습니다.");
            //     }           
            // } 
            // 수정할 경우 
            else if (usage === 'edit') {
                try {
                    const imageBlob = await convertedImage; // Blob 기다렸다가
                    fetch('http://localhost:3001/edit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify([data.content, imageBlob, notebook_id, chip_id])              
                    })
                    .then((res) => {
                        if (res.ok) {
                            alert("메모가 수정되었어요.");
                            setIsMemoAddedState(`edited: ${chip_id}`);
                        }
                    })
                } catch(err) {
                    console.log(err);
                    alert("예상치 못한 오류가 발생했습니다.");
                }
            }
        }
    };

    if (!isOpen) return null;
    return (
        <>
        <div
        id="Modal"
        className="fixed flex left-0 top-0 h-full w-screen p-2 z-[1055] overflow-y-auto overflow-x-hidden outline-none bg-black bg-opacity-50">
            {/* form 컨테이너 */}
            <div 
            className="relative w-1/2 rounded-xl p-5 mx-auto bg-gray-100"
            data-modal-hide="authentication-modal"
            aria-hidden="true"
            aria-labelledby="addModalLabel">
                {/* Modal title: 제목, 닫기 버튼 */}
                <div className="flex mb-2 justify-between"> 
                    {/* 제목 */}
                    <h1
                    className="text-2xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                    id="exampleModalLabel">
                        add your MEMO
                    </h1>
                    {/* X 버튼 */}
                    <button
                    type="button"
                    className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                    data-te-modal-dismiss
                    onClick={onClose}
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
                <textarea
                className="block bg-gray-100 w-full px-0 text-sm text-gray-800 border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                rows={8} 
                {...register("content", { required: false })} placeholder="문구 입력">{ content }</textarea>
                {/* 사진 첨부  / 삭제 아이콘 */}
                <div className='flex justify-end items-center'>
                    <label className="hover:text-lime-600 flex">
                        <input 
                        type="file" 
                        hidden 
                        {...register("image")} />
                        <svg 
                        className="w-6 h-6" 
                        aria-hidden="true" 
                        xmlns="http://www.w3.org/2000/svg" fill="none" 
                        viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
                        </svg>
                    <span>사진 첨부</span>
                    </label>
                    <span className='p-2'>|</span>
                    {/* 사진 삭제 */}
                    <button
                    className='hover:text-lime-600 mr-1 flex'
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
            { isFilled && <span className="text-red-600 text-xs">{ isFilled }</span> }
            </div>
        </div>
        </>
    )
};

export default Modal;