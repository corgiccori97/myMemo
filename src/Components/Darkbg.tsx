import { ReactNode, useRef, useState } from 'react';

interface DarkbgProps {
    children: ReactNode;
}

const Darkbg:React.FC<DarkbgProps> = ({ children }) => {
    const [active, setActive] = useState(true);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const isOutsideClicked = (event:any) => {
        console.log(backgroundRef.current);
        console.log(event.target);
        if (backgroundRef.current && (backgroundRef.current === event.target)) {
            setActive(false);
        }
    }
    console.log(backgroundRef);
    if (!active) return null;
    return (
        (active && 
        <div onClick={isOutsideClicked}
        ref={backgroundRef}
        id="background"
        className="fixed flex left-0 top-0 h-full w-screen p-2 z-[1055] overflow-y-auto overflow-x-hidden outline-none bg-black bg-opacity-50">
            {children}
        </div>
        )
    );
};

export default Darkbg;