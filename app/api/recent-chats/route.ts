
import { auth } from "@clerk/nextjs/server";
import { ChatService } from "@/lib/services/chat.service";
import { NextResponse } from "next/server";

export async function GET() {
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

    const chatService = new ChatService();
    const recentChats = await chatService.getRecentChats(userId, 3);
    
    return NextResponse.json(recentChats);
  } catch (error) {
    console.error("Error fetching recent chats:", error);
    return new NextResponse(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
