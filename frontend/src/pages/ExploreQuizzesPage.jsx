import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { Search, Gamepad2, SearchX, SlidersHorizontal, X } from 'lucide-react';

export const ExploreQuizzesPage = () => {
  const { quizzes, categories, loading } = useQuiz();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedDuration, setSelectedDuration] = useState('ALL');
  const [sortBy, setSortBy] = useState('POPULAR');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort Logic
  const filteredQuizzes = quizzes.filter(quiz => {
    // Only published quizzes visible to students
    if (quiz.status !== 'Published') return false;

    const matchesSearch =
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (quiz.categoryName && quiz.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      quiz.categoryId === selectedCategory ||
      (quiz.categoryName && quiz.categoryName.toLowerCase() === selectedCategory.toLowerCase());

    const matchesDifficulty =
      selectedDifficulty === 'ALL' ||
      quiz.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesDuration =
      selectedDuration === 'ALL' ||
      (selectedDuration === 'short' && quiz.duration <= 10) ||
      (selectedDuration === 'medium' && quiz.duration > 10 && quiz.duration <= 30) ||
      (selectedDuration === 'long' && quiz.duration > 30);

    return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
  }).sort((a, b) => {
    if (sortBy === 'POPULAR') return (b.attemptsCount || 0) - (a.attemptsCount || 0);
    if (sortBy === 'TITLE') return a.title.localeCompare(b.title);
    if (sortBy === 'DURATION') return a.duration - b.duration;
    return 0;
  });

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const activeFilterCount = [
    selectedCategory !== 'ALL',
    selectedDifficulty !== 'ALL',
    selectedDuration !== 'ALL',
    sortBy !== 'POPULAR'
  ].filter(Boolean).length;

  return (
    <HudPlayerLayout>
      {/* ── HERO HEADER (COMPACT) ── */}
      <header className="relative mb-6">
        <div className="flex items-center gap-4 mb-2">
          <div style={{ height: 1, width: 40, background: 'linear-gradient(90deg, #fb923c, transparent)' }} />
          <span className="font-orbitron text-neon-orange uppercase" style={{ fontSize: 10, letterSpacing: '0.4em' }}>Discovery Hub</span>
          <span className="pulse-dot" />
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-orbitron font-black leading-none mb-1" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.75rem)' }}>
              <span className="chrome-text">SELECT YOUR</span>{' '}
              <span className="grad-orange" style={{ filter: 'drop-shadow(0 0 16px rgba(249,115,22,.45))' }}>MISSION</span>
            </h1>
            <p className="text-zinc-500 text-sm tracking-wide">
              <span className="text-neon-orange font-bold">{filteredQuizzes.length}</span> missions deployed · Only <span className="text-neon-orange font-bold">published</span>
            </p>
          </div>
          <div className="hidden xl:block">
            <div className="w-20 h-20 diamond bg-gradient-to-br from-orange-500/15 to-red-600/15 border border-orange-400/20 glow-orange flex items-center justify-center float-y">
              <Gamepad2 className="w-6 h-6 text-orange-300/80" style={{ transform: 'rotate(-45deg)' }} />
            </div>
          </div>
        </div>
      </header>

      {/* ── COMPACT TOOLBAR: SEARCH + FILTER TOGGLE ── */}
      <section className="brackets metal clip-hud p-3 mb-6">
        <div className="flex gap-2 items-center flex-wrap">
          {/* Search */}
          <div className="relative flex-grow min-w-[180px]">
            <span className="absolute left-3 top-3 text-zinc-500">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SCAN DATABASE…"
              className="hud-input w-full clip-hud-sm pl-9 pr-3 py-2.5 text-[10px] font-orbitron tracking-wider outline-none"
            />
          </div>

          {/* Sort inline */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hud-input clip-hud-sm px-3 py-2.5 text-[10px] font-orbitron tracking-wider cursor-pointer"
          >
            <option value="POPULAR">SORT: POPULAR</option>
            <option value="TITLE">SORT: A-Z</option>
            <option value="DURATION">SORT: DURATION</option>
          </select>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`clip-hud-sm px-4 py-2.5 font-orbitron text-[10px] tracking-[.2em] font-bold flex items-center gap-2 transition-all ${
              showFilters || activeFilterCount > 0
                ? 'bg-orange-500/15 text-orange-300 border border-orange-400/40 shadow-[0_0_18px_-6px_rgba(251,146,60,.5)]'
                : 'btn-steel'
            }`}
          >
            {showFilters ? <X className="w-3.5 h-3.5" /> : <SlidersHorizontal className="w-3.5 h-3.5" />}
            <span>FILTERS</span>
            {activeFilterCount > 0 && !showFilters && (
              <span className="bg-orange-500 text-black px-1.5 py-0.5 rounded-full text-[9px] font-black">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Collapsible Filters */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-white/5 space-y-3 animate-in">
            {/* Selects */}
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="hud-input clip-hud-sm px-3 py-2 text-[10px] font-orbitron tracking-wider cursor-pointer"
              >
                <option value="ALL">DIFFICULTY: ALL</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="hud-input clip-hud-sm px-3 py-2 text-[10px] font-orbitron tracking-wider cursor-pointer"
              >
                <option value="ALL">DURATION: ANY</option>
                <option value="short">≤ 10 MIN</option>
                <option value="medium">11–30 MIN</option>
                <option value="long">&gt; 30 MIN</option>
              </select>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('ALL')}
                className={`chip px-3 py-1.5 text-[10px] ${selectedCategory === 'ALL' ? 'chip-on' : 'chip-off'}`}
              >
                ◈ All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`chip px-3 py-1.5 text-[10px] ${selectedCategory === cat.id ? 'chip-on' : 'chip-off'}`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <span className="bk bk-tl" />
        <span className="bk bk-br" />
      </section>

      {/* ── QUIZ CARD GRID ── */}
      {loading ? (
        <div className="text-center py-16 font-orbitron text-xs tracking-widest text-zinc-500">
          SCANNING DATA LOGS...
        </div>
      ) : filteredQuizzes.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="metal clip-hud p-10 text-center brackets">
          <div className="w-14 h-14 diamond bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-6 h-6 text-rose-300" style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <p className="font-orbitron text-sm tracking-[.25em] text-white uppercase mb-1">No missions found</p>
          <p className="text-zinc-500 text-xs">Adjust your scan parameters and retry.</p>
          <span className="bk bk-tl" />
          <span className="bk bk-br" />
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ perspective: 1200 }}>
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </section>
      )}
    </HudPlayerLayout>
  );
};

export default ExploreQuizzesPage;
