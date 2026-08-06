import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, HelpCircle, Eye, EyeOff, BookOpen, Clock, Image as ImageIcon, FileText, Upload, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';

export const AdminQuizzesPage = () => {
  const { quizzes, categories, refreshData } = useQuiz();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  // PDF Question Paper Upload Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfText, setPdfText] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [pdfCategory, setPdfCategory] = useState(categories[0]?.id || 'cat-1');
  const [pdfScanning, setPdfScanning] = useState(false);

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

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'intermediate':
        return 'bg-[#6be026]/20 text-[#6be026] border-[#6be026]/30';
      case 'advanced':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30';
    }
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

  // PDF File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setPdfText(content);
      }
    };
    reader.readAsText(file);
  };

  // Scan PDF Question Paper & Auto-Create Quiz
  const handleScanPdfAndCreateQuiz = async (e) => {
    e.preventDefault();
    if (!pdfText && !pdfFileName) {
      alert('Please select a PDF file or paste question paper text content.');
      return;
    }

    setPdfScanning(true);
    try {
      const parsed = await api.parsePdfQuestionPaper(pdfText || pdfFileName);
      
      const newQuiz = await api.saveQuiz({
        title: parsed.title || `Exam: ${pdfFileName.replace(/\.[^/.]+$/, "")}`,
        description: parsed.description || 'Auto-scanned evaluation course created from PDF question paper.',
        categoryId: pdfCategory,
        difficulty: parsed.difficulty || 'Intermediate',
        duration: parsed.duration || 20,
        passingScore: parsed.passingScore || 60,
        maxAttempts: 3,
        status: 'Published',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80'
      });

      if (parsed.questions && parsed.questions.length > 0) {
        for (let q of parsed.questions) {
          await api.saveQuestion({
            quizId: newQuiz.id,
            questionText: q.questionText,
            marks: q.marks || 2,
            difficulty: q.difficulty || 'Easy',
            explanation: q.explanation || '',
            options: q.options
          });
        }
      }

      await refreshData();
      setShowPdfModal(false);
      alert(`Success! Generated Quiz "${newQuiz.title}" with ${parsed.questions?.length || 0} digitized questions and published to student portal.`);
    } catch (err) {
      alert(`PDF Scanning Failed: ${err.message}`);
    } finally {
      setPdfScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Quiz <span className="text-white/80">Management</span>
            </h1>
            <p className="mt-1 text-sm text-white/60 font-mono">
              Create, edit, publish/unpublish, or upload PDF question papers to digitize exams
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPdfModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-purple-400" />
              <span>Upload PDF Paper</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <Plus className="h-4 w-4" />
              <span>Create Quiz</span>
            </button>
          </div>
        </div>

        {/* Quizzes Grid with Theme Image Banner Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group bg-[#0a0a0c]">
              {/* Banner Image Pic */}
              <div className="relative h-44 w-full overflow-hidden bg-[#181c22]">
                <img
                  src={getQuizThumbnail(quiz)}
                  alt={quiz.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181c22] via-[#181c22]/40 to-transparent" />
                
                {/* Difficulty Badge */}
                <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md ${getDifficultyBadge(quiz.difficulty)}`}>
                  {quiz.difficulty}
                </span>

                {/* Status Toggle Button */}
                <button
                  onClick={() => handleToggleStatus(quiz)}
                  className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer border ${
                    quiz.status === 'Published' || quiz.status === 'ACTIVE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                  }`}
                  title="Click to toggle Publish/Draft status"
                >
                  {quiz.status === 'Published' || quiz.status === 'ACTIVE' ? 'Published' : 'Draft'}
                </button>

                {/* Category Tag */}
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-[#38BDF8] bg-[#10141a]/80 border border-[#38BDF8]/30 backdrop-blur-md">
                  {quiz.categoryName}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white leading-snug line-clamp-1">{quiz.title}</h3>
                  <p className="text-xs text-white/60 line-clamp-2 font-mono leading-relaxed">{quiz.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-white/80" />
                    <span>{quiz.duration} mins</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{quiz.questionsCount || 10} Questions</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 font-mono text-xs">
                  <Link
                    to={`/admin/quizzes/${quiz.id}/questions`}
                    className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all flex items-center gap-1.5 text-[11px]"
                  >
                    <BookOpen className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <span>Questions ({quiz.questionsCount || 10})</span>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenModal(quiz)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                      title="Edit Quiz"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/70 hover:text-red-400 transition-all"
                      title="Delete Quiz"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Quiz Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#0a0a0c] max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white font-display">
              {editingQuiz ? 'Edit Quiz Directive' : 'Create New Quiz Directive'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. JavaScript Fundamentals"
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Duration (mins)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Pass Score (%)</label>
                  <input
                    type="number"
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) || 60 })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Max Attempts</label>
                  <input
                    type="number"
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) || 3 })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Thumbnail Banner URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white text-black font-bold uppercase tracking-wider hover:bg-white/90"
                >
                  Save Quiz Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PDF Question Paper Upload & Scanner Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/40 space-y-6 bg-[#0a0a0c]">
            <div className="flex items-center gap-3 text-purple-300">
              <FileText className="h-6 w-6 text-purple-400" />
              <h3 className="font-display text-xl font-bold text-white">Upload PDF Question Paper</h3>
            </div>

            <p className="text-xs text-white/60 font-mono leading-relaxed">
              Upload any PDF exam question paper or text document. Our Gemini AI OCR scanner automatically parses all questions, multiple-choice options, and explanations to publish a live assessment hub for students.
            </p>

            <form onSubmit={handleScanPdfAndCreateQuiz} className="space-y-4 font-mono text-xs">
              {/* File Dropzone */}
              <div className="border-2 border-dashed border-purple-500/30 rounded-2xl p-6 text-center space-y-3 bg-purple-950/10 hover:border-purple-500/60 transition-all">
                <Upload className="h-8 w-8 text-purple-400 mx-auto animate-bounce" />
                <div className="space-y-1">
                  <span className="text-white font-bold block">Select PDF or Document Question Paper</span>
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
                  className="inline-block px-4 py-2 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 hover:bg-purple-600/40 cursor-pointer font-bold uppercase text-[11px]"
                >
                  {pdfFileName ? `Selected: ${pdfFileName}` : 'Choose File'}
                </label>
              </div>

              {/* Or Paste Question Content */}
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase">Or Paste Question Paper Text</label>
                <textarea
                  rows={4}
                  value={pdfText}
                  onChange={(e) => setPdfText(e.target.value)}
                  placeholder="Paste questions, options A/B/C/D, and correct answers here..."
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-xs focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase">Target Category Directive</label>
                <select
                  value={pdfCategory}
                  onChange={(e) => setPdfCategory(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowPdfModal(false)}
                  disabled={pdfScanning}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={pdfScanning}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold uppercase tracking-wider hover:bg-purple-500 flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  {pdfScanning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Scanning PDF & Generating Quiz...</span>
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
          </div>
        </div>
      )}
    </div>
  );
};
