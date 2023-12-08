import { ReactNode } from 'react';

interface DarkbgProps {
    children: ReactNode;
}

const Darkbg:React.FC<DarkbgProps> = ({ children }) => {
    return (
        <div
        className="fixed flex left-0 top-0 h-full w-screen p-2 z-[1055] overflow-y-auto overflow-x-hidden outline-none bg-black bg-opacity-50">
            {children}
        </div>
    );
};

export default Darkbg;