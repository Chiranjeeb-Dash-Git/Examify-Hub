import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const QuizContext = createContext(null);

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active quiz attempt state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState(null);

  const fetchQuizzesAndCategories = useCallback(async () => {
    try {
      setLoading(true);
      const [qData, cData] = await Promise.all([
        api.getQuizzes(),
        api.getCategories()
      ]);
      setQuizzes(qData);
      setCategories(cData);
    } catch (err) {
      console.error('Error fetching quiz data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzesAndCategories();
  }, [fetchQuizzesAndCategories]);

  // Start a Quiz Session
  const startQuizSession = async (quizId) => {
    const quiz = await api.getQuizById(quizId);
    let questions = await api.getQuestionsForQuiz(quizId);
    console.log('[QuizContext startQuizSession] Quiz:', quiz);
    console.log('[QuizContext startQuizSession] Questions received:', questions);

    // ── DEFENSE IN DEPTH: if API-layer fallback didn't produce questions, run AI generation inline ──
    if (!questions || questions.length === 0) {
      console.warn('[QuizContext startQuizSession] API returned empty questions; triggering inline Gemini AI generation...');
      const topic = quiz?.title || quiz?.name || quizId;
      const difficulty = quiz?.difficulty || 'Intermediate';
      const count = Number(quiz?.questionsCount) >= 5 ? Number(quiz.questionsCount) : (
        difficulty === 'Beginner' || difficulty === 'Easy' ? 8 :
        difficulty === 'Advanced' ? 12 : 10
      );
      try {
        const generated = await api.generateAiQuestions(topic, difficulty, count);
        console.log('[QuizContext startQuizSession] Inline AI generated:', generated);
        for (let gq of generated) {
          await api.saveQuestion({
            quizId,
            questionText: gq.questionText || gq.text || gq.question || '',
            marks: gq.marks || 2,
            difficulty: gq.difficulty || difficulty,
            explanation: gq.explanation || '',
            options: (gq.options || []).map((o, oi) => ({
              id: `opt-ai-inline-${Date.now()}-${oi}-${Math.random().toString(36).slice(2,6)}`,
              text: o.text || o.option_text || o.content || '',
              isCorrect: typeof o.isCorrect === 'boolean' ? o.isCorrect : !!o.correct || !!o.is_correct
            }))
          });
        }
        questions = await api.getQuestionsForQuiz(quizId);
        console.log('[QuizContext startQuizSession] Questions after AI save:', questions);
      } catch (aiErr) {
        console.error('[QuizContext startQuizSession] Inline AI generation failed:', aiErr);
      }
    }

    if (!questions || questions.length === 0) {
      throw new Error('This quiz currently has no questions available.');
    }
    questions.forEach((q, i) => {
      if (!q.questionText || !q.questionText.trim()) {
        console.warn(`[QuizContext WARN] Question ${i} has empty questionText. Raw:`, q);
      }
    });
    setActiveQuiz(quiz);
    setActiveQuestions(questions);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setRemainingSeconds((quiz.duration || 15) * 60);
    setIsQuizSubmitted(false);
    setLatestAttempt(null);
  };

  // Submit active quiz session
  const submitActiveQuizSession = async (userId) => {
    if (!activeQuiz || isQuizSubmitted) return;

    setIsQuizSubmitted(true);
    const totalTimeLimit = (activeQuiz.duration || 15) * 60;
    const elapsedSeconds = totalTimeLimit - remainingSeconds;
    const mins = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
    const secs = (elapsedSeconds % 60).toString().padStart(2, '0');
    const timeTaken = `${mins}:${secs}`;

    try {
      const attemptResult = await api.submitQuizAttempt({
        quizId: activeQuiz.id,
        userId: userId || 'usr-1',
        userAnswers,
        timeTaken
      });
      setLatestAttempt(attemptResult);
      await fetchQuizzesAndCategories();
      return attemptResult;
    } catch (err) {
      console.error('Failed to submit quiz attempt:', err);
      throw err;
    }
  };

  const selectAnswer = (questionId, optionId) => {
    setUserAnswers(prev => {
      // Strict Industry Lock: Once an answer is selected for a question, lock it permanently!
      if (prev[questionId]) {
        return prev;
      }
      return {
        ...prev,
        [questionId]: optionId
      };
    });
  };

  const value = {
    quizzes,
    categories,
    loading,
    refreshData: fetchQuizzesAndCategories,

    // Active Attempt State
    activeQuiz,
    activeQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    userAnswers,
    selectAnswer,
    remainingSeconds,
    setRemainingSeconds,
    isQuizSubmitted,
    latestAttempt,
    startQuizSession,
    submitActiveQuizSession
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
