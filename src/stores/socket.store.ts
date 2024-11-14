import { Socket } from "socket.io-client";
import { socket } from "src/utils";
import { create } from "zustand";

interface SocketStore {
    socket: Socket | null;
    initSocket: (accessToken: string) => void;
}

const useStore = create<SocketStore>(set => (({
    socket: null,
    initSocket: (accessToken: string) => set(state => ({ ...state, socket: socket(accessToken) }))
})));

export default useStore;