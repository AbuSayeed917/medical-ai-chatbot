'use client';

import React from 'react';
import { User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
  metadata?: {
    category?: string;
    confidence?: number;
    medicalTerms?: string[];
    relatedTopics?: string[];
  };
}

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isUser }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'symptom':
        return 'category-symptom';
      case 'disease':
        return 'category-disease';
      case 'medication':
        return 'category-medication';
      case 'anatomy':
        return 'category-anatomy';
      default:
        return 'category-general';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start space-x-3',
        isUser ? 'flex-row-reverse space-x-reverse' : ''
      )}
    >
      {/* Avatar */}
      <div className={cn(
        'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
        isUser 
          ? 'bg-primary-600 text-white' 
          : 'bg-secondary-600 text-white'
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        'message-bubble',
        isUser ? 'message-user' : 'message-bot'
      )}>
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <div>
            <ReactMarkdown
              className="prose prose-sm max-w-none"
              components={{
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0 text-sm leading-relaxed">
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-slate-900">
                    {children}
                  </strong>
                ),
                em: ({ children }) => (
                  <em className="italic">
                    {children}
                  </em>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-1 my-2">
                    {children}
                  </ul>
                ),
                li: ({ children }) => (
                  <li className="text-sm">
                    {children}
                  </li>
                ),
                code: ({ children }) => (
                  <code className="medical-term">
                    {children}
                  </code>
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>

            {/* Metadata */}
            {message.metadata && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="flex flex-wrap gap-1">
                  {message.metadata.category && (
                    <span className={cn(
                      'medical-category',
                      getCategoryColor(message.metadata.category)
                    )}>
                      {message.metadata.category}
                    </span>
                  )}
                  {message.metadata.relatedTopics?.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="medical-category category-general"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Timestamp */}
        <div className={cn(
          'mt-2 text-xs opacity-60',
          isUser ? 'text-right' : 'text-left'
        )}>
          {new Date(message.timestamp || Date.now()).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;