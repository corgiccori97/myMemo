import { useState } from 'react';
import Draggable from 'react-draggable';
interface ChipProps {
    sentence?:string;
    index: number;
    photo_url?: string;
}

export function Chip({sentence, index, photo_url}: ChipProps) {
    const [, setPosition] = useState({ x: 0, y: 0 });
    const trackPosition = (data:any) => {
        setPosition({ x: data.x, y: data.y });
    }
    return (
        <Draggable onDrag={(e, data) => trackPosition(data)}>
            <div>
                <img src={photo_url} alt="" />
                <span className="text-xl cursor-pointer">
                    {sentence}
                </span>
            </div>
        </Draggable>

    );
}