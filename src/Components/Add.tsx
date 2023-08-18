import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { sentenceState } from '../atoms';
import { useRecoilState } from 'recoil';
import ChipList from './ChipList';

export default function Addbtn() {
    const [add, setAdd] = useState(false);
    const { register, handleSubmit, setValue } = useForm();
    const [sentenceList, setSentenceList] = useRecoilState(sentenceState);
    let chipNumber = 0;

    const onSubmit = (data:any) => {
        const newSentence = data.content;
        const newChip = { content: newSentence, index: chipNumber };
        chipNumber += 1;
        setValue("content", "");
        setSentenceList([...sentenceList, newChip]);
    }

    const clickedAdd = () => setAdd(prev => !prev);
    return (
        <div>
        <button
        type="button"
        onClick={() => clickedAdd()}
        // shadow-[0_4px_9px_-4px_#3b71ca]
        className="rounded bg-primary px-6 pb-2 pt-2.5 text-6xl font-medium uppercase leading-normal text-yellow-300 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] font-body"
        data-te-toggle="modal"
        data-te-target="addModal"
        data-te-ripple-init
        data-te-ripple-color="light"
        >
            + Add your memo, or everything +
        </button>
        {add ? (
            // 배경
            <div
            className="fixed left-0 top-0 h-full w-screen p-2 z-[1055] overflow-y-auto overflow-x-hidden outline-none bg-slate-50 opacity-90">
                {/* form 컨테이너 */}
                <div 
                id="addModal"
                className="w-1/2 h-3/4 rounded-xl m-auto justify-center items-center z-10 p-5 bg-[#fffffb]"
                data-modal-hide="authentication-modal"
                data-te-backdrop="static"
                data-te-keyboard="false"
                tabIndex={-1}
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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input className="bg-transparent px-2 py-1"
                        {...register("content", { required: true })} placeholder="문구 입력" />
                        {/* Modal footer: 제출, 닫기 버튼 */}
                        <div className="flex mt-2">
                            {/* 제출 버튼 */}
                            <button>제출</button>
                            {/* 닫기 버튼 */}
                            <button
                            type="button"
                            onClick={() => setAdd(prev => !prev)}
                            className="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                            data-te-modal-dismiss
                            data-te-ripple-init
                            data-te-ripple-color="light">
                            닫기
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