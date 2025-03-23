
import { NextResponse } from 'next/server';
import { ChatService } from '@/lib/services/chat.service';
import { auth } from '@clerk/nextjs/server';

export async function GET(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Use await when accessing params in Next.js 15
    const chatId = params.chatId;
    
    const chatService = new ChatService();
    const chatHistory = await chatService.getChatById(userId, chatId);
    
    if (!chatHistory) {
      return NextResponse.json(
        { success: false, error: 'Chat not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: chatHistory
    });
  } catch (error) {
    console.error('Error in GET /api/chat-history/[chatId]:', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
