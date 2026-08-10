import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedFluidBackground } from '../../components/landing/AnimatedFluidBackground';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit, Trash2, HelpCircle, BookOpen, Clock, FileText,
  Upload, Sparkles, Loader2, Search, Tag, LayoutGrid, Timer,
  Target, Repeat2, Flame, Play, Lock, X, Rocket, Filter
} from 'lucide-react';

const DIFF_STYLES = {
  Beginner:     'text-emerald-300 bg-emerald-500/10 border-emerald-500/25',
  Intermediate: 'text-amber-300 bg-amber-500/10 border-amber-500/25',
  Advanced:     'text-rose-300 bg-rose-500/10 border-rose-500/25',
};

const getCategoryEmoji = (cat = '', title = '') => {
  const c = cat.toLowerCase(); const t = title.toLowerCase();
  if (c.includes('javascript') || t.includes('javascript')) return '⚡';
  if (c.includes('react') || t.includes('react')) return '⚛️';
  if (c.includes('python') || t.includes('python')) return '🐍';
  if (c.includes('cyber') || c.includes('security') || t.includes('security')) return '🛡️';
  if (c.includes('database') || c.includes('sql') || t.includes('sql')) return '🗄️';
  if (c.includes('html') || t.includes('html')) return '🌐';
  if (c.includes('css') || t.includes('css')) return '🎨';
  if (c.includes('node') || t.includes('node')) return '🚀';
  if (c.includes('next') || t.includes('next')) return '▲';
  return '📚';
};

export const AdminQuizzesPage = () => {
  const { quizzes, categories, refreshData } = useQuiz();

  // Filters
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [durFilter, setDurFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Detail modal
  const [detailQuiz, setDetailQuiz] = useState(null);

  // Create / Edit modal
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // PDF modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfCategory, setPdfCategory] = useState(categories[0]?.id || 'cat-1');
  const [pdfScanning, setPdfScanning] = useState(false);
  const [pdfScanProgress, setPdfScanProgress] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: '', description: '', categoryId: categories[0]?.id || '',
    difficulty: 'Intermediate', duration: 15, passingScore: 60,
    maxAttempts: 3, status: 'Published', thumbnail: ''
  });

  // ── Derived data ──────────────────────────────────────────────
  const allCats = useMemo(() => ['all', ...new Set(quizzes.map(q => q.categoryName || 'General'))], [quizzes]);

  const filtered = useMemo(() => {
    let list = quizzes.filter(q => {
      const s = search.toLowerCase();
      const matchSearch = !s || (q.title || '').toLowerCase().includes(s) || (q.categoryName || '').toLowerCase().includes(s);
      const matchCat = activeCat === 'all' || q.categoryName === activeCat;
      const matchDiff = diffFilter === 'all' || q.difficulty === diffFilter;
      const dur = q.duration || 15;
      const matchDur = durFilter === 'all'
        || (durFilter === 'short' && dur <= 10)
        || (durFilter === 'medium' && dur > 10 && dur <= 30)
        || (durFilter === 'long' && dur > 30);
      return matchSearch && matchCat && matchDiff && matchDur;
    });
    if (sortBy === 'popular') list = [...list].sort((a, b) => (b.attemptsCount || 0) - (a.attemptsCount || 0));
    return list;
  }, [quizzes, search, activeCat, diffFilter, durFilter, sortBy]);

  // ── Handlers ──────────────────────────────────────────────────
  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({ id: quiz.id, title: quiz.title, description: quiz.description, categoryId: quiz.categoryId, difficulty: quiz.difficulty, duration: quiz.duration, passingScore: quiz.passingScore, maxAttempts: quiz.maxAttempts, status: quiz.status, thumbnail: quiz.thumbnail || '' });
    } else {
      setEditingQuiz(null);
      setFormData({ title: '', description: '', categoryId: categories[0]?.id || '', difficulty: 'Intermediate', duration: 15, passingScore: 60, maxAttempts: 3, status: 'Published', thumbnail: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try { await api.saveQuiz(formData); await refreshData(); setShowModal(false); }
    catch (err) { alert(err.message); }
  };

  const handleToggleStatus = async (quiz) => {
    const next = (quiz.status === 'Published' || quiz.status === 'ACTIVE') ? 'Draft' : 'Published';
    try { await api.saveQuiz({ ...quiz, status: next }); await refreshData(); }
    catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this quiz?')) {
      try { await api.deleteQuiz(id); await refreshData(); }
      catch (err) { alert(err.message); }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    setPdfFileName(file.name); setPdfText(''); setPdfScanProgress('Reading file...');
    const reader = new FileReader();
    reader.onload = (ev) => {
      setTimeout(() => {
        const raw = ev.target?.result;
        if (typeof raw === 'string') { setPdfText(raw); }
        else if (raw instanceof ArrayBuffer) {
          const bytes = new Uint8Array(raw); let text = '';
          for (let i = 0; i < bytes.length; i++) { const c = bytes[i]; if (c >= 32 && c < 127) text += String.fromCharCode(c); else if (c === 10 || c === 13) text += '\n'; }
          setPdfText(text.replace(/\s{3,}/g, '\n'));
        }
        setPdfScanProgress('File ready. Click scan to generate quiz.');
      }, 0);
    };
    reader.onerror = () => setPdfScanProgress('File read error. Please paste text manually.');
    file.name.endsWith('.txt') ? reader.readAsText(file) : reader.readAsArrayBuffer(file);
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const result = await api.saveCategory({ name: newCategoryName.trim() });
      await refreshData(); setPdfCategory(result.id); setNewCategoryName('');
      setPdfScanProgress(`Category "${result.name || newCategoryName}" created!`);
    } catch (err) { setPdfScanProgress(`Category creation failed: ${err.message}`); }
    finally { setIsCreatingCategory(false); }
  };

  const handleScanPdf = async (e) => {
    e.preventDefault();
    if (!pdfText.trim() && !pdfFileName) { alert('Please select a file or paste question paper text first.'); return; }
    setPdfScanning(true); setPdfScanProgress('🤖 Sending to Gemini AI for intelligent parsing...');
    try {
      await new Promise(r => setTimeout(r, 50));
      const parsed = await api.parsePdfQuestionPaper(pdfText || pdfFileName);
      setPdfScanProgress(`✅ Parsed ${parsed.questions?.length || 0} questions. Creating quiz...`);
      await new Promise(r => setTimeout(r, 30));
      const catId = pdfCategory === '__new__' ? (categories[0]?.id || 'cat-1') : pdfCategory;
      const newQuiz = await api.saveQuiz({ title: parsed.title || `Exam: ${pdfFileName.replace(/\.[^/.]+$/, '') || 'PDF Paper'}`, description: parsed.description || 'Auto-scanned assessment.', categoryId: catId, difficulty: parsed.difficulty || 'Intermediate', duration: parsed.duration || 20, passingScore: parsed.passingScore || 60, maxAttempts: 3, status: 'Published', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80' });
      if (parsed.questions?.length > 0) {
        setPdfScanProgress(`💾 Saving ${parsed.questions.length} questions...`);
        await Promise.all(parsed.questions.map(q => api.saveQuestion({ quizId: newQuiz.id, questionText: q.questionText, marks: q.marks || 2, difficulty: q.difficulty || 'Easy', explanation: q.explanation || '', options: q.options })));
      }
      setPdfScanProgress('🎉 Quiz published!'); await refreshData();
      setShowPdfModal(false); setPdfText(''); setPdfFileName(''); setPdfScanProgress('');
      alert(`✅ Quiz "${newQuiz.title}" with ${parsed.questions?.length || 0} questions is now LIVE!`);
    } catch (err) { setPdfScanProgress(`❌ Failed: ${err.message}`); alert(`PDF Scanning Failed: ${err.message}`); }
    finally { setPdfScanning(false); }
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="min-h-screen py-8 pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-7">

        {/* ── HEADER ── */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs uppercase tracking-[.3em] text-indigo-300 font-bold mb-2">Admin · Quiz Management</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2">
            Manage your <span className="grad-text">Quiz Library</span>
          </h1>
          <p className="text-zinc-400 text-sm">Search, filter, publish, edit or delete assessments. Create new quizzes or import via AI.</p>
        </div>

        {/* ── SEARCH + FILTER BAR ── */}
        <div className="glass rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search quizzes by title or category…"
                className="w-full bg-black/35 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            {/* Difficulty */}
            <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
              className="bg-black/35 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all [&_option]:bg-[#101016]">
              <option value="all">All Difficulty</option>
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
            {/* Duration */}
            <select value={durFilter} onChange={e => setDurFilter(e.target.value)}
              className="bg-black/35 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all [&_option]:bg-[#101016]">
              <option value="all">Any Duration</option>
              <option value="short">≤ 10 min</option>
              <option value="medium">11–30 min</option>
              <option value="long">&gt; 30 min</option>
            </select>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              className="bg-black/35 border border-white/10 text-white rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-400 transition-all [&_option]:bg-[#101016]">
              <option value="recent">Recently Added</option>
              <option value="popular">Most Popular</option>
            </select>
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={() => setShowPdfModal(true)}
                className="btn-ghost px-4 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5">
                <Upload className="w-4 h-4" /> PDF Import
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}
                onClick={() => handleOpenModal()}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> New Quiz
              </motion.button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2">
            {allCats.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  activeCat === cat
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-purple-500/30 border-transparent'
                    : 'bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
                }`}
              >
                {cat === 'all' ? <LayoutGrid className="w-3 h-3" /> : <Tag className="w-3 h-3" />}
                {cat === 'all' ? 'All Categories' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULTS META ── */}
        <div className="flex items-center justify-between text-sm text-zinc-500">
          <span><b className="text-zinc-200">{filtered.length}</b> quizzes found</span>
          <span className="flex items-center gap-1.5 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
            Admins can edit, delete, and toggle status
          </span>
        </div>

        {/* ── QUIZ CARD GRID ── */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((quiz) => {
              const isPublished = quiz.status === 'Published' || quiz.status === 'ACTIVE';
              const emoji = getCategoryEmoji(quiz.categoryName, quiz.title);
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-2xl overflow-hidden card-hover flex flex-col"
                >
                  {/* Card Banner */}
                  <div
                    className="h-28 bg-gradient-to-br from-indigo-600/30 via-purple-600/20 to-fuchsia-600/30 relative flex items-center justify-center cursor-pointer group"
                    onClick={() => setDetailQuiz(quiz)}
                  >
                    <span className="text-5xl transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-6" style={{ filter: 'drop-shadow(0 0 20px rgba(168,85,247,.55))' }}>{emoji}</span>
                    <span className={`absolute top-3 left-3 badge border ${DIFF_STYLES[quiz.difficulty] || 'text-zinc-300 bg-white/5 border-white/10'}`}>
                      {quiz.difficulty}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleStatus(quiz); }}
                      className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                        isPublished
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30 hover:bg-emerald-500/25'
                          : 'bg-amber-500/15 text-amber-300 border-amber-400/30 hover:bg-amber-500/25'
                      }`}
                    >
                      {isPublished ? 'Published' : 'Draft'}
                    </button>
                    <span className="absolute bottom-3 left-3 badge bg-black/50 text-indigo-200 border border-indigo-400/30">
                      <Tag className="w-2.5 h-2.5" />{quiz.categoryName || 'General'}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3
                      className="font-display font-bold text-lg mb-1.5 cursor-pointer hover:text-indigo-300 transition-colors line-clamp-1"
                      onClick={() => setDetailQuiz(quiz)}
                    >
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4 flex-1 line-clamp-2">{quiz.description}</p>

                    {/* Meta row 1 */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 mb-2">
                      <span className="flex items-center gap-1"><HelpCircle className="w-3.5 h-3.5" />{quiz.questionsCount || 0} questions</span>
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{quiz.duration} min</span>
                      <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />{quiz.passingScore}% to pass</span>
                    </div>
                    {/* Meta row 2 */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 mb-4">
                      <span className="flex items-center gap-1"><Repeat2 className="w-3.5 h-3.5" />Max {quiz.maxAttempts} attempts</span>
                      <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5" />{quiz.attemptsCount || 0} plays</span>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                      <Link
                        to={`/admin/quizzes/${quiz.id}/questions`}
                        className="flex-1 py-2.5 rounded-xl font-bold text-sm btn-primary text-white flex items-center justify-center gap-2"
                      >
                        <BookOpen className="w-4 h-4" />
                        Questions ({quiz.questionsCount || 0})
                      </Link>
                      <button
                        onClick={() => handleOpenModal(quiz)}
                        className="p-2.5 rounded-xl btn-ghost text-white/70 hover:text-white transition-all cursor-pointer"
                        title="Edit Quiz"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(quiz.id)}
                        className="p-2.5 rounded-xl btn-ghost text-white/70 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete Quiz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="glass rounded-2xl p-14 text-center text-zinc-500">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-zinc-300">No quizzes match your filters.</p>
            <p className="text-sm mt-1">Try adjusting the search or filters above.</p>
          </div>
        )}
      </div>

      {/* ═══════ DETAIL MODAL ═══════ */}
      <AnimatePresence>
        {detailQuiz && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setDetailQuiz(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 22 } }}
              exit={{ scale: 0.92, opacity: 0, transition: { duration: 0.2 } }}
              className="relative glass-strong rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Banner */}
              <div className="h-40 bg-gradient-to-br from-indigo-600/40 via-purple-600/30 to-fuchsia-600/40 relative flex items-center justify-center">
                <span className="text-7xl" style={{ filter: 'drop-shadow(0 0 20px rgba(168,85,247,.55))' }}>
                  {getCategoryEmoji(detailQuiz.categoryName, detailQuiz.title)}
                </span>
                <span className={`absolute top-4 left-4 badge border ${DIFF_STYLES[detailQuiz.difficulty] || 'text-zinc-300 bg-white/5 border-white/10'}`}>
                  {detailQuiz.difficulty}
                </span>
                <span className="absolute top-4 right-14 badge bg-black/50 text-indigo-200 border border-indigo-400/30">
                  <Tag className="w-2.5 h-2.5" />{detailQuiz.categoryName}
                </span>
                <button
                  onClick={() => setDetailQuiz(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 border border-white/10 flex items-center justify-center hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-8">
                <h2 className="font-display text-3xl font-bold mb-3">{detailQuiz.title}</h2>
                <p className="text-zinc-400 mb-6">{detailQuiz.description}</p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                  {[
                    [HelpCircle, 'Questions', detailQuiz.questionsCount || 0],
                    [Clock, 'Duration', `${detailQuiz.duration} min`],
                    [Target, 'Passing Score', `${detailQuiz.passingScore}%`],
                    [Repeat2, 'Max Attempts', detailQuiz.maxAttempts],
                    [Flame, 'Total Plays', detailQuiz.attemptsCount || 0],
                    [Sparkles, 'Avg Score', `${detailQuiz.avgScore || 0}%`],
                  ].map(([Icon, label, val]) => (
                    <div key={label} className="bg-white/[.03] border border-white/5 rounded-xl p-3.5">
                      <Icon className="w-4 h-4 text-indigo-300 mb-1" />
                      <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{label}</div>
                      <div className="font-display font-bold">{val}</div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="bg-black/30 border border-white/5 rounded-xl p-5 mb-6">
                  <div className="text-xs uppercase tracking-wider font-bold text-zinc-500 mb-2.5">📋 Quiz Configuration</div>
                  <ul className="text-sm text-zinc-400 space-y-1.5">
                    <li>• Status: <b className={detailQuiz.status === 'Published' || detailQuiz.status === 'ACTIVE' ? 'text-emerald-300' : 'text-amber-300'}>{detailQuiz.status}</b></li>
                    <li>• Students must score at least <b className="text-indigo-300">{detailQuiz.passingScore}%</b> to pass.</li>
                    <li>• Each attempt is auto-submitted when the timer expires.</li>
                    <li>• Maximum <b className="text-indigo-300">{detailQuiz.maxAttempts}</b> attempts allowed per student.</li>
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-3">
                  <Link
                    to={`/admin/quizzes/${detailQuiz.id}/questions`}
                    className="flex-1 btn-primary py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                    onClick={() => setDetailQuiz(null)}
                  >
                    <BookOpen className="w-5 h-5" /> Manage Questions
                  </Link>
                  <button
                    onClick={() => { setDetailQuiz(null); handleOpenModal(detailQuiz); }}
                    className="btn-ghost px-5 py-3.5 rounded-xl font-bold text-white text-sm flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ CREATE / EDIT MODAL ═══════ */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl glass p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 bg-black/90 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-display font-bold text-white">
              {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Quiz Title</label>
                <input type="text" required value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Advanced AI Prompt Engineering"
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Description</label>
                <textarea rows={3} value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-400 transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Category</label>
                  <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black border border-white/10 text-white text-xs">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Difficulty</label>
                  <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black border border-white/10 text-white text-xs">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Duration (min)</label>
                  <input type="number" min={1} value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-400 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Passing Score (%)</label>
                  <input type="number" min={1} max={100} value={formData.passingScore}
                    onChange={e => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-400 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Max Attempts</label>
                  <input type="number" min={1} value={formData.maxAttempts}
                    onChange={e => setFormData({ ...formData, maxAttempts: Number(e.target.value) })}
                    className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-400 transition-all" />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black border border-white/10 text-white text-xs">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full btn-ghost text-white/80 hover:text-white">
                  Cancel
                </button>
                <button type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90">
                  {editingQuiz ? 'Save Changes' : 'Create Quiz'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* ═══════ PDF UPLOAD MODAL ═══════ */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-xl glass p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 bg-black/90">
            <div className="flex items-center gap-3 text-white">
              <FileText className="h-6 w-6" />
              <h3 className="text-2xl font-display font-bold">Upload PDF Question Paper</h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              Upload any PDF or text document. Gemini AI automatically parses questions, options, and explanations to create a live assessment.
            </p>
            <form onSubmit={handleScanPdf} className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center space-y-3 bg-white/[0.01] hover:border-white/40 transition-all">
                <Upload className="h-8 w-8 text-white mx-auto animate-bounce" />
                <div className="space-y-1">
                  <span className="text-white font-medium block">Select PDF or Document</span>
                  <span className="text-white/40 text-[11px] block">Supports .pdf, .txt, .doc</span>
                </div>
                <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} className="hidden" id="pdfFileInput" />
                <label htmlFor="pdfFileInput"
                  className="inline-block px-5 py-2 rounded-full btn-ghost border border-white/30 text-white hover:opacity-90 cursor-pointer font-medium uppercase text-[11px]">
                  {pdfFileName ? `✓ ${pdfFileName}` : 'Choose File'}
                </label>
              </div>
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Or Paste Question Paper Text</label>
                <textarea rows={4} value={pdfText} onChange={e => setPdfText(e.target.value)}
                  placeholder="Paste questions, options A/B/C/D, and correct answers here..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-400 transition-all" />
              </div>
              {pdfScanProgress && (
                <div className="px-4 py-2.5 rounded-full glass border border-white/20 text-xs text-white/90">{pdfScanProgress}</div>
              )}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button type="button" disabled={pdfScanning}
                  onClick={() => { setShowPdfModal(false); setPdfScanProgress(''); setPdfText(''); setPdfFileName(''); }}
                  className="px-5 py-2.5 rounded-full btn-ghost text-white/80 hover:text-white">Cancel</button>
                <button type="submit" disabled={pdfScanning || (!pdfText.trim() && !pdfFileName)}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-white/90 flex items-center gap-2 disabled:opacity-50">
                  {pdfScanning ? <><Loader2 className="h-4 w-4 animate-spin" /><span>Parsing...</span></>
                    : <><Sparkles className="h-4 w-4" /><span>Scan & Publish</span></>}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminQuizzesPage;
