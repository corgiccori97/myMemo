import { atom } from "recoil";

export interface IChip {
    content: string;
    index: number;
}

export const sentenceState = atom<IChip[]>({
    key: "unique_content",
    default: [],
});