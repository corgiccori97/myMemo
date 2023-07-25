export function Chip({sentence} : {sentence: string}) {
    return (
        <div className="Chip">
            <span className="font-bold text-3xl">{sentence}</span>
        </div>
    );
}