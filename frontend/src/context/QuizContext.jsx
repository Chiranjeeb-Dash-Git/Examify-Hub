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
    const questions = await api.getQuestionsForQuiz(quizId);
    if (!questions || questions.length === 0) {
      throw new Error('This quiz currently has no questions available.');
    }
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
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
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
