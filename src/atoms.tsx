import { atom } from "recoil";

export interface IChip {
    sentence: string;
}

export const sentenceState = atom<IChip[]>({
    key: "sentence",
    default: [],
});