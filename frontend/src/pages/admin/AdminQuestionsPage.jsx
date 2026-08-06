import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle2 } from 'lucide-react';

export const AdminQuestionsPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [formData, setFormData] = useState({
    questionText: '',
    marks: 2,
    difficulty: 'Easy',
    explanation: '',
    options: [
      { id: 'opt-a', text: '', isCorrect: true },
      { id: 'opt-b', text: '', isCorrect: false },
      { id: 'opt-c', text: '', isCorrect: false },
      { id: 'opt-d', text: '', isCorrect: false }
    ]
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const qQuiz = await api.getQuizById(quizId);
      setQuiz(qQuiz);
      const qList = await api.getQuestionsForQuiz(quizId);
      setQuestions(qList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [quizId]);

  const handleOpenModal = (q = null) => {
    if (q) {
      setEditingQuestion(q);
      setFormData({
        id: q.id,
        quizId: q.quizId,
        questionText: q.questionText,
        marks: q.marks || 2,
        difficulty: q.difficulty || 'Easy',
        explanation: q.explanation || '',
        options: q.options || []
      });
    } else {
      setEditingQuestion(null);
      setFormData({
        questionText: '',
        marks: 2,
        difficulty: 'Easy',
        explanation: '',
        options: [
          { id: `opt-${Date.now()}-1`, text: '', isCorrect: true },
          { id: `opt-${Date.now()}-2`, text: '', isCorrect: false },
          { id: `opt-${Date.now()}-3`, text: '', isCorrect: false },
          { id: `opt-${Date.now()}-4`, text: '', isCorrect: false }
        ]
      });
    }
    setShowModal(true);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.saveQuestion({
        ...formData,
        quizId
      });
      await loadData();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteQuestion = async (qId) => {
    if (window.confirm('Delete this question from bank?')) {
      try {
        await api.deleteQuestion(qId, quizId);
        await loadData();
      } catch (e) {
        alert(e.message);
      }
    }
  };

  const setCorrectOption = (optIndex) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === optIndex
      }))
    }));
  };

  const handleOptionTextChange = (idx, text) => {
    setFormData(prev => {
      const newOpts = [...prev.options];
      newOpts[idx].text = text;
      return { ...prev, options: newOpts };
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] flex text-white font-body">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        <Link to="/admin/quizzes" className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Quiz Directives</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="font-display font-extrabold text-3xl text-white tracking-tight">
              Question Bank: <span className="text-white/80">{quiz?.title || 'Quiz'}</span>
            </h1>
            <p className="mt-1 text-sm text-white/60 font-mono">
              Manage items, options, correct answers, and explanations
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-[#88929b]">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="glass-panel p-8 text-center text-[#88929b] rounded-3xl border border-white/10">
              No questions found for this quiz directive. Click "Add Question" to begin.
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3">
                  <span className="text-xs font-mono text-[#38BDF8]">
                    Question {idx + 1} (Marks: {q.marks || 2})
                  </span>

                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(q)} className="p-1.5 rounded-lg bg-[#262a31] text-[#dfe2eb] hover:text-white">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white leading-snug">{q.questionText}</h3>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((opt) => (
                    <div
                      key={opt.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                        opt.isCorrect
                          ? 'bg-[#6be026]/10 border-[#6be026]/40 text-[#6be026] font-bold'
                          : 'bg-[#10141a] border-white/5 text-[#88929b]'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-[#6be026]" />}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <div className="p-3 rounded-xl bg-[#181c22] text-xs text-[#88929b]">
                    <strong className="text-[#38BDF8]">Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add / Edit Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel p-6 rounded-3xl border border-white/10 space-y-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white">
              {editingQuestion ? 'Edit Question Item' : 'Add New Question Item'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Question Prompt</label>
                <textarea
                  required
                  rows={3}
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Which method converts a JSON string..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              {/* Options Form */}
              <div className="space-y-2">
                <label className="block text-[#88929b] uppercase font-mono">Multiple Choice Options (Select Correct Answer)</label>
                {formData.options.map((opt, idx) => (
                  <div key={opt.id || idx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => setCorrectOption(idx)}
                      className="h-4 w-4 text-[#6be026] focus:ring-[#6be026]"
                    />
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                      className="flex-grow px-3 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Explanation</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why the correct answer is right..."
                  className="w-full px-3.5 py-2 rounded-xl bg-[#10141a] border border-white/10 text-white focus:outline-none focus:border-[#38BDF8]"
                />
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
                  className="px-5 py-2 rounded-xl bg-[#6be026] text-[#10141a] font-bold hover:bg-[#6be026]/90"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
