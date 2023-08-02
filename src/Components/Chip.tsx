import { useDrag } from 'react-dnd';

interface ChipProps {
    sentence:string;
    index: number;
}

export function Chip({sentence, index}: ChipProps) {
    // const [, drag] = useDrag({
    //     type: "DRAGGABLE_CHIP",
    //     item: { index, sentence },
    // });
    return (
        <div 
        // ref={drag}
        className="font-bold text-xl cursor-pointer">
            {sentence}
        </div>
    );
}