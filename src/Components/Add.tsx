import { useState } from 'react';
import Modal from './ChipModal';

interface MemoInfo {
    content?: string;
    image?: string;
}

interface propsInfo {
    notebook_id: number;
}

export default function Addbtn(props:propsInfo) {
    const [add, setAdd] = useState(false);

    return (
        <>
        <button
        type="button"
        onClick={() => setAdd(prev => !prev)}
        className="rounded-full px-8 pt-2.5 text-4xl font-medium uppercase leading-normal transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] my-auto font-body "
        data-modal-target="addModal"
        data-modal-toggle="addModal"
        >
            <span>
                ☞ Add here
            {/* <ReactTypingEffect text={["ADD Something"]} /> */}
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