'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    confidence?: number;
    category?: string;
    medicalTerms?: string[];
    relatedTopics?: string[];
  };
}

interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  sessionId: string;
  suggestions: string[];
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => Promise<void>;
  loadChatHistory: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => 
    'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  );
  const [suggestions, setSuggestions] = useState<string[]>([
    "What are the vital signs and their normal ranges?",
    "Explain the difference between acute and chronic conditions",
    "What is the basic approach to patient history taking?",
    "Describe common symptoms of cardiovascular disease",
    "What are the main functions of the respiratory system?"
  ]);

  const sendMessage = useCallback(async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageContent,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: messageContent,
        userId: 'user_' + sessionId,
        sessionId
      });

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(),
        metadata: response.data.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      if (response.data.suggestions) {
        setSuggestions(response.data.suggestions);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
      
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const clearChat = useCallback(async () => {
    try {
      await axios.delete(`/api/chat/history/${sessionId}`);
      setMessages([]);
      setSuggestions([
        "What are the vital signs and their normal ranges?",
        "Explain the difference between acute and chronic conditions",
        "What is the basic approach to patient history taking?",
        "Describe common symptoms of cardiovascular disease",
        "What are the main functions of the respiratory system?"
      ]);
      toast.success('Chat history cleared');
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error('Failed to clear chat history');
    }
  }, [sessionId]);

  const loadChatHistory = useCallback(async () => {
    try {
      const response = await axios.get(`/api/chat/history/${sessionId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  }, [sessionId]);

  const value: ChatContextType = {
    messages,
    isLoading,
    sessionId,
    suggestions,
    sendMessage,
    clearChat,
    loadChatHistory
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};