import { ChatRoom } from "src/types";
import { create } from "zustand";

interface RoomListStore {
    roomList: ChatRoom[];
    setRoomList: (roomList: ChatRoom[]) => void;
}

const useStore = create<RoomListStore>(set => ({
    roomList: [],
    setRoomList: (roomList: ChatRoom[]) => set(state => ({ ...state, roomList }))
}));

export default useStore;