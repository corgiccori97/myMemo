import { Chip } from './Chip';

interface ChipListProps {
    chips: { index: number; content: string; }[];
}

const ChipList:React.FC<ChipListProps> = ({ chips }) => {
    return (
        <>
        {chips.map((chip) => (
            <Chip key={chip.index} 
            index={chip.index} 
            sentence={chip.content} />
        ))}
        </>
    );
};

export default ChipList;