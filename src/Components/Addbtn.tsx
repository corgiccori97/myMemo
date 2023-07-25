
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { sentenceState } from '../atoms';
import { useRecoilState } from 'recoil';
import { Chip } from './Chip';


export default function Addbtn() {
    const [add, setAdd] = useState(false);
    const { register, watch, handleSubmit, setValue } = useForm();
    const [sentenceList, setSentenceList] = useRecoilState(sentenceState);

    const onSubmit = (data:any) => {
        const newSentence = data.content;
        const newChip = { content: newSentence };
        setAdd(prev => !prev);
        setValue("content", "");
        setSentenceList([...sentenceList, newChip]);
    }

    useEffect(() => {
        console.log(sentenceList);
    }, [sentenceList]);

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
        <ul>
            { sentenceList.map((sentence, index) => (
                <Chip key={index} sentence={sentence.content} />
            ))}
        </ul>
        </>
    );

}