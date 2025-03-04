import React, { useState, useRef, useEffect } from 'react';
import { Bot, Mic } from 'lucide-react';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { Message, ChatState } from './types';
import { getChatCompletion } from './services/openai';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant. Provide concise and accurate responses.'
      },
      {
        role: 'assistant',
        content: 'Hello! I\'m your AI assistant. How can I help you today?'
      }
    ],
    isLoading: false,
    error: null
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = { role: 'user', content };
    
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));

    try {
      // Get all messages for context
      const messages = [...chatState.messages, userMessage];
      
      // Get AI response
      const response = await getChatCompletion(messages);
      
      // Add AI response
      const assistantMessage: Message = { role: 'assistant', content: response };
      
      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false
      }));
    } catch (error) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get response. Please try again.'
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-gray-100 rounded-lg shadow-md flex flex-col h-[80vh]">
        {/* Header */}
        <div className="p-4 border-b flex items-center gap-2">
          <Bot className="text-accent" size={24} />
          <h1 className="text-xl font-semibold">AI Assistant with TTS</h1>
          {/* <p className="text-accent ml-4">Accent test text</p> */}
        </div>
        
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {chatState.messages.filter(m => m.role !== 'system').map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          
          {chatState.isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 p-4 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          {chatState.error && (
            <div className="p-2 mb-4 text-red-500 bg-red-100 rounded">
              {chatState.error}
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={chatState.isLoading} 
        />
      </div>
    </div>
  );
}

export default App;