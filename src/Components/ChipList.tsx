import { Chip } from './Chip';

interface ChipListProps {
    chips: { index: number; content: string; image: string; }[];
}

const ChipList:React.FC<ChipListProps> = ({ chips }) => {
    return (
        <>
        {/* {chips.map((chip) => (
            <Chip key={chip.index} 
            index={chip.index} 
            sentence={chip.content}
            photo_url={chip.image} />
        ))} */}
        </>
    );
};

export default ChipList;