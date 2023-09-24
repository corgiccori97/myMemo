import { atom } from "recoil";

export interface IChip {
    content?: string;
    image?: string;
    index: number;
}

export const memoState = atom<IChip[]>({
    key: "unique_content",
    default: [],
});