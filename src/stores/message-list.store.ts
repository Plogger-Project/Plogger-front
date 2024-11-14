import { ChatMessage, RoomInvite } from "src/types";
import { create } from "zustand";

interface MessageListStore {
    messageList: ChatMessage[],
    setMessageList: (messageList: ChatMessage[]) => void;
}

const useStore = create<MessageListStore>(set => ({
    messageList: [],
    setMessageList: (messageList: ChatMessage[]) => set(state => ({ ...state, messageList }))
}));

export default useStore;