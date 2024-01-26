import type { ChipProps } from './Chip';
import Darkbg from './Darkbg';

interface ListedChipsInterface {
    isOpen: boolean;
    chipList?: any;
}

const ListedChips = ({ isOpen, chipList }: ListedChipsInterface) => {
    if (!isOpen) return null;
    console.log(chipList);
    return (
        <>
        <Darkbg>
            <div 
            className="text-xl block m-auto place-self-center bg-slate-200 bg-opacity-90 rounded-md">
            <table className="text-base text-left text-gray-500 rounded-md w-full table-fixed">
                <thead>
                    <tr className="font-bold text-gray-900 whitespace-nowrap dark:text-white">
                        <th className="w-1/3 px-6 py-2">CONTENT</th>
                        <th className="w-1/3 px-6 py-2">DETAIL</th>
                        <th className="w-1/6 px-6 py-2">CREATED AT</th>
                        <th className="w-1/6 px-6 py-2">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {chipList.map((chip: ChipProps) => (
                        <tr key={chip.chip_id} className="bg-white border-b-2 dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{chip.content}</td>
                            <td className="px-6 py-4">{chip.detail_content}</td>
                            <td className="px-6 py-4">{chip.created_time.split(".")[0]}</td>
                            <td className="px-6 py-4">
                                <button>수정</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </Darkbg>
        </>
    );
};

export default ListedChips;