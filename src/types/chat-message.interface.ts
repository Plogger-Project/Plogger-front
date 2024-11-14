export default interface ChatMessage {
    chatId: number;
    senderId: string;
    roomId: number | string;
    message: string;
    sentAt: string;
    isRead: boolean;
}