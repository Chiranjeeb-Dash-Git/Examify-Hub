import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HudAdminLayout } from '../../components/HudAdminLayout';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Edit, Trash2, HelpCircle, BookOpen, Clock, FileText,
  Upload, Sparkles, Loader2, Search, Tag, LayoutGrid, Timer,
  Target, Repeat2, Flame, Lock, X, Rocket, Filter, Play, Power, Eye
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

function useTilt(ref, maxDeg = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `rotateX(${(py - .5) * -2 * maxDeg}deg) rotateY(${(px - .5) * 2 * maxDeg}deg) translateZ(6px)`;
      el.style.setProperty('--mx', px * 100 + '%');
      el.style.setProperty('--my', py * 100 + '%');
    };
    const onLeave = () => { el.style.transform = 'rotateX(0) rotateY(0) translateZ(0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref, maxDeg]);
}

const AdminQuizCard = ({ quiz, onToggle, onEdit, onDelete, onView }) => {
  const cardRef = useRef(null);
  useTilt(cardRef, 8);
  const isPublished = quiz.status === 'Published' || quiz.status === 'ACTIVE';
  const emoji = getCategoryEmoji(quiz.categoryName, quiz.title);
  const diffClass = `d-${quiz.difficulty || 'Intermediate'}`;
  const isUrl = (str) => str && (str.startsWith('http') || str.startsWith('/') || str.startsWith('data:'));

  return (
    <div ref={cardRef} className="brackets tilt metal clip-hud overflow-hidden flex flex-col h-full" style={{ transformStyle: 'preserve-3d' }}>
      <div className="shine" />
      <div className="pop flex flex-col h-full">
        <div className="q-banner cursor-pointer" onClick={() => onView(quiz)}>
          {isUrl(quiz.thumbnail) ? (
            <img src={quiz.thumbnail} alt={quiz.title} className="absolute inset-0 h-full w-full object-cover opacity-30 q-thumb" />
          ) : (
            <span className="q-thumb pop select-none">{quiz.thumbnail || emoji}</span>
          )}
          <span className="absolute top-3 left-3 hud-badge bg-black/60 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />{quiz.categoryName || 'General'}
          </span>
          <span className={`absolute top-3 right-3 diff-b ${diffClass}`}>{quiz.difficulty}</span>
          <span className="absolute bottom-3 left-3 hud-badge flex items-center gap-1.5" style={{
            color: isPublished ? '#6ee7b7' : '#fcd34d',
            borderColor: isPublished ? 'rgba(52,211,153,.35)' : 'rgba(251,191,36,.35)',
            background: isPublished ? 'rgba(16,185,129,.12)' : 'rgba(245,158,11,.12)'
          }}>
            <Power className="w-3 h-3" />{isPublished ? 'LIVE' : 'DRAFT'}
          </span>
        </div>
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              className="q-title font-orbitron font-bold text-base tracking-wide text-white cursor-pointer"
              onClick={() => onView(quiz)}
            >
              {quiz.title}
            </h3>
            <span className="font-orbitron text-[9px] tracking-widest text-zinc-600 mt-1 shrink-0">
              ID-{String(quiz.id || '').slice(-3).toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-zinc-400 clamp2 mb-4 flex-grow">{quiz.description}</p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-black/30 border border-white/5 clip-hud-sm p-2 text-center">
              <div className="font-orbitron font-black text-sm text-white">{quiz.questionsCount || 0}</div>
              <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Questions</div>
            </div>
            <div className="bg-black/30 border border-white/5 clip-hud-sm p-2 text-center">
              <div className="font-orbitron font-black text-sm text-neon-cyan">{quiz.duration}<span className="text-[9px] text-zinc-500">m</span></div>
              <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Duration</div>
            </div>
            <div className="bg-black/30 border border-white/5 clip-hud-sm p-2 text-center">
              <div className="font-orbitron font-black text-sm text-neon-violet">{quiz.passingScore}%</div>
              <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Pass Score</div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-orbitron tracking-widest text-zinc-500 mb-4">
            <span>MAX {quiz.maxAttempts || 3} ATTEMPTS</span>
            <span className="flex items-center gap-1"><Flame className="w-3 h-3 text-amber-400" />{quiz.attemptsCount || 0} RUNS</span>
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/admin/quizzes/${quiz.id}/questions`} className="flex-1">
              <button className="btn-neon w-full py-2.5 clip-hud-sm font-orbitron text-[9px] tracking-[.22em] font-bold text-white flex items-center justify-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> QUESTIONS
              </button>
            </Link>
            <button
              onClick={() => onEdit(quiz)}
              className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white hover:border-cyan-400/40 transition-all"
              title="Edit Quiz"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggle(quiz)}
              className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-amber-300 hover:border-amber-400/40 transition-all"
              title={isPublished ? 'Unpublish' : 'Publish'}
            >
              <Power className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(quiz.id)}
              className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-400/40 transition-all"
              title="Delete Quiz"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <span className="bk bk-tl" />
      <span className="bk bk-br" />
    </div>
  );
};

export const AdminQuizzesPage = () => {
  const { quizzes, categories, refreshData } = useQuiz();

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [durFilter, setDurFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const [detailQuiz, setDetailQuiz] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
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

  return (
    <HudAdminLayout>
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pb-20" style={{ paddingTop: 0 }}>
        <div className="relative space-y-10">

          {/* ═══ HEADER ═══ */}
          <div className="relative text-center">
            <div className="hex-divider mb-5" />
            <div className="inline-flex items-center gap-2 px-4 py-1.5 hud-badge bg-emerald-500/10 border border-emerald-500/30 mb-4">
              <span className="pulse-dot bg-emerald-400" />
              <span className="font-orbitron text-[10px] tracking-[.35em] uppercase text-emerald-300">
                Admin · Quiz Registry
              </span>
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-6xl tracking-tight mb-4">
              <span className="chrome-text">ASSESSMENT&nbsp;</span>
              <span className="grad-neon">PROTOCOLS</span>
            </h1>
            <p className="text-zinc-400 font-light text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              Deploy, configure, and monitor assessment directives. Import via AI, edit questions, and toggle live status.
            </p>
            <div className="hex-divider mt-8" />
          </div>

          {/* ═══ COMMAND BAR ═══ */}
          <div className="relative brackets metal clip-hud p-6 md:p-7">
            <span className="bk bk-tl" /><span className="bk bk-br" />
            <div className="shine" />

            <div className="flex flex-wrap gap-4 items-stretch mb-5">
              {/* Search */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search assessments by title, category, or directive id…"
                  className="hud-input w-full clip-hud-sm pl-11 pr-4 py-3.5 text-xs font-orbitron tracking-wider outline-none"
                />
              </div>

              <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)}
                className="hud-input clip-hud-sm px-4 py-3.5 text-xs font-orbitron tracking-wider cursor-pointer">
                <option value="all">All Difficulty</option>
                <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>

              <select value={durFilter} onChange={e => setDurFilter(e.target.value)}
                className="hud-input clip-hud-sm px-4 py-3.5 text-xs font-orbitron tracking-wider cursor-pointer">
                <option value="all">Any Duration</option>
                <option value="short">≤ 10 min</option>
                <option value="medium">11–30 min</option>
                <option value="long">&gt; 30 min</option>
              </select>

              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                className="hud-input clip-hud-sm px-4 py-3.5 text-xs font-orbitron tracking-wider cursor-pointer">
                <option value="recent">Recently Added</option>
                <option value="popular">Most Runs</option>
              </select>

              <div className="flex items-center gap-2 ml-auto">
                <button onClick={() => setShowPdfModal(true)}
                  className="btn-ghost px-5 py-3 clip-hud-sm font-orbitron text-[10px] tracking-[.22em] text-white flex items-center gap-2">
                  <Upload className="w-4 h-4" /> PDF IMPORT
                </button>
                <button onClick={() => handleOpenModal()}
                  className="btn-neon px-5 py-3 clip-hud-sm font-orbitron text-[10px] tracking-[.22em] text-white flex items-center gap-2">
                  <Plus className="w-4 h-4" /> NEW QUIZ
                </button>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex flex-wrap gap-2">
              {allCats.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`chip px-4 py-2 ${activeCat === cat ? 'chip-on' : 'chip-off'}`}
                >
                  {cat === 'all' ? <LayoutGrid className="w-3 h-3 inline mr-1.5" /> : <Tag className="w-3 h-3 inline mr-1.5" />}
                  {cat === 'all' ? 'All Categories' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ RESULTS META ═══ */}
          <div className="flex items-center justify-between">
            <span className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
              <span className="text-neon-cyan">◤</span>
              <span className="text-zinc-200 font-bold">{filtered.length}</span> Assessments Located
            </span>
            <span className="font-orbitron text-[10px] tracking-[.3em] uppercase text-zinc-500 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-fuchsia-300" />
              Live sync · {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* ═══ QUIZ CARD GRID ═══ */}
          {filtered.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6" style={{ perspective: '1200px' }}>
              {filtered.map((quiz) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AdminQuizCard
                    quiz={quiz}
                    onToggle={handleToggleStatus}
                    onEdit={handleOpenModal}
                    onDelete={handleDelete}
                    onView={setDetailQuiz}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="brackets metal clip-hud p-16 text-center relative">
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <Search className="w-10 h-10 mx-auto mb-4 opacity-40 text-zinc-500" />
              <p className="font-orbitron tracking-wider text-zinc-300 font-bold mb-1">NO ASSESSMENTS MATCH</p>
              <p className="text-sm text-zinc-500">Try adjusting filters or clear the search field.</p>
            </div>
          )}

        </div>

        {/* ═══════ DETAIL MODAL ═══════ */}
        <AnimatePresence>
          {detailQuiz && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
              onClick={() => setDetailQuiz(null)}
            >
              <motion.div
                initial={{ scale: 0.88, y: 40, opacity: 0, rotateX: 10 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } }}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.18 } }}
                className="relative brackets metal clip-hud w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <span className="bk bk-tl" /><span className="bk bk-br" />
                <div className="shine" />
                <div className="pop">
                  <div className="q-banner !h-44">
                    <span className="q-thumb pop select-none">{getCategoryEmoji(detailQuiz.categoryName, detailQuiz.title)}</span>
                    <span className={`absolute top-4 left-4 diff-b d-${detailQuiz.difficulty || 'Intermediate'}`}>{detailQuiz.difficulty}</span>
                    <span className="absolute top-4 right-16 hud-badge bg-black/60 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                      <Tag className="w-3 h-3" />{detailQuiz.categoryName}
                    </span>
                    <button
                      onClick={() => setDetailQuiz(null)}
                      className="absolute top-4 right-4 w-10 h-10 clip-hud-sm bg-black/60 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:border-rose-400/30 hover:text-rose-300 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-8">
                    <h2 className="font-orbitron text-2xl md:text-3xl font-bold mb-3 tracking-wide">{detailQuiz.title}</h2>
                    <p className="text-zinc-400 mb-7 leading-relaxed">{detailQuiz.description}</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-7">
                      {[
                        [HelpCircle, 'Questions', detailQuiz.questionsCount || 0],
                        [Clock, 'Duration', `${detailQuiz.duration} min`],
                        [Target, 'Pass Score', `${detailQuiz.passingScore}%`],
                        [Repeat2, 'Max Attempts', detailQuiz.maxAttempts],
                        [Flame, 'Total Runs', detailQuiz.attemptsCount || 0],
                        [Sparkles, 'Avg Score', `${detailQuiz.avgScore || 0}%`],
                      ].map(([Icon, label, val]) => (
                        <div key={label} className="bg-black/30 border border-white/5 clip-hud-sm p-3.5">
                          <Icon className="w-4 h-4 text-neon-cyan mb-1" />
                          <div className="font-orbitron text-[8px] tracking-[.2em] text-zinc-500 uppercase font-bold">{label}</div>
                          <div className="font-orbitron font-black text-white">{val}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-black/30 border border-white/5 clip-hud-sm p-5 mb-7">
                      <div className="font-orbitron text-[9px] tracking-[.25em] uppercase text-zinc-500 mb-3 font-bold">⚙️ CONFIGURATION</div>
                      <ul className="text-sm text-zinc-400 space-y-1.5">
                        <li>• Status: <b className={(detailQuiz.status === 'Published' || detailQuiz.status === 'ACTIVE') ? 'text-emerald-300' : 'text-amber-300'}>{detailQuiz.status}</b></li>
                        <li>• Students must score at least <b className="text-neon-cyan">{detailQuiz.passingScore}%</b> to clear.</li>
                        <li>• Auto-submit triggers when timer expires.</li>
                        <li>• Maximum <b className="text-neon-cyan">{detailQuiz.maxAttempts}</b> attempts per candidate.</li>
                      </ul>
                    </div>

                    <div className="flex gap-3">
                      <Link
                        to={`/admin/quizzes/${detailQuiz.id}/questions`}
                        className="flex-1"
                        onClick={() => setDetailQuiz(null)}
                      >
                        <button className="btn-neon w-full py-3.5 clip-hud-sm font-orbitron text-[10px] tracking-[.25em] font-bold text-white flex items-center justify-center gap-2">
                          <BookOpen className="w-4 h-4" /> MANAGE QUESTIONS
                        </button>
                      </Link>
                      <button onClick={() => { setDetailQuiz(null); handleOpenModal(detailQuiz); }}
                        className="px-6 py-3.5 clip-hud-sm bg-black/35 border border-white/10 text-white hover:border-cyan-400/40 transition-all font-orbitron text-[10px] tracking-[.22em] flex items-center gap-2">
                        <Edit className="w-4 h-4" /> EDIT
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ CREATE / EDIT MODAL ═══════ */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
               onClick={() => setShowModal(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="relative brackets metal clip-hud w-full max-w-xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop p-8">
                <h3 className="font-orbitron text-2xl font-bold text-white tracking-wide mb-6">
                  {editingQuiz ? 'EDIT ASSESSMENT' : 'DEPLOY NEW ASSESSMENT'}
                </h3>
                <form onSubmit={handleSave} className="space-y-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Quiz Title</label>
                    <input type="text" required value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Advanced AI Prompt Engineering"
                      className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-xs tracking-wide outline-none" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Description</label>
                    <textarea rows={3} value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Enter detailed briefing..."
                      className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-[11px] tracking-wide outline-none resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Category</label>
                      <select value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                        className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-[11px] tracking-wide cursor-pointer">
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Difficulty</label>
                      <select value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                        className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-[11px] tracking-wide cursor-pointer">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Duration (min)</label>
                      <input type="number" min={1} value={formData.duration}
                        onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                        className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-xs tracking-wide outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Pass Score (%)</label>
                      <input type="number" min={1} max={100} value={formData.passingScore}
                        onChange={e => setFormData({ ...formData, passingScore: Number(e.target.value) })}
                        className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-xs tracking-wide outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Max Attempts</label>
                      <input type="number" min={1} value={formData.maxAttempts}
                        onChange={e => setFormData({ ...formData, maxAttempts: Number(e.target.value) })}
                        className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-xs tracking-wide outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">Status</label>
                      <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                        className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-[11px] tracking-wide cursor-pointer">
                        <option value="Published">Published</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-6">
                    <button type="button" onClick={() => setShowModal(false)}
                      className="px-6 py-3 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white transition-all font-orbitron text-[10px] tracking-[.22em]">
                      ABORT
                    </button>
                    <button type="submit"
                      className="btn-neon px-6 py-3 clip-hud-sm font-orbitron text-[10px] tracking-[.22em] text-white">
                      {editingQuiz ? 'SAVE CHANGES' : 'DEPLOY ASSESSMENT'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {/* ═══════ PDF UPLOAD MODAL ═══════ */}
        {showPdfModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
               onClick={() => setShowPdfModal(false)}>
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              className="relative brackets metal clip-hud w-full max-w-xl"
              onClick={e => e.stopPropagation()}
            >
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop p-8">
                <div className="flex items-center gap-3 text-white mb-2">
                  <FileText className="h-6 w-6 text-neon-cyan" />
                  <h3 className="font-orbitron text-2xl font-bold tracking-wide">AI QUESTION PAPER PARSE</h3>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-6">
                  Upload any document. Gemini AI parses questions, options, and explanations into a live assessment directive.
                </p>
                <form onSubmit={handleScanPdf} className="space-y-4 text-xs">
                  <div className="border-2 border-dashed border-white/10 clip-hud-sm p-6 text-center space-y-3 bg-black/25 hover:border-cyan-400/30 transition-all">
                    <Upload className="h-8 w-8 text-white/60 mx-auto" />
                    <div className="space-y-1">
                      <span className="text-white font-bold block font-orbitron tracking-wider text-xs">SELECT QUESTION PAPER</span>
                      <span className="text-zinc-500 text-[10px] block font-orbitron">Supports .pdf · .txt · .doc</span>
                    </div>
                    <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={handleFileUpload} className="hidden" id="pdfFileInput" />
                    <label htmlFor="pdfFileInput"
                      className="inline-block px-5 py-2.5 clip-hud-sm hud-input font-orbitron text-[10px] tracking-[.22em] hover:text-white cursor-pointer font-bold">
                      {pdfFileName ? `✓ ${pdfFileName}` : 'CHOOSE FILE'}
                    </label>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-zinc-500 font-orbitron uppercase text-[9px] tracking-[.2em] font-bold">OR PASTE TEXT</label>
                    <textarea rows={4} value={pdfText} onChange={e => setPdfText(e.target.value)}
                      placeholder="Paste questions, options A/B/C/D, correct answers..."
                      className="hud-input w-full clip-hud-sm p-3.5 font-orbitron text-[11px] tracking-wide outline-none resize-none" />
                  </div>
                  {pdfScanProgress && (
                    <div className="px-4 py-3 clip-hud-sm hud-input border-cyan-400/30 font-orbitron text-[10px] tracking-wide text-cyan-300">
                      {pdfScanProgress}
                    </div>
                  )}
                  <div className="flex items-center justify-end gap-3 pt-5 border-t border-white/10 mt-6">
                    <button type="button" disabled={pdfScanning}
                      onClick={() => { setShowPdfModal(false); setPdfScanProgress(''); setPdfText(''); setPdfFileName(''); }}
                      className="px-6 py-3 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-white transition-all font-orbitron text-[10px] tracking-[.22em]">
                      ABORT
                    </button>
                    <button type="submit" disabled={pdfScanning || (!pdfText.trim() && !pdfFileName)}
                      className="btn-neon px-6 py-3 clip-hud-sm font-orbitron text-[10px] tracking-[.22em] text-white flex items-center gap-2 disabled:opacity-50">
                      {pdfScanning ? <><Loader2 className="h-4 w-4 animate-spin" /><span>PARSING...</span></>
                        : <><Sparkles className="h-4 w-4" /><span>SCAN & PUBLISH</span></>}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </HudAdminLayout>
  );
};

export default AdminQuizzesPage;
