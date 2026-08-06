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
    return getStorage('quizzes', INITIAL_QUIZZES);
  },

  getQuizById: async (id) => {
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const quiz = quizzes.find(q => q.id === id);
    if (!quiz) throw new Error('Quiz not found');
    return quiz;
  },

  saveQuiz: async (quizData) => {
    const quizzes = getStorage('quizzes', INITIAL_QUIZZES);
    const categories = getStorage('categories', INITIAL_CATEGORIES);
    const cat = categories.find(c => c.id === quizData.categoryId);

    if (quizData.id) {
      // Edit existing
      const idx = quizzes.findIndex(q => q.id === quizData.id);
      if (idx !== -1) {
        quizzes[idx] = {
          ...quizzes[idx],
          ...quizData,
          categoryName: cat ? cat.name : quizzes[idx].categoryName
        };
        setStorage('quizzes', quizzes);
        return quizzes[idx];
      }
    }

    // Create new
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      ...quizData,
      categoryName: cat ? cat.name : 'General',
      status: quizData.status || 'Published',
      createdAt: new Date().toISOString().split('T')[0],
      thumbnail: quizData.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      questionsCount: 0,
      attemptsCount: 0,
      avgScore: 0
    };
    quizzes.push(newQuiz);
    setStorage('quizzes', quizzes);
    return newQuiz;
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
    return questions.filter(q => q.quizId === quizId);
  },

  saveQuestion: async (questionData) => {
    const questions = getStorage('questions', INITIAL_QUESTIONS);
    let updatedQuestion;

    if (questionData.id) {
      const idx = questions.findIndex(q => q.id === questionData.id);
      if (idx !== -1) {
        questions[idx] = { ...questions[idx], ...questionData };
        updatedQuestion = questions[idx];
      }
    } else {
      updatedQuestion = {
        id: `q-${Date.now()}`,
        ...questionData
      };
      questions.push(updatedQuestion);
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

    return updatedQuestion;
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
    const quizQuestions = questions.filter(q => q.quizId === quizId);
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
      const isCorrect = correctOpt && correctOpt.id === userSelId;
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
  }
};
