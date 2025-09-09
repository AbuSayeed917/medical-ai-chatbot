'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Brain, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import SuggestedQuestions from './SuggestedQuestions';
import { useChat } from '../contexts/ChatContext';
import { cn } from '../lib/utils';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    messages,
    isLoading,
    sendMessage,
    clearChat,
    suggestions,
  } = useChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (msg = message) => {
    if (!msg.trim() || isLoading) return;
    
    await sendMessage(msg);
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <div className="chat-container">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-lg">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Brain className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">MedBot Assistant</h2>
                <p className="text-sm text-primary-100">Your medical education companion</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 chat-messages bg-gradient-to-b from-slate-50 to-white">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="bg-primary-100 p-4 rounded-full mb-4">
                  <Brain className="h-12 w-12 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  Welcome to MedBot!
                </h3>
                <p className="text-slate-600 mb-4 max-w-md">
                  I'm here to help you learn about basic health issues and medical concepts.
                  Ask me anything about symptoms, diseases, anatomy, or medications.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    Educational Purpose Only
                  </span>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    Not Medical Advice
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {messages.map((msg, index) => (
                    <MessageBubble
                      key={index}
                      message={msg}
                      isUser={msg.role === 'user'}
                    />
                  ))}
                </AnimatePresence>
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center space-x-3 text-slate-600"
                  >
                    <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-md">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5 text-primary-600" />
                        <div className="loading-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <span className="text-sm">MedBot is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-200 bg-white rounded-b-lg">
            <div className="flex items-end space-x-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={handleTextareaChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about symptoms, diseases, anatomy, medications..."
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-xl resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  rows={1}
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={() => handleSendMessage()}
                disabled={!message.trim() || isLoading}
                className={cn(
                  'p-3 rounded-xl transition-colors',
                  message.trim() && !isLoading
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                )}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions Sidebar */}
      <div className="lg:col-span-1">
        <SuggestedQuestions
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </div>
  );
};

export default ChatInterface;