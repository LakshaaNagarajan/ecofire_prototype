
import { auth } from "@clerk/nextjs/server";
import { ChatService } from "@/lib/services/chat.service";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { chatId: string } }
) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Correctly extract chatId from context.params
    const chatId = context.params.chatId;
    
    const chatService = new ChatService();
    const chatHistory = await chatService.getChatById(userId, chatId);
    
    if (!chatHistory) {
      return new NextResponse(JSON.stringify({ error: "Chat not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    return NextResponse.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
