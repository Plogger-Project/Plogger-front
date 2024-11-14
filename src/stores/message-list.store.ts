import { ChatMessage, RoomInvite } from "src/types";
import { create } from "zustand";

interface MessageListStore {
    messageList: (ChatMessage | RoomInvite)[],
    setMessageList: (messageList: (ChatMessage | RoomInvite)[]) => void;
}

const useStore = create<MessageListStore>(set => ({
    messageList: [],
    setMessageList: (messageList: (ChatMessage | RoomInvite)[]) => set(state => ({ ...state, messageList }))
}));

export default useStore;