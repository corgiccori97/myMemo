import { ElementRef, useState } from 'react';
import Draggable, { DraggableData, DraggableEvent, DraggableEventHandler } from 'react-draggable';
import { Rnd } from 'react-rnd';

interface ChipProps {
    sentence?:string;
    index: number;
    photo_url?: string;
    created_time: string;
}

interface PositionProps {
    x: number;
    y: number;
}

interface SizeProps {
    width: number;
    height: number;
}

export function Chip({sentence, index, photo_url, created_time}: ChipProps) {
    // const [position, setPosition] = useState<PositionProps>({ x: 0, y: 0 });
    // const [size, setSize] = useState<SizeProps>({ width: 100, height: 100 });

    // const handleDrag = (e:DraggableEvent, data:DraggableData) => {
    //     setPosition({ x: data.x, y: data.y });
    // }
    // const handleResize = (e:DraggableEvent, ref:any, position:any) => {
    //     console.log(ref);
    //     setSize({
    //         width: +ref.style.width,
    //         height: +ref.style.height,
    //     });
    // };

    return (
        <>
        <Rnd
        default={{
            x: 0,
            y: 0,
            width: 300,
            height: 100,
        }}
        className="hover:"
        >
            <img src={ photo_url } alt="" />
            <span>{ sentence }</span>
            {/* hover하면 created_time, detail 뜨도록 하기  */}
            <span className="invisible">{ created_time }</span>
        </Rnd>
        <br />
        </>
    );
}