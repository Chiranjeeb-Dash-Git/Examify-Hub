import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { Search, Filter, SlidersHorizontal, BookOpen } from 'lucide-react';

export const ExploreQuizzesPage = () => {
  const { quizzes, categories, loading } = useQuiz();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [sortBy, setSortBy] = useState('POPULAR');

  // Filter & Sort Logic
  const filteredQuizzes = quizzes.filter(quiz => {
    // Only published quizzes visible to students
    if (quiz.status !== 'Published') return false;

    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || quiz.categoryId === selectedCategory || quiz.categoryName.toLowerCase() === selectedCategory.toLowerCase();

    const matchesDifficulty =
      selectedDifficulty === 'ALL' || quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    return matchesSearch && matchesCategory && matchesDifficulty;
  }).sort((a, b) => {
    if (sortBy === 'POPULAR') return (b.attemptsCount || 0) - (a.attemptsCount || 0);
    if (sortBy === 'TITLE') return a.title.localeCompare(b.title);
    if (sortBy === 'DURATION') return a.duration - b.duration;
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#10141a] py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore <span className="text-[#38BDF8]">Assessment Archive</span>
          </h1>
          <p className="mt-1 text-sm text-[#88929b] font-mono">
            Browse and initiate specialized evaluation directives
          </p>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#88929b]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search directives or categories..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#181c22] border border-white/10 text-white placeholder-[#88929b]/60 text-sm focus:outline-none focus:border-[#38BDF8] transition-all"
          />
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'ALL'
                ? 'bg-[#38BDF8] text-[#10141a]'
                : 'bg-[#262a31] text-[#bdc8d2] hover:text-white'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#38BDF8] text-[#10141a]'
                  : 'bg-[#262a31] text-[#bdc8d2] hover:text-white'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Difficulty & Sort Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-xs font-mono text-[#88929b]">
            <Filter className="h-3.5 w-3.5 text-[#38BDF8]" />
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="bg-[#262a31] text-white px-3 py-1.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="ALL">All Difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#88929b]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#38BDF8]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#262a31] text-white px-3 py-1.5 rounded-xl border border-white/10 text-xs focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="POPULAR">Most Popular</option>
              <option value="TITLE">Title A-Z</option>
              <option value="DURATION">Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="text-center py-16 text-[#88929b]">Loading quizzes...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <BookOpen className="h-10 w-10 text-[#88929b] mx-auto" />
          <h3 className="text-lg font-bold text-white">No Quizzes Found</h3>
          <p className="text-xs text-[#88929b] max-w-sm mx-auto">
            No assessment matching your current search or filter criteria was found in the archive.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};
