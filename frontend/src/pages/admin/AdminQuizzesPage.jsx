import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { AnimatedFluidBackground } from '../../components/landing/AnimatedFluidBackground';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, HelpCircle, BookOpen, Clock, FileText, Upload, Sparkles, Loader2 } from 'lucide-react';

export const AdminQuizzesPage = () => {
  const { quizzes, categories, refreshData } = useQuiz();

  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // PDF Question Paper Upload Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfCategory, setPdfCategory] = useState(categories[0]?.id || 'cat-1');
  const [pdfScanning, setPdfScanning] = useState(false);
  const [pdfScanProgress, setPdfScanProgress] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: categories[0]?.id || '',
    difficulty: 'Intermediate',
    duration: 15,
    passingScore: 60,
    maxAttempts: 3,
    status: 'Published',
    thumbnail: ''
  });

  const getQuizThumbnail = (quiz) => {
    if (quiz.thumbnail) return quiz.thumbnail;
    const categoryName = (quiz.categoryName || '').toLowerCase();
    const title = (quiz.title || '').toLowerCase();

    if (categoryName.includes('react') || title.includes('react')) {
      return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80';
    }
    if (categoryName.includes('cyber') || title.includes('cypher') || title.includes('security')) {
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';
    }
    if (categoryName.includes('javascript') || title.includes('javascript') || title.includes('js')) {
      return 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80';
    }
    if (categoryName.includes('python') || title.includes('python')) {
      return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80';
    }
    if (categoryName.includes('database') || title.includes('sql')) {
      return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80';
  };

  const handleOpenModal = (quiz = null) => {
    if (quiz) {
      setEditingQuiz(quiz);
      setFormData({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        categoryId: quiz.categoryId,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
        passingScore: quiz.passingScore,
        maxAttempts: quiz.maxAttempts,
        status: quiz.status,
        thumbnail: quiz.thumbnail || ''
      });
    } else {
      setEditingQuiz(null);
      setFormData({
        title: '',
        description: '',
        categoryId: categories[0]?.id || '',
        difficulty: 'Intermediate',
        duration: 15,
        passingScore: 60,
        maxAttempts: 3,
        status: 'Published',
        thumbnail: ''
      });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.saveQuiz(formData);
      await refreshData();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (quiz) => {
    const nextStatus = (quiz.status === 'Published' || quiz.status === 'ACTIVE') ? 'Draft' : 'Published';
    try {
      await api.saveQuiz({
        ...quiz,
        status: nextStatus
      });
      await refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz directive?')) {
      try {
        await api.deleteQuiz(id);
        await refreshData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);
    setPdfText('');
    setPdfScanProgress('Reading file...');

    const reader = new FileReader();
    reader.onload = (event) => {
      setTimeout(() => {
        const raw = event.target?.result;
        if (typeof raw === 'string') {
          setPdfText(raw);
        } else if (raw instanceof ArrayBuffer) {
          const bytes = new Uint8Array(raw);
          let text = '';
          for (let i = 0; i < bytes.length; i++) {
            const c = bytes[i];
            if (c >= 32 && c < 127) text += String.fromCharCode(c);
            else if (c === 10 || c === 13) text += '\n';
          }
          setPdfText(text.replace(/\s{3,}/g, '\n'));
        }
        setPdfScanProgress('File ready. Click scan to generate quiz.');
      }, 0);
    };
    reader.onerror = () => setPdfScanProgress('File read error. Please paste text manually.');
    if (file.name.endsWith('.txt')) {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const handleCreateNewCategory = async () => {
    if (!newCategoryName.trim()) return;
    setIsCreatingCategory(true);
    try {
      const result = await api.saveCategory({ name: newCategoryName.trim() });
      await refreshData();
      setPdfCategory(result.id);
      setNewCategoryName('');
      setPdfScanProgress(`Category "${result.name || newCategoryName}" created!`);
    } catch (err) {
      setPdfScanProgress(`Category creation failed: ${err.message}`);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleScanPdfAndCreateQuiz = async (e) => {
    e.preventDefault();
    if (!pdfText.trim() && !pdfFileName) {
      alert('Please select a file or paste question paper text first.');
      return;
    }

    setPdfScanning(true);
    setPdfScanProgress('🤖 Sending to Gemini AI for intelligent parsing...');
    try {
      await new Promise(resolve => setTimeout(resolve, 50));
      const parsed = await api.parsePdfQuestionPaper(pdfText || pdfFileName);
      setPdfScanProgress(`✅ Parsed ${parsed.questions?.length || 0} questions. Creating quiz...`);
      await new Promise(resolve => setTimeout(resolve, 30));

      const resolvedCategoryId = pdfCategory === '__new__' ? (categories[0]?.id || 'cat-1') : pdfCategory;

      const newQuiz = await api.saveQuiz({
        title: parsed.title || `Exam: ${pdfFileName.replace(/\.[^/.]+$/, '') || 'PDF Paper'}`,
        description: parsed.description || 'Auto-scanned assessment generated from uploaded PDF question paper.',
        categoryId: resolvedCategoryId,
        difficulty: parsed.difficulty || 'Intermediate',
        duration: parsed.duration || 20,
        passingScore: parsed.passingScore || 60,
        maxAttempts: 3,
        status: 'Published',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
      });

      if (parsed.questions && parsed.questions.length > 0) {
        setPdfScanProgress(`💾 Saving ${parsed.questions.length} questions in parallel...`);
        await Promise.all(
          parsed.questions.map(q =>
            api.saveQuestion({
              quizId: newQuiz.id,
              questionText: q.questionText,
              marks: q.marks || 2,
              difficulty: q.difficulty || 'Easy',
              explanation: q.explanation || '',
              options: q.options
            })
          )
        );
      }

      setPdfScanProgress('🎉 Quiz published! Refreshing...');
      await refreshData();
      setShowPdfModal(false);
      setPdfText('');
      setPdfFileName('');
      setPdfScanProgress('');
      alert(`✅ Success! Quiz "${newQuiz.title}" with ${parsed.questions?.length || 0} questions is now LIVE for students.`);
    } catch (err) {
      setPdfScanProgress(`❌ Failed: ${err.message}`);
      alert(`PDF Scanning Failed: ${err.message}`);
    } finally {
      setPdfScanning(false);
    }
  };

  return (
    <div className="admin-bg-wrap flex-col md:flex-row selection:bg-white selection:text-black">
      <AnimatedFluidBackground />
      <div className="bg-scanlines" style={{ zIndex: 2 }} />
      <AdminSidebar />

      <main className="relative z-10 flex-grow p-4 md:p-6 overflow-y-auto space-y-6 max-h-[calc(100vh-4rem)]">
        {/* Header Title Bar */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
          <div>
            <h1 
              className="text-3xl sm:text-4xl font-medium text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Quiz Management Directives
            </h1>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Create, update, publish/draft, or digitize PDF exam papers with Gemini AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowPdfModal(true)}
              className="liquid-glass rounded-full px-5 py-2.5 text-xs font-medium text-white hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <FileText className="h-4 w-4 text-white/80" />
              <span>Upload PDF Paper</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOpenModal()}
              className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-white/90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10"
            >
              <Plus className="h-4 w-4" />
              <span>Create Quiz</span>
            </motion.button>
          </div>
        </div>

        {/* Quizzes Liquid Glass Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {quizzes.map((quiz) => (
            <motion.div
              key={quiz.id}
              whileHover={{ y: -4 }}
              className="liquid-glass rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between backdrop-blur-xl group"
            >
              {/* Thumbnail Header */}
              <div className="relative h-44 w-full overflow-hidden bg-black">
                <img
                  src={getQuizThumbnail(quiz)}
                  alt={quiz.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-medium liquid-glass text-white border border-white/20 backdrop-blur-md">
                  {quiz.difficulty}
                </span>

                <button
                  onClick={() => handleToggleStatus(quiz)}
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-medium backdrop-blur-md transition-all cursor-pointer border ${
                    quiz.status === 'Published' || quiz.status === 'ACTIVE'
                      ? 'liquid-glass text-white border-white/40'
                      : 'bg-white/10 text-white/70 border-white/10'
                  }`}
                >
                  {quiz.status === 'Published' || quiz.status === 'ACTIVE' ? 'Published' : 'Draft'}
                </button>

                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-medium text-white/80 liquid-glass border border-white/20">
                  {quiz.categoryName}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white leading-snug line-clamp-1">{quiz.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{quiz.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/80" />
                    <span>{quiz.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-white" />
                    <span>{quiz.questionsCount || 10} Questions</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                  <Link
                    to={`/admin/quizzes/${quiz.id}/questions`}
                    className="px-4 py-2 rounded-full liquid-glass border border-white/20 hover:bg-white/10 text-white font-medium transition-all flex items-center gap-1.5 text-xs"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-white" />
                    <span>Questions ({quiz.questionsCount || 10})</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(quiz)}
                      className="p-2 rounded-full liquid-glass text-white/70 hover:text-white transition-all cursor-pointer"
                      title="Edit Quiz"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-2 rounded-full liquid-glass text-white/70 hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Quiz"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Quiz Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl liquid-glass p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 bg-black/90 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {editingQuiz ? 'Edit Quiz Directive' : 'Create New Quiz Directive'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Advanced AI Prompt Engineering"
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black border border-white/10 text-white text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-black border border-white/10 text-white text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full liquid-glass text-white/80 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium uppercase tracking-wider hover:bg-white/90"
                >
                  Save Quiz Directive
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* PDF Upload Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl liquid-glass p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 bg-black/90">
            <div className="flex items-center gap-3 text-white">
              <FileText className="h-6 w-6 text-white" />
              <h3 className="text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>Upload PDF Question Paper</h3>
            </div>

            <p className="text-xs text-white/60 leading-relaxed">
              Upload any PDF exam question paper or text document. Our Gemini AI OCR scanner automatically parses all questions, multiple-choice options, and explanations to publish a live assessment hub for students.
            </p>

            <form onSubmit={handleScanPdfAndCreateQuiz} className="space-y-4 text-xs">
              <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center space-y-3 bg-white/[0.01] hover:border-white/40 transition-all">
                <Upload className="h-8 w-8 text-white mx-auto animate-bounce" />
                <div className="space-y-1">
                  <span className="text-white font-medium block">Select PDF or Document Question Paper</span>
                  <span className="text-white/40 text-[11px] block">Supports .pdf, .txt, .doc question papers</span>
                </div>

                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="pdfFileInput"
                />
                <label
                  htmlFor="pdfFileInput"
                  className="inline-block px-5 py-2 rounded-full liquid-glass border border-white/30 text-white hover:opacity-90 cursor-pointer font-medium uppercase text-[11px]"
                >
                  {pdfFileName ? `Selected: ${pdfFileName}` : 'Choose File'}
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Or Paste Question Paper Text</label>
                <textarea
                  rows={4}
                  value={pdfText}
                  onChange={(e) => setPdfText(e.target.value)}
                  placeholder="Paste questions, options A/B/C/D, and correct answers here..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              {pdfScanProgress && (
                <div className="px-4 py-2.5 rounded-full liquid-glass border border-white/20 text-xs text-white/90">
                  {pdfScanProgress}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setShowPdfModal(false); setPdfScanProgress(''); setPdfText(''); setPdfFileName(''); }}
                  disabled={pdfScanning}
                  className="px-5 py-2.5 rounded-full liquid-glass text-white/80 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pdfScanning || (!pdfText.trim() && !pdfFileName)}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium uppercase tracking-wider hover:bg-white/90 flex items-center gap-2 shadow-lg shadow-white/10 disabled:opacity-50"
                >
                  {pdfScanning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>AI Parsing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Scan & Auto-Publish Quiz</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
