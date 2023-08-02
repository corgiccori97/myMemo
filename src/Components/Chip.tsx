import { useState } from 'react';
import Draggable from 'react-draggable';
interface ChipProps {
    sentence:string;
    index: number;
}

export function Chip({sentence, index}: ChipProps) {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const trackPosition = (data:any) => {
        console.log(data);
        setPosition({ x: data.x, y: data.y });
    }
    return (
        <Draggable onDrag={(e, data) => trackPosition(data)}>
            <div className="font-bold text-xl cursor-pointer">
                {sentence}
            </div>
        </Draggable>

    );
}