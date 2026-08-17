import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { HudAdminLayout } from '../../components/HudAdminLayout';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

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
      const qList = await api.getQuestionsForQuiz(quizId, { skipAiGeneration: true });
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

  const handleAddOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [
        ...prev.options,
        { id: `opt-${Date.now()}-${prev.options.length + 1}`, text: '', isCorrect: false }
      ]
    }));
  };

  const handleRemoveOption = (idx) => {
    if (formData.options.length <= 2) {
      alert('Minimum 2 options required.');
      return;
    }
    setFormData(prev => {
      const newOpts = prev.options.filter((_, i) => i !== idx);
      const wasCorrect = prev.options[idx]?.isCorrect;
      if (wasCorrect && newOpts.length > 0) {
        newOpts[0].isCorrect = true;
      }
      return { ...prev, options: newOpts };
    });
  };

  return (
    <HudAdminLayout>
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-6">
        <Link to="/admin/quizzes" className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Quiz Directives</span>
        </Link>

        {/* Header Title Bar */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
          <div>
            <h1 
              className="text-3xl font-medium text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Question Bank: {quiz?.title || 'Quiz'}
            </h1>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Manage question entries, option choices, explanations, or generate with Gemini AI
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setShowAiModal(true)}
              className="liquid-glass rounded-full px-5 py-2.5 text-xs font-medium text-white hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer border border-white/20"
            >
              <Sparkles className="h-4 w-4 text-white" />
              <span>Generate with Gemini AI</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleOpenModal()}
              className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-white/90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10"
            >
              <Plus className="h-4 w-4" />
              <span>Add Question</span>
            </motion.button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4 max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-12 text-white/40 text-xs">Loading questions...</div>
          ) : questions.length === 0 ? (
            <div className="liquid-glass p-8 text-center text-white/60 rounded-3xl border border-white/10 space-y-4 backdrop-blur-xl">
              <p className="text-xs">No questions found for this quiz directive.</p>
              <button
                onClick={() => setShowAiModal(true)}
                className="px-5 py-2 rounded-full liquid-glass border border-white/30 text-white font-medium text-xs"
              >
                ✨ Auto-Generate Questions with Gemini AI
              </button>
            </div>
          ) : (
            questions.map((q, idx) => (
              <div key={q.id} className="liquid-glass p-6 rounded-3xl border border-white/10 space-y-4 backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 text-xs text-white/60">
                  <span>Question {idx + 1} • {q.marks || 2} Marks ({q.difficulty})</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleOpenModal(q)} className="p-1.5 rounded-full liquid-glass text-white/70 hover:text-white" title="Edit">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteQuestion(q.id)} className="p-1.5 rounded-full liquid-glass text-white/70 hover:text-red-400" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h4 className="text-base font-medium text-white">{q.questionText}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options?.map((opt, oIdx) => (
                    <div
                      key={opt.id || oIdx}
                      className={`p-3 rounded-2xl border flex items-center justify-between ${
                        opt.isCorrect
                          ? 'liquid-glass border-white/40 text-white font-semibold'
                          : 'bg-white/[0.02] border-white/10 text-white/60'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {opt.isCorrect && <CheckCircle2 className="h-4 w-4 text-white shrink-0" />}
                    </div>
                  ))}
                </div>

                {q.explanation && (
                  <p className="text-xs text-white/50 pt-1">
                    <strong className="text-white">Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Question Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-xl liquid-glass p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 bg-black/90 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {editingQuestion ? 'Edit Question' : 'Create New Question'}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Question Prompt</label>
                <textarea
                  required
                  rows={3}
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter the question prompt statement..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Marks</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-white/60 uppercase text-[10px] tracking-wider">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40 cursor-pointer"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Explanation (optional)</label>
                <textarea
                  rows={2}
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why the correct answer is right..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="block text-white/80 font-semibold uppercase text-[10px]">Options (Select radio for correct choice)</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white/80 hover:text-white hover:border-cyan-400/50 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> <span className="text-[10px] uppercase tracking-wider">Add Option</span>
                  </button>
                </div>
                {formData.options.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={opt.isCorrect}
                      onChange={() => setCorrectOption(idx)}
                      className="accent-white h-4 w-4 cursor-pointer shrink-0"
                    />
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={(e) => handleOptionTextChange(idx, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      className="w-full p-2.5 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="p-2 rounded-full text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                      title="Remove option"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
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
                  Save Question
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Gemini AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg liquid-glass p-6 sm:p-8 rounded-3xl border border-white/20 space-y-6 bg-black/90">
            <div className="flex items-center gap-3 text-white">
              <Sparkles className="h-6 w-6 text-white" />
              <h3 className="text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>Gemini AI Question Generator</h3>
            </div>

            <form onSubmit={handleGenerateAiQuestions} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Topic / Concept Directive</label>
                <input
                  type="text"
                  required
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. React Hooks, Async/Await"
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAiModal(false)}
                  disabled={aiGenerating}
                  className="px-5 py-2.5 rounded-full liquid-glass text-white/80 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={aiGenerating}
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium uppercase tracking-wider hover:bg-white/90 flex items-center gap-2"
                >
                  {aiGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate & Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
    </HudAdminLayout>
  );
};
