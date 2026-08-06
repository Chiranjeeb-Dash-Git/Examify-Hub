import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, HelpCircle, Eye, EyeOff, BookOpen, Clock, Image as ImageIcon } from 'lucide-react';

export const AdminQuizzesPage = () => {
  const { quizzes, categories, refreshData } = useQuiz();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
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
    const nextStatus = quiz.status === 'Published' ? 'Unpublished' : 'Published';
    try {
      await api.saveQuiz({ ...quiz, status: nextStatus });
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

  return (
    <div className="min-h-screen bg-[#10141a] flex">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Quiz <span className="text-[#38BDF8]">Management</span>
            </h1>
            <p className="mt-1 text-sm text-[#88929b] font-mono">
              Create, edit, publish, or configure assessment directives
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-xs hover:bg-[#38BDF8]/90 transition-all flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Quiz
          </button>
        </div>

        {/* Quizzes Grid with Theme Image Banner Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group">
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

                {/* Status Badge */}
                <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold backdrop-blur-md ${quiz.status === 'Published' ? 'bg-[#6be026]/20 text-[#6be026] border border-[#6be026]/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                  {quiz.status}
                </span>

                {/* Category Tag */}
                <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-[#38BDF8] bg-[#10141a]/80 border border-[#38BDF8]/30 backdrop-blur-md">
                  {quiz.categoryName}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-[#88929b] line-clamp-2 leading-relaxed">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-[#88929b]">
                  <span>{quiz.duration} mins</span>
                  <span>{quiz.questionsCount || 0} Questions</span>
                  <span>Pass: {quiz.passingScore}%</span>
                </div>

                {/* Action Toolbar */}
                <div className="pt-2 flex items-center justify-between gap-2 font-sans text-xs">
                  <Link
                    to={`/admin/quizzes/${quiz.id}/questions`}
                    className="px-3 py-1.5 rounded-lg bg-[#262a31] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-[#10141a] font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <HelpCircle className="h-3.5 w-3.5" />
                    Manage Questions
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(quiz)}
                      className="p-1.5 rounded-lg bg-[#181c22] text-[#88929b] hover:text-white"
                      title={quiz.status === 'Published' ? 'Unpublish' : 'Publish'}
                    >
                      {quiz.status === 'Published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(quiz)}
                      className="p-1.5 rounded-lg bg-[#181c22] text-[#88929b] hover:text-white"
                      title="Edit Quiz"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(quiz.id)}
                      className="p-1.5 rounded-lg bg-[#181c22] text-red-400 hover:bg-red-500/20"
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

      {/* Create / Edit Quiz Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">
              {editingQuiz ? 'Edit Quiz Directive' : 'Create Quiz Directive'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Quiz Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. JavaScript Fundamentals"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter detailed description..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              {/* Cover Pic / Thumbnail Image Field */}
              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Cover Image / Thumbnail URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#88929b]" />
                  <input
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <p className="text-[10px] text-[#88929b] mt-1">Leave empty to use automatic category cover image</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#88929b] uppercase font-mono mb-1">Category</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#88929b] uppercase font-mono mb-1">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono">
                <div>
                  <label className="block text-[#88929b] text-[10px] uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#88929b] text-[10px] uppercase mb-1">Pass Score (%)</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    required
                    value={formData.passingScore}
                    onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#88929b] text-[10px] uppercase mb-1">Max Attempts</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.maxAttempts}
                    onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Unpublished">Unpublished</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#262a31] text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold hover:bg-[#38BDF8]/90"
                >
                  Save Quiz Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
