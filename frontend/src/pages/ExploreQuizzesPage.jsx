import React, { useState } from 'react';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { HudPlayerLayout } from '../components/HudPlayerLayout';
import { Search, Gamepad2, SearchX } from 'lucide-react';

export const ExploreQuizzesPage = () => {
  const { quizzes, categories, loading } = useQuiz();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [selectedDuration, setSelectedDuration] = useState('ALL');
  const [sortBy, setSortBy] = useState('POPULAR');

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

  return (
    <HudPlayerLayout>
      {/* ── HERO HEADER ── */}
      <header className="relative mb-12">
        <div className="absolute -top-10 right-0 hidden xl:block float-y">
          <div className="w-32 h-32 diamond bg-gradient-to-br from-cyan-500/15 to-violet-600/15 border border-cyan-400/20 glow-violet flex items-center justify-center">
            <Gamepad2 className="w-10 h-10 text-violet-300/80" style={{ transform: 'rotate(-45deg)' }} />
          </div>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div style={{ height: 1, width: 56, background: 'linear-gradient(90deg, #22d3ee, transparent)' }} />
          <span className="font-orbitron text-neon-cyan uppercase" style={{ fontSize: 11, letterSpacing: '0.5em' }}>Discovery Hub</span>
          <span className="pulse-dot" />
        </div>
        <h1 className="font-orbitron font-black leading-none mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          <span className="chrome-text">SELECT YOUR</span><br className="md:hidden" />{' '}
          <span className="grad-neon" style={{ filter: 'drop-shadow(0 0 24px rgba(168,85,247,.5))' }}>MISSION</span>
        </h1>
        <p className="text-zinc-400 text-lg tracking-wide max-w-2xl">
          Search by title or category · filter by difficulty, duration & popularity. Only{' '}
          <span className="text-neon-cyan font-bold">published</span> quizzes are deployed to the arena.
        </p>
      </header>

      <div className="hex-divider mb-10" />

      {/* ── COMMAND BAR (search + filters) ── */}
      <section className="brackets metal clip-hud p-5 mb-8">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <div className="relative flex-grow min-w-[240px]">
            <span className="absolute left-4 top-3.5 text-zinc-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SCAN QUIZ DATABASE BY TITLE OR CATEGORY…"
              className="hud-input w-full clip-hud-sm pl-11 pr-4 py-3.5 text-xs font-orbitron tracking-wider outline-none"
            />
          </div>

          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="hud-input clip-hud-sm px-4 py-3.5 text-xs font-orbitron tracking-wider cursor-pointer"
          >
            <option value="ALL">DIFFICULTY: ALL</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="hud-input clip-hud-sm px-4 py-3.5 text-xs font-orbitron tracking-wider cursor-pointer"
          >
            <option value="ALL">DURATION: ANY</option>
            <option value="short">≤ 10 MIN</option>
            <option value="medium">11–30 MIN</option>
            <option value="long">&gt; 30 MIN</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="hud-input clip-hud-sm px-4 py-3.5 text-xs font-orbitron tracking-wider cursor-pointer"
          >
            <option value="POPULAR">SORT: POPULAR</option>
            <option value="TITLE">SORT: A-Z</option>
            <option value="DURATION">SORT: DURATION</option>
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`chip px-4 py-2 ${selectedCategory === 'ALL' ? 'chip-on' : 'chip-off'}`}
          >
            ◈ All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`chip px-4 py-2 ${selectedCategory === cat.id ? 'chip-on' : 'chip-off'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <span className="bk bk-tl" />
        <span className="bk bk-br" />
      </section>

      {/* ── RESULTS META ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500">
        <span>
          ◤ <b className="text-neon-cyan">{filteredQuizzes.length}</b> missions available
        </span>
        <span className="flex items-center gap-2">
          <span className="pulse-dot" /> Live sync · <span className="text-zinc-300">{todayStr}</span>
        </span>
      </div>

      {/* ── QUIZ CARD GRID ── */}
      {loading ? (
        <div className="text-center py-20 font-orbitron text-xs tracking-widest text-zinc-500">
          SCANNING DATA LOGS...
        </div>
      ) : filteredQuizzes.length === 0 ? (
        /* ── EMPTY STATE ── */
        <div className="metal clip-hud p-16 text-center brackets">
          <div className="w-16 h-16 diamond bg-rose-500/10 border border-rose-400/30 flex items-center justify-center mx-auto mb-5">
            <SearchX className="w-7 h-7 text-rose-300" style={{ transform: 'rotate(-45deg)' }} />
          </div>
          <p className="font-orbitron text-sm tracking-[.25em] text-white uppercase mb-2">No missions found</p>
          <p className="text-zinc-500">Adjust your scan parameters and retry.</p>
          <span className="bk bk-tl" />
          <span className="bk bk-br" />
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1200 }}>
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} />
          ))}
        </section>
      )}
    </HudPlayerLayout>
  );
};

export default ExploreQuizzesPage;
