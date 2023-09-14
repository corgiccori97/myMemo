import { useState } from 'react';
import Draggable from 'react-draggable';
interface ChipProps {
    sentence:string;
    index: number;
}

export function Chip({sentence, index}: ChipProps) {
    const [, setPosition] = useState({ x: 0, y: 0 });
    const trackPosition = (data:any) => {
        setPosition({ x: data.x, y: data.y });
    }
    return (
        <Draggable onDrag={(e, data) => trackPosition(data)}>
            <div>
                <span className="text-xl cursor-pointer">
                    {sentence}
                </span>
            </div>
        </Draggable>

    );
}