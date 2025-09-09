'use client';

import React from 'react';
import { Lightbulb, MessageCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface SuggestedQuestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({
  suggestions,
  onSuggestionClick,
}) => {
  const quickStarters = [
    "What are the vital signs?",
    "Explain fever symptoms",
    "Common heart conditions",
    "Basic anatomy of lungs",
    "When to see a doctor?",
  ];

  const medicalCategories = [
    { name: 'Symptoms', icon: '🩺', color: 'bg-red-50 border-red-200 text-red-700' },
    { name: 'Diseases', icon: '🏥', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    { name: 'Medications', icon: '💊', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { name: 'Anatomy', icon: '🫁', color: 'bg-green-50 border-green-200 text-green-700' },
  ];

  return (
    <div className="space-y-6">
      {/* Suggested Questions */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-slate-900">Suggested Questions</h3>
        </div>
        <div className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onSuggestionClick(suggestion)}
              className="suggestion-card w-full text-left group"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">
                  {suggestion}
                </p>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 flex-shrink-0 ml-2" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick Starters */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <div className="flex items-center space-x-2 mb-4">
          <MessageCircle className="h-5 w-5 text-primary-500" />
          <h3 className="font-semibold text-slate-900">Quick Starters</h3>
        </div>
        <div className="space-y-2">
          {quickStarters.map((starter, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(starter)}
              className="suggestion-card w-full text-left group"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-700 group-hover:text-slate-900">
                  {starter}
                </p>
                <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Medical Categories */}
      <div className="bg-white rounded-lg border border-slate-200 p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Browse Categories</h3>
        <div className="grid grid-cols-2 gap-2">
          {medicalCategories.map((category, index) => (
            <button
              key={index}
              onClick={() => onSuggestionClick(`Tell me about ${category.name.toLowerCase()}`)}
              className={`p-3 rounded-lg border transition-all hover:scale-105 ${category.color}`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{category.icon}</div>
                <div className="text-xs font-medium">{category.name}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <div className="text-amber-500 text-lg">⚠️</div>
          <div>
            <h4 className="font-semibold text-amber-800 text-sm mb-1">
              Educational Use Only
            </h4>
            <p className="text-xs text-amber-700 leading-relaxed">
              This chatbot provides educational information only. 
              Always consult qualified healthcare professionals for medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
        <h4 className="font-semibold text-primary-800 text-sm mb-2">
          💡 Study Tips
        </h4>
        <ul className="text-xs text-primary-700 space-y-1">
          <li>• Ask specific questions for better responses</li>
          <li>• Use medical terminology to practice</li>
          <li>• Request explanations of complex concepts</li>
          <li>• Ask for related topics to expand learning</li>
        </ul>
      </div>
    </div>
  );
};

export default SuggestedQuestions;