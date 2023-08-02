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
        <>
        <button onClick={() => clickedAdd()}>+</button>
        {add ? (
            <>
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input {...register("content", { required: true })} placeholder="문구 입력" />
                    <button>→</button>
                </form>
            </div>
            </>
        )
        : <></>}
        <ChipList chips={sentenceList} />
        </>
    );

}