export default interface ChatMessage {
    chatId: number;
    senderId: string;
    receiverId: string;
    roomId: number;
    message: string;
    sentAt: string;
}