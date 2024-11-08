import { create } from "zustand";

interface SearchStore {
    searchWord: string;
    setSearchWord: (searchWord: string) => void;
}

const useStore = create<SearchStore>(set => ({
    searchWord: '',
    setSearchWord: (searchWord: string) => set(state => ({ ...state, searchWord }))
}));

export default useStore;