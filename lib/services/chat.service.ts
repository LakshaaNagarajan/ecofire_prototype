
import dbConnect from "../mongodb";
import Chat, { ChatMessage } from "../models/chat.model";

export class ChatService {
  async saveChatHistory(userId: string, chatId: string, messages: ChatMessage[]) {
    await dbConnect();
    
    const chat = await Chat.findOne({ userId, chatId });
    if (chat) {
      chat.messages = messages;
      chat.updatedAt = new Date();
      return await chat.save();
    }
    
    return await Chat.create({
      userId,
      chatId,
      messages,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
}
