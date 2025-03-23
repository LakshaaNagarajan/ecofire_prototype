
'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';

interface ChatSession {
  _id: string;
  userId: string;
  chatId: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export default function Chat() {
  const [missionStatement, setMissionStatement] = useState('');
  const [recentChats, setRecentChats] = useState<ChatSession[]>([]);
  const { userId } = useAuth();

  const {
    error,
    input,
    status,
    handleInputChange,
    handleSubmit,
    messages,
    reload,
    stop,
  } = useChat({
    body: { missionStatement },
    onFinish(message, { usage, finishReason }) {
      console.log('Usage', usage);
      console.log('FinishReason', finishReason);
      fetchRecentChats(); // Refresh chats after a new chat is completed
    },
  });

  const fetchRecentChats = async () => {
    if (!userId) return;
    
    try {
      const response = await fetch('/api/recent-chats');
      if (response.ok) {
        const data = await response.json();
        setRecentChats(data);
      }
    } catch (error) {
      console.error('Error fetching recent chats:', error);
    }
  };

  useEffect(() => {
    fetchRecentChats();
  }, [userId]);

  // Get a preview of the conversation (first user message and assistant response)
  const getChatPreview = (chat: ChatSession) => {
    const userMessage = chat.messages.find(m => m.role === 'user')?.content || 'No message';
    const aiResponse = chat.messages.find(m => m.role === 'assistant')?.content || 'No response';
    
    return {
      userMessage: userMessage.length > 60 ? `${userMessage.substring(0, 60)}...` : userMessage,
      aiResponse: aiResponse.length > 60 ? `${aiResponse.substring(0, 60)}...` : aiResponse,
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="flex flex-col w-full max-w-4xl pb-48 py-24 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Jija Assistant</h1>
      
      {/* Recent Chats Section */}
      {recentChats.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Conversations</h2>
          <div className="grid grid-cols-1 gap-4">
            {recentChats.map((chat) => {
              const preview = getChatPreview(chat);
              return (
                <div key={chat._id} className="border rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-500">
                      {formatDate(chat.updatedAt)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-medium">You: </span>
                    <span>{preview.userMessage}</span>
                  </div>
                  <div>
                    <span className="font-medium">Jija: </span>
                    <span>{preview.aiResponse}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Chat Section */}
      <div className="flex flex-col w-full stretch">
        {messages.map(m => (
          <div key={m.id} className="whitespace-pre-wrap mb-4 p-3 rounded-lg bg-gray-50">
            <span className="font-medium">{m.role === 'user' ? 'You: ' : 'Jija: '}</span>
            {m.content}
          </div>
        ))}

        {(status === 'submitted' || status === 'streaming') && (
          <div className="mt-4 text-gray-500">
            {status === 'submitted' && <div>Loading...</div>}
            <button
              type="button"
              className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
              onClick={stop}
            >
              Stop
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <div className="text-red-500">An error occurred.</div>
            <button
              type="button"
              className="px-4 py-2 mt-4 text-blue-500 border border-blue-500 rounded-md"
              onClick={() => reload()}
            >
              Retry
            </button>
          </div>
        )}

        <div className="fixed bottom-0 w-full max-w-4xl mb-8">
          <input
            className="w-full p-2 mb-2 border border-gray-300 rounded shadow-xl"
            value={missionStatement}
            placeholder="What is your mission statement?"
            onChange={(e) => setMissionStatement(e.target.value)}
          />
          <form onSubmit={handleSubmit}>
            <input
              className="w-full p-2 border border-gray-300 rounded shadow-xl"
              value={input}
              placeholder="Ask Jija something..."
              onChange={handleInputChange}
              disabled={status !== 'ready'}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
