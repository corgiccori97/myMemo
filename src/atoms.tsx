import { atom } from "recoil";

// Chip
export interface IChip {
    content?: string;
    image?: string;
    index: number;
}

export const memoState = atom<IChip[]>({
    key: "unique_content",
    default: [],
});

// 로그인 여부
export const authenticatedState = atom<boolean>({
    key: "authenticated",
    default: false,
});

// 유저 아이디
export const userIdState = atom({
    key: "userIdState",
    default: "",
});

// 메모 리스트 변경됐는지(add, delete) 여부
export const isListChanged = atom<string>({
    key: "memoListState",
    default: "",
})

// 다크모드
export const atomTheme = atom<string>({
    key: "darkMode",
    default: "light",
})