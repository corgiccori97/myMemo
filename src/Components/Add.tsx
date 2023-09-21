import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sentenceState } from '../atoms';
import { useRecoilState } from 'recoil';
import ChipList from './ChipList';

interface MemoInfo {
    content?: string;
    image?: string;
}
export default function Addbtn() {
    const [add, setAdd] = useState(false);
    const [imagePreview, SetImagePreview] = useState("");
    const { 
        register, 
        handleSubmit, 
        watch,
        reset
    } = useForm();
    const [sentenceList, setSentenceList] = useRecoilState(sentenceState);

    const onSubmit = async (data:MemoInfo) => {
        try {
            const res = await fetch("http://localhost:3001/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify([data, imagePreview]),
            })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
            });
        }
        catch (err) {
            console.log(err);
        }
        reset();
        setAdd(false);
    };

    const clickedAdd = () => setAdd(prev => !prev);
    const image = watch("image");
    useEffect(() => {
        if (image && image.length) {
            const file = image[0];
            SetImagePreview(URL.createObjectURL(file));
        }
    }, [image])

    return (
        <div>
        <button
        type="button"
        onClick={() => clickedAdd()}
        className="rounded bg-primary px-6 pb-2 pt-2.5 text-6xl font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] text-blue-200 font-body"
        data-modal-target="addModal"
        data-modal-toggle="addModal"
        >
            ADDDDDDDDDD SOMETHING
        </button>
        {add ? (
            // 배경
            <div
            id="addModal"
            className="fixed left-0 top-0 h-full w-screen p-2 z-[1055] overflow-y-auto overflow-x-hidden outline-none bg-slate-50 opacity-90">
                {/* form 컨테이너 */}
                <div 
                className="w-1/2 h-3/4 rounded-xl m-auto justify-center items-center z-10 p-5 bg-[#fffffb]"
                data-modal-hide="authentication-modal"
                aria-hidden="true"
                aria-labelledby="addModalLabel">
                    {/* Modal title: 제목, 닫기 버튼 */}
                    <div className="flex mb-2"> 
                        {/* 제목 */}
                        <h5
                        className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                        id="exampleModalLabel">
                            add your MEMO
                        </h5>
                        {/* X 버튼 */}
                        <button
                        type="button"
                        className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                        data-te-modal-dismiss
                        onClick={() => setAdd(prev => !prev)}
                        aria-label="Close">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className="h-6 w-6">
                            <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        </button>
                    </div>
                    <hr className="mb-3"/>
                    {/* Modal body: 입력 */}
                    <form onSubmit={handleSubmit(onSubmit)} id="chipForm">
                        {/* 사진 */}
                        {/* 사진 삽입 이루어졌을 때 / default */}
                        <img src={imagePreview} alt="" />
                        <textarea 
                        className="block w-full px-0 text-sm text-gray-800 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" 
                        rows={8} 
                        required
                        {...register("content", { required: true })} placeholder="문구 입력" />
                        {/* Modal footer: 제출, 닫기 버튼 */}
                        <div className="flex mt-2">
                            {/* 제출 버튼 */}
                            <button className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-400">제출</button>
                            {/* 닫기 버튼 */}
                            <button
                            type="button"
                            onClick={() => setAdd(prev => !prev)}
                            className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-300 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-400 ml-2"
                            data-te-modal-dismiss
                            data-te-ripple-init
                            data-te-ripple-color="light">
                            닫기
                            </button>
                            {/* 사진 첨부  */}
                            <label>
                                <input type="file" hidden 
                                {...register("image")} />
                                <svg 
                                className="w-6 h-6" 
                                aria-hidden="true" 
                                xmlns="http://www.w3.org/2000/svg" fill="none" 
                                viewBox="0 0 24 24">
                                            <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5" d="M1 6v8a5 5 0 1 0 10 0V4.5a3.5 3.5 0 1 0-7 0V13a2 2 0 0 0 4 0V6"/>
                                </svg>
                            </label>
                            {/* 사진 삭제 아이콘 */}
                            <button onClick={() => {
                                SetImagePreview("");
                            }}>
                            <svg fill="none" 
                            stroke="currentColor"
                            stroke-width="1.5" 
                            viewBox="0 0 24 24" 
                            xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                            className="w-6 h-6">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg> 
                            </button> 
                        </div>
                    </form>
                </div>
            </div>
        )
        : null}
        <ChipList chips={sentenceList} />
        </div>
    );

}