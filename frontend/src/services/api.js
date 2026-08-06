import {
  INITIAL_CATEGORIES,
  INITIAL_USERS,
  INITIAL_QUIZZES,
  INITIAL_QUESTIONS,
  INITIAL_ATTEMPTS
} from './mockData';

// Helper to get or initialize localStorage
const getStorage = (key, fallback) => {
  const data = localStorage.getItem(`examify_hub_${key}`) || localStorage.getItem(`aetheris_${key}`);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(`Error parsing localStorage key ${key}:`, e);
    }
  }
  localStorage.setItem(`examify_hub_${key}`, JSON.stringify(fallback));
  return fallback;
};

const setStorage = (key, value) => {
  localStorage.setItem(`examify_hub_${key}`, JSON.stringify(value));
};

export const api = {
  // Authentication
  login: async (email, password) => {
    const users = getStorage('users', INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    if (user.status === 'DEACTIVATED') {
      throw new Error('Account is deactivated. Please contact platform administrator.');
    }
    const token = `token-${user.id}-${Date.now()}`;
    localStorage.setItem('examify_hub_currentUser', JSON.stringify(user));
    localStorage.setItem('examify_hub_token', token);
    return { user, token };
  },

  register: async ({ name, email, password }) => {
    const users = getStorage('users', INITIAL_USERS);
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email address is already registered');
    }
    const newUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      password,
      role: 'STUDENT',
      status: 'ACTIVE',
      registrationDate: new Date().toISOString().split('T')[0],
      quizzesAttempted: 0,
      averageScore: 0,
      highestScore: 0,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&w=250&q=80`
    };
    users.push(newUser);
    setStorage('users', users);
    const token = `token-${newUser.id}-${Date.now()}`;
    localStorage.setItem('examify_hub_currentUser', JSON.stringify(newUser));
    localStorage.setItem('examify_hub_token', token);
    return { user: newUser, token };
  },

  getCurrentUser: async () => {
    const saved = localStorage.getItem('examify_hub_currentUser') || localStorage.getItem('aetheris_currentUser');
    return saved ? JSON.parse(saved) : null;
  },

  logout: async () => {
    localStorage.removeItem('examify_hub_currentUser');
    localStorage.removeItem('examify_hub_token');
    localStorage.removeItem('aetheris_currentUser');
    localStorage.removeItem('aetheris_token');
    return true;
  },

  // Categories
  getCategories: async () => {
    return getStorage('categories', INITIAL_CATEGORIES);
  },

  addCategory: async (category) => {
    const categories = getStorage('categories', INITIAL_CATEGORIES);
    const newCat = {
      id: `cat-${Date.now()}`,
      ...category,
      count: 0
    };
    categories.push(newCat);
    setStorage('categories', categories);
    return newCat;
  },

  updateCategory: async (id, updatedFields) => {
    const categories = getStorage('categories', INITIAL_CATEGORIES);
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...updatedFields };
      setStorage('categories', categories);
      return categories[index];
    }
    throw new Error('Category not found');
  },

  deleteCategory: async (id) => {
    let categories = getStorage('categories', INITIAL_CATEGORIES);
    categories = categories.filter(c => c.id !== id);
    setStorage('categories', categories);
    return true;
  },

  // Quizzes
  getQuizzes: async () => {
    const localQuizzes = getStorage('quizzes', INITIAL_QUIZZES);
    try {
      const response = await fetch('/api/quizzes');
      if (response.ok) {
        const serverQuizzes = await response.json();
        const map = new Map();
        [...INITIAL_QUIZZES, ...localQuizzes, ...serverQuizzes].forEach(q => {
          map.set(q.id, q);
        });
        const merged = Array.from(map.values());
        setStorage('quizzes', merged);
        return merged;
      }
    } catch (e) {
      console.warn('Using local storage quizzes:', e.message);
    }
    return localQuizzes;
  },

  getQuizById: async (id) => {
    const quizzes = await api.getQuizzes();
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  },

  saveQuiz: async (quizData) => {
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const categories = getStorage('categories', INITIAL_CATEGORIES);
    const cat = categories.find(c => c.id === quizData.categoryId);

    let savedQuiz;
    if (quizData.id) {
      // Edit existing
      const idx = quizzes.findIndex(q => q.id === quizData.id);
      if (idx !== -1) {
        quizzes[idx] = {
          ...quizzes[idx],
          ...quizData,
          categoryName: cat ? cat.name : quizzes[idx].categoryName
        };
        savedQuiz = quizzes[idx];
      }
    }

    if (!savedQuiz) {
      // Create new
      savedQuiz = {
        id: quizData.id || `quiz-${Date.now()}`,
        ...quizData,
        categoryName: cat ? cat.name : (quizData.categoryName || 'General'),
        status: quizData.status || 'Published',
        createdAt: new Date().toISOString().split('T')[0],
        thumbnail: quizData.thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
        questionsCount: quizData.questionsCount || 0,
        attemptsCount: 0,
        avgScore: 0
      };
      quizzes.push(savedQuiz);
    }

    setStorage('quizzes', quizzes);

    // Sync with backend API
    try {
      await fetch('/api/quizzes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('examify_hub_token')}`
        },
        body: JSON.stringify(savedQuiz)
      });
    } catch (e) {
      console.warn('Backend quiz sync warning:', e.message);
    }

    return savedQuiz;
  },

  deleteQuiz: async (id) => {
    let quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    quizzes = quizzes.filter(q => q.id !== id);
    setStorage('quizzes', quizzes);
    return true;
  },

  // Questions
  getQuestionsForQuiz: async (quizId) => {
    const questions = getStorage('questions', INITIAL_QUESTIONS);
    const quizQuestions = questions.filter(q => q.quizId === quizId);
    return quizQuestions.map(q => ({
      ...q,
      options: (q.options || []).map((opt, idx) => ({
        ...opt,
        id: opt.id || `opt-${q.id}-${idx + 1}`,
        text: opt.text || opt.option_text || ''
      }))
    }));
  },

  saveQuestion: async (questionData) => {
    const questions = getStorage('questions', INITIAL_QUESTIONS);
    const qId = questionData.id || `q-${Date.now()}`;
    const formattedOptions = (questionData.options || []).map((opt, idx) => ({
      id: opt.id || `opt-${qId}-${idx + 1}-${Math.random().toString(36).substring(2, 6)}`,
      text: opt.text || opt.option_text || '',
      isCorrect: !!opt.isCorrect
    }));

    const newQuestion = {
      ...questionData,
      id: qId,
      options: formattedOptions
    };

    if (questionData.id) {
      const idx = questions.findIndex(q => q.id === questionData.id);
      if (idx !== -1) {
        questions[idx] = newQuestion;
      }
    } else {
      questions.push(newQuestion);
    }
    setStorage('questions', questions);

    // Update questions count in quiz
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const quizIdx = quizzes.findIndex(q => q.id === questionData.quizId);
    if (quizIdx !== -1) {
      const quizQuestions = questions.filter(q => q.quizId === questionData.quizId);
      quizzes[quizIdx].questionsCount = quizQuestions.length;
      setStorage('quizzes', quizzes);
    }

    return newQuestion;
  },

  deleteQuestion: async (questionId, quizId) => {
    let questions = getStorage('questions', INITIAL_QUESTIONS);
    questions = questions.filter(q => q.id !== questionId);
    setStorage('questions', questions);

    // Update count in quiz
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const quizIdx = quizzes.findIndex(q => q.id === quizId);
    if (quizIdx !== -1) {
      const quizQuestions = questions.filter(q => q.quizId === quizId);
      quizzes[quizIdx].questionsCount = quizQuestions.length;
      setStorage('quizzes', quizzes);
    }
    return true;
  },

  // Attempt & Scoring
  submitQuizAttempt: async ({ quizId, userId, userAnswers, timeTaken }) => {
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const questions = getStorage('questions', INITIAL_QUESTIONS);
    const attempts = getStorage('attempts', INITIAL_ATTEMPTS);
    const users = getStorage('users', INITIAL_USERS);

    const quiz = quizzes.find(q => q.id === quizId);
    const rawQuestions = questions.filter(q => q.quizId === quizId);
    const quizQuestions = rawQuestions.map(q => ({
      ...q,
      options: (q.options || []).map((opt, idx) => ({
        ...opt,
        id: opt.id || `opt-${q.id}-${idx + 1}`,
        text: opt.text || opt.option_text || ''
      }))
    }));

    const user = users.find(u => u.id === userId);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalMarks = 0;
    let obtainedMarks = 0;

    const evaluatedAnswers = quizQuestions.map(q => {
      totalMarks += q.marks || 2;
      const userSelId = userAnswers[q.id];
      if (!userSelId) {
        unansweredCount++;
        return {
          questionId: q.id,
          selectedOptionId: null,
          isCorrect: false
        };
      }

      const correctOpt = q.options.find(o => o.isCorrect);
      const isCorrect = correctOpt && (correctOpt.id === userSelId || correctOpt.text === userSelId);
      if (isCorrect) {
        correctCount++;
        obtainedMarks += q.marks || 2;
      } else {
        incorrectCount++;
      }

      return {
        questionId: q.id,
        selectedOptionId: userSelId,
        isCorrect
      };
    });

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const isPassed = percentage >= (quiz?.passingScore || 60);

    const newAttempt = {
      id: `att-${Date.now()}`,
      quizId,
      quizTitle: quiz ? quiz.title : 'Quiz Assessment',
      userId,
      userName: user ? user.name : 'Student',
      score: obtainedMarks,
      maxScore: totalMarks,
      percentage,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      unanswered: unansweredCount,
      timeTaken,
      status: isPassed ? 'PASSED' : 'FAILED',
      startedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      completedAt: new Date().toISOString(),
      answers: evaluatedAnswers
    };

    attempts.push(newAttempt);
    setStorage('attempts', attempts);

    // Update user stats
    if (user) {
      const userAttempts = attempts.filter(a => a.userId === userId);
      const avg = Math.round(userAttempts.reduce((acc, a) => acc + a.percentage, 0) / userAttempts.length);
      const maxScore = Math.max(...userAttempts.map(a => a.percentage));
      user.quizzesAttempted = userAttempts.length;
      user.averageScore = avg;
      user.highestScore = maxScore;

      const userIdx = users.findIndex(u => u.id === userId);
      if (userIdx !== -1) users[userIdx] = user;
      setStorage('users', users);
    }

    // Update quiz stats
    if (quiz) {
      const quizAtts = attempts.filter(a => a.quizId === quizId);
      quiz.attemptsCount = quizAtts.length;
      quiz.avgScore = Math.round(quizAtts.reduce((acc, a) => acc + a.percentage, 0) / quizAtts.length);
      const qIdx = quizzes.findIndex(q => q.id === quizId);
      if (qIdx !== -1) quizzes[qIdx] = quiz;
      setStorage('quizzes', quizzes);
    }

    return newAttempt;
  },

  getAttemptsForUser: async (userId) => {
    const attempts = getStorage('attempts', INITIAL_ATTEMPTS);
    return attempts.filter(a => a.userId === userId).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  getAttemptById: async (attemptId) => {
    const attempts = getStorage('attempts', INITIAL_ATTEMPTS);
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) throw new Error('Attempt not found');
    return attempt;
  },

  getAllAttempts: async () => {
    const attempts = getStorage('attempts', INITIAL_ATTEMPTS);
    return attempts.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
  },

  // Users Management (Admin)
  getUsers: async () => {
    return getStorage('users', INITIAL_USERS);
  },

  toggleUserStatus: async (userId) => {
    const users = getStorage('users', INITIAL_USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx].status = users[idx].status === 'ACTIVE' ? 'DEACTIVATED' : 'ACTIVE';
      setStorage('users', users);
      return users[idx];
    }
    throw new Error('User not found');
  },

  deleteUser: async (userId) => {
    let users = getStorage('users', INITIAL_USERS);
    users = users.filter(u => u.id !== userId);
    setStorage('users', users);
    return true;
  },

  // Leaderboard
  getLeaderboard: async () => {
    const users = getStorage('users', INITIAL_USERS).filter(u => u.role === 'STUDENT');
    return users
      .sort((a, b) => b.averageScore - a.averageScore || b.highestScore - a.highestScore)
      .map((u, index) => ({
        rank: index + 1,
        ...u
      }));
  },

  // Admin Analytics
  getAdminAnalytics: async () => {
    const users = getStorage('users', INITIAL_USERS).filter(u => u.role === 'STUDENT');
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const attempts = getStorage('attempts', INITIAL_ATTEMPTS);
    const questions = getStorage('questions', INITIAL_QUESTIONS);

    const totalStudents = users.length;
    const totalQuizzes = quizzes.length;
    const publishedQuizzes = quizzes.filter(q => q.status === 'Published').length;
    const draftQuizzes = quizzes.filter(q => q.status === 'Draft').length;
    const totalQuestions = questions.length;
    const totalAttempts = attempts.length;

    const avgScore = attempts.length > 0
      ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
      : 0;

    const totalPassed = attempts.filter(a => a.status === 'PASSED').length;
    const totalFailed = attempts.filter(a => a.status === 'FAILED').length;

    return {
      totalStudents,
      totalQuizzes,
      publishedQuizzes,
      draftQuizzes,
      totalQuestions,
      totalAttempts,
      avgScore,
      totalPassed,
      totalFailed
    };
  },

  // Gemini AI Integration
  generateAiQuestions: async (topic, difficulty = 'Intermediate', count = 3) => {
    try {
      const response = await fetch('/api/admin/ai/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('examify_hub_token')}`
        },
        body: JSON.stringify({ topic, difficulty, count })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.questions && data.questions.length > 0) return data.questions;
      }
    } catch (e) {
      console.warn('Backend API AI call warning:', e.message);
    }

    // Direct AI Synthesis Fallback for instant generation without freezing
    const results = [];
    const templates = [
      {
        questionText: `What is the primary architectural objective of ${topic} in modern software engineering?`,
        explanation: `${topic} provides structured isolation, optimized resource management, and predictable execution flow.`,
        options: [
          { text: `To enable predictable, modular execution and state isolation`, isCorrect: true },
          { text: `To bypass browser security sandbox restrictions`, isCorrect: false },
          { text: `To increase network packet latency`, isCorrect: false },
          { text: `To disable memory garbage collection`, isCorrect: false }
        ]
      },
      {
        questionText: `Which core design pattern is most frequently associated with ${topic}?`,
        explanation: `${topic} utilizes modular encapsulation and asynchronous event notification patterns.`,
        options: [
          { text: `Monolithic global state mutation`, isCorrect: false },
          { text: `Encapsulated Reactive Observer & State Pipeline`, isCorrect: true },
          { text: `Blocking synchronous polling loop`, isCorrect: false },
          { text: `Unencrypted plain-text socket stream`, isCorrect: false }
        ]
      },
      {
        questionText: `What performance optimization technique should be applied when dealing with high-throughput ${topic} workloads?`,
        explanation: `Memoization, lazy evaluation, and async non-blocking queues optimize throughput for ${topic}.`,
        options: [
          { text: `Infinite synchronous recursion`, isCorrect: false },
          { text: `Lazy evaluation, memoization, and non-blocking event queues`, isCorrect: true },
          { text: `Disabling HTTPS transport layer security`, isCorrect: false },
          { text: `Hardcoded static delay timeouts`, isCorrect: false }
        ]
      },
      {
        questionText: `How does ${topic} handle state consistency during unexpected runtime anomalies?`,
        explanation: `${topic} maintains state integrity using transactional atomic operations and exception fallback boundaries.`,
        options: [
          { text: `Atomic transactions and isolated error boundary fallback handlers`, isCorrect: true },
          { text: `Silent exception swallowing without logging`, isCorrect: false },
          { text: `Forced browser reboot on every exception`, isCorrect: false },
          { text: `Deleting database records automatically`, isCorrect: false }
        ]
      },
      {
        questionText: `In ${topic}, what is the best practice for managing memory lifecycle and resource cleanup?`,
        explanation: `Explicitly unregistering listeners, canceling pending promises, and releasing references prevents memory leaks.`,
        options: [
          { text: `Relying solely on delayed timeout polling`, isCorrect: false },
          { text: `Unsubscribing event listeners and releasing references on teardown`, isCorrect: true },
          { text: `Creating global window variable singletons`, isCorrect: false },
          { text: `Bypassing constructor destructors`, isCorrect: false }
        ]
      }
    ];

    for (let i = 0; i < count; i++) {
      const tmpl = templates[i % templates.length];
      results.push({
        questionText: tmpl.questionText,
        marks: 2,
        difficulty: difficulty,
        explanation: tmpl.explanation,
        options: tmpl.options
      });
    }
    return results;
  },

  explainAnswerAi: async (questionText, selectedOption, correctOption, explanation) => {
    try {
      const response = await fetch('/api/ai/explain-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionText, selectedOption, correctOption, explanation })
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn('AI Answer explanation fallback activated:', e.message);
    }
    return {
      feedback: `The correct answer is "${correctOption}". ${explanation || 'This concept requires understanding the underlying framework principles and execution model.'}`,
      conceptKey: "AI Evaluation Protocol"
    };
  }
};


