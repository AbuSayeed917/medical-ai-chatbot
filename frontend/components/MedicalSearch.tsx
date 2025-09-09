'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Book, Clock, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

interface MedicalTerm {
  _id: string;
  term: string;
  category: string;
  definition: string;
  description?: string;
  synonyms?: string[];
  relatedTerms?: string[];
  severity?: string;
  medicalSpecialty?: string[];
  isVerified: boolean;
  lastUpdated: string;
}

const MedicalSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState<MedicalTerm[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'symptom', label: 'Symptoms' },
    { value: 'disease', label: 'Diseases' },
    { value: 'medication', label: 'Medications' },
    { value: 'anatomy', label: 'Anatomy' },
    { value: 'procedure', label: 'Procedures' },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'symptom':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'disease':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medication':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'anatomy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'procedure':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const params: any = { query: searchQuery };
      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      const response = await axios.get('/api/medical/search', { params });
      setSearchResults(response.data);
      
      if (response.data.length === 0) {
        toast.error('No results found. Try different keywords.');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Knowledge Search</h1>
        <p className="text-slate-600">
          Search our comprehensive database of medical terms, conditions, and concepts
        </p>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for symptoms, diseases, medications, anatomy..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-slate-500" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isLoading}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-colors',
              searchQuery.trim() && !isLoading
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-slate-300 text-slate-500 cursor-not-allowed'
            )}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Results List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <AnimatePresence>
              {searchResults.map((term, index) => (
                <motion.div
                  key={term._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedTerm(term)}
                  className={cn(
                    'bg-white border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md',
                    selectedTerm?._id === term._id
                      ? 'border-primary-300 shadow-md'
                      : 'border-slate-200'
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900 capitalize">
                      {term.term}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {term.isVerified && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      <span className={cn(
                        'px-2 py-1 text-xs font-medium rounded-full border',
                        getCategoryColor(term.category)
                      )}>
                        {term.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm line-clamp-2 mb-2">
                    {term.definition}
                  </p>

                  {term.severity && (
                    <span className={cn(
                      'inline-block px-2 py-1 text-xs font-medium rounded-full',
                      getSeverityColor(term.severity)
                    )}>
                      {term.severity} severity
                    </span>
                  )}

                  <div className="flex items-center text-xs text-slate-500 mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    Updated {new Date(term.lastUpdated).toLocaleDateString()}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {searchResults.length === 0 && !isLoading && searchQuery && (
            <div className="text-center py-12">
              <Book className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No results found</h3>
              <p className="text-slate-600">
                Try different keywords or broaden your search criteria.
              </p>
            </div>
          )}
        </div>

        {/* Detailed View */}
        <div className="lg:sticky lg:top-6">
          {selectedTerm ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border border-slate-200 rounded-lg p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 capitalize mb-1">
                    {selectedTerm.term}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full border',
                      getCategoryColor(selectedTerm.category)
                    )}>
                      {selectedTerm.category}
                    </span>
                    {selectedTerm.isVerified && (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* Definition */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Definition</h3>
                  <p className="text-slate-700">{selectedTerm.definition}</p>
                </div>

                {/* Description */}
                {selectedTerm.description && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Description</h3>
                    <p className="text-slate-700">{selectedTerm.description}</p>
                  </div>
                )}

                {/* Synonyms */}
                {selectedTerm.synonyms && selectedTerm.synonyms.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Synonyms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.synonyms.map((synonym, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm"
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Related Terms */}
                {selectedTerm.relatedTerms && selectedTerm.relatedTerms.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Related Terms</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.relatedTerms.map((term, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm cursor-pointer hover:bg-primary-100"
                          onClick={() => setSearchQuery(term)}
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Specialty */}
                {selectedTerm.medicalSpecialty && selectedTerm.medicalSpecialty.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Medical Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedTerm.medicalSpecialty.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-secondary-50 text-secondary-700 rounded text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Severity */}
                {selectedTerm.severity && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Severity Level</h3>
                    <span className={cn(
                      'px-3 py-1 text-sm font-medium rounded-full',
                      getSeverityColor(selectedTerm.severity)
                    )}>
                      {selectedTerm.severity}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
              <Book className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Select a term</h3>
              <p className="text-slate-600">
                Click on a search result to view detailed information.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalSearch;