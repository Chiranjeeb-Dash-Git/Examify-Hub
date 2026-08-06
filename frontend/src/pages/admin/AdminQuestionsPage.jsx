import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AdminSidebar } from '../../components/AdminSidebar';
import { api } from '../../services/api';
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle2, Sparkles, Bot, Loader2 } from 'lucide-react';

export const AdminQuestionsPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  // Gemini AI Modal State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiDifficulty, setAiDifficulty] = useState('Intermediate');
  const [aiCount, setAiCount] = useState(3);
  const [aiGenerating, setAiGenerating] = useState(false);

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
      if (qQuiz) setAiTopic(qQuiz.title);
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

  const handleGenerateAiQuestions = async (e) => {
    e.preventDefault();
    setAiGenerating(true);
    try {
      const generated = await api.generateAiQuestions(
        aiTopic || quiz?.title || 'Technical Assessment',
        aiDifficulty,
        aiCount
      );
      
      for (let q of generated) {
        await api.saveQuestion({
          quizId,
          questionText: q.questionText,
          marks: q.marks || 2,
          difficulty: q.difficulty || aiDifficulty,
          explanation: q.explanation || '',
          options: q.options
        });
      }
      
      await loadData();
      setShowAiModal(false);
    } catch (err) {
      alert(`Gemini AI Generation Failed: ${err.message}`);
    } finally {
      setAiGenerating(false);
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
              Manage questions, correct answers, explanations, or generate via Gemini AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAiModal(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Generate with Gemini AI</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg shadow-white/10"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-white/40 font-mono text-xs">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="glass-panel p-8 text-center text-white/60 rounded-3xl border border-white/10 space-y-4 bg-[#0a0a0c]">
              <p className="font-mono text-sm">No questions found for this quiz directive.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowAiModal(true)}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono text-xs font-bold uppercase"
                >
                  ✨ Auto-Generate Questions with Gemini AI
                </button>
              </div>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 bg-[#0a0a0c]">
                <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-3 font-mono text-xs">
                  <span className="text-white/60">
                    Question {idx + 1} • {q.marks || 2} Marks ({q.difficulty})
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(q)}
                      className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                      title="Edit Question"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-1.5 rounded-lg text-white/60 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Question"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-bold text-white font-body">{q.questionText}</h4>

                {/* Options list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
                  {q.options?.map((opt, oIdx) => (
                    <div
                      key={opt.id || oIdx}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        opt.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 font-bold'
                          : 'bg-[#050505] border-white/10 text-white/60'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <p className="text-xs text-white/50 font-mono pt-1">
                    <strong className="text-white">Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Manual Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-6 bg-[#0a0a0c] max-h-[90vh] overflow-y-auto">
            <h3 className="font-display text-xl font-bold text-white">
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase">Question Prompt</label>
                <textarea
                  required
                  rows={3}
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter the question prompt statement..."
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white placeholder-white/30 font-body text-sm focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) || 2 })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Options Inputs */}
              <div className="space-y-3 pt-2">
                <label className="block text-white/80 font-bold uppercase">Options (Select radio for correct option)</label>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => setCorrectOption(idx)}
                      className="accent-emerald-400 h-4 w-4"
                    />
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      className="w-full p-2.5 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-xs focus:outline-none focus:border-white/40"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="block text-white/60 uppercase">Explanation (Optional)</label>
                <input
                  type="text"
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Reference explanation for candidates..."
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-xs"
                />
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gemini AI Generator Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/30 space-y-6 bg-[#0a0a0c]">
            <div className="flex items-center gap-3 text-purple-300">
              <Sparkles className="h-6 w-6 text-purple-400" />
              <h3 className="font-display text-xl font-bold text-white">Gemini AI Question Generator</h3>
            </div>

            <p className="text-xs text-white/60 font-mono leading-relaxed">
              Use Google Gemini AI to instantly generate structured multiple-choice questions with answer choices and explanations.
            </p>

            <form onSubmit={handleGenerateAiQuestions} className="space-y-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase">Topic / Directive Concept</label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. React Hooks, Cryptography, Async/Await"
                  className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-body text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Target Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase">Question Count</label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(parseInt(e.target.value) || 3)}
                    className="w-full p-3 rounded-xl bg-[#050505] border border-white/10 text-white font-mono text-xs"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={aiGenerating}
                  className="px-4 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold uppercase tracking-wider hover:bg-purple-500 flex items-center gap-2 shadow-lg shadow-purple-600/30"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate & Save Questions</span>
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
