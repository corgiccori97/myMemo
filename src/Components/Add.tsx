import { useState } from 'react';
import Modal from './ChipModal';

interface MemoInfo {
    content?: string;
    image?: string;
}

interface propsInfo {
    notebook_id: number;
    text: string;
}

export default function Addbtn(props:propsInfo) {
    const [add, setAdd] = useState(false);

    return (
        <>
        <button
        type="button"
        onClick={() => setAdd(prev => !prev)}
        className="rounded-full px-8 pt-2.5 text-4xl font-medium uppercase leading-normal my-auto font-body flex-none stamp-effect"
        data-modal-target="addModal"
        data-modal-toggle="addModal"
        >
            <span>
                {props.text}
            </span>
        </button>
        <Modal 
        usage='add'
        notebook_id={props.notebook_id}
        isOpen={add} 
        onClose={() => setAdd(false) }
        content=""
        image=""
        />
        </>
    );
};