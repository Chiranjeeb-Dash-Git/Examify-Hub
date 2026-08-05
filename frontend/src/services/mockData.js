// Initial Mock Data for Aetheris Assessment Platform

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'JavaScript', description: 'Core ES6+, closures, async/await, and browser runtime engines.', count: 4 },
  { id: 'cat-2', name: 'React', description: 'JSX, hooks, component lifecycle, virtual DOM, and state management.', count: 3 },
  { id: 'cat-3', name: 'Cyber Security', description: 'Cryptography, network defense, web security vulnerabilities, and protocols.', count: 2 },
  { id: 'cat-4', name: 'Python', description: 'Data structures, OOP, decorators, generators, and standard libraries.', count: 3 },
  { id: 'cat-5', name: 'Computer Networks', description: 'OSI model, TCP/IP, DNS, routing algorithms, and socket programming.', count: 2 },
  { id: 'cat-6', name: 'Database Systems', description: 'SQL query optimization, indexing, ACID transactions, and NoSQL.', count: 2 }
];

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Rahul Sharma',
    email: 'student@aetheris.io',
    password: 'password123',
    role: 'STUDENT',
    status: 'ACTIVE',
    registrationDate: '2026-01-15',
    quizzesAttempted: 15,
    averageScore: 86,
    highestScore: 98,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'usr-2',
    name: 'Priya Patel',
    email: 'priya@aetheris.io',
    password: 'password123',
    role: 'STUDENT',
    status: 'ACTIVE',
    registrationDate: '2026-02-01',
    quizzesAttempted: 12,
    averageScore: 93,
    highestScore: 100,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'usr-3',
    name: 'Amit Kumar',
    email: 'amit@aetheris.io',
    password: 'password123',
    role: 'STUDENT',
    status: 'ACTIVE',
    registrationDate: '2026-02-10',
    quizzesAttempted: 10,
    averageScore: 91,
    highestScore: 96,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80'
  },
  {
    id: 'usr-admin',
    name: 'Admin Commander',
    email: 'admin@aetheris.io',
    password: 'adminpassword',
    role: 'ADMIN',
    status: 'ACTIVE',
    registrationDate: '2025-12-01',
    quizzesAttempted: 0,
    averageScore: 0,
    highestScore: 0,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80'
  }
];

export const INITIAL_QUIZZES = [
  {
    id: 'quiz-js-101',
    title: 'JavaScript Fundamentals',
    description: 'Master core JavaScript concepts including data types, closures, event loop, promises, and ES6 features.',
    categoryId: 'cat-1',
    categoryName: 'JavaScript',
    difficulty: 'Intermediate', // Beginner, Intermediate, Advanced
    duration: 15, // minutes
    passingScore: 60, // percentage
    maxAttempts: 3,
    status: 'Published', // Draft, Published, Unpublished
    createdAt: '2026-03-01',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80',
    questionsCount: 5,
    attemptsCount: 342,
    avgScore: 82
  },
  {
    id: 'quiz-react-201',
    title: 'Quantum React & State Protocols',
    description: 'Deep dive into React 19 concurrent rendering, custom hooks optimization, state boundary isolation, and Server Components.',
    categoryId: 'cat-2',
    categoryName: 'React',
    difficulty: 'Advanced',
    duration: 20,
    passingScore: 70,
    maxAttempts: 2,
    status: 'Published',
    createdAt: '2026-03-05',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80',
    questionsCount: 5,
    attemptsCount: 289,
    avgScore: 75
  },
  {
    id: 'quiz-sec-301',
    title: 'Cypher Fundamentals & Cryptography',
    description: 'Basic decryption methodologies, asymmetric encryption, public key infrastructure, and secure communication protocols.',
    categoryId: 'cat-3',
    categoryName: 'Cyber Security',
    difficulty: 'Beginner',
    duration: 15,
    passingScore: 60,
    maxAttempts: 5,
    status: 'Published',
    createdAt: '2026-03-10',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
    questionsCount: 4,
    attemptsCount: 512,
    avgScore: 88
  },
  {
    id: 'quiz-py-101',
    title: 'Python Core & Neural Constructs',
    description: 'Analyze structural compositions of Python memory management, list comprehensions, decorators, and async generators.',
    categoryId: 'cat-4',
    categoryName: 'Python',
    difficulty: 'Intermediate',
    duration: 30,
    passingScore: 65,
    maxAttempts: 3,
    status: 'Published',
    createdAt: '2026-03-12',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80',
    questionsCount: 5,
    attemptsCount: 410,
    avgScore: 79
  },
  {
    id: 'quiz-db-201',
    title: 'Database Systems & SQL Telemetry',
    description: 'Relational algebra, B-Tree indexes, transaction isolation levels, WAL logs, and query execution plans.',
    categoryId: 'cat-6',
    categoryName: 'Database Systems',
    difficulty: 'Intermediate',
    duration: 25,
    passingScore: 60,
    maxAttempts: 2,
    status: 'Published',
    createdAt: '2026-03-15',
    thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
    questionsCount: 4,
    attemptsCount: 195,
    avgScore: 72
  }
];

export const INITIAL_QUESTIONS = [
  // JavaScript Questions
  {
    id: 'q-js-1',
    quizId: 'quiz-js-101',
    questionText: 'Which method converts a JSON string into a JavaScript object?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'JSON.parse() parses a JSON string and constructs the JavaScript value or object described by the string.',
    options: [
      { id: 'opt-1', text: 'JSON.stringify()', isCorrect: false },
      { id: 'opt-2', text: 'JSON.parse()', isCorrect: true },
      { id: 'opt-3', text: 'JSON.convert()', isCorrect: false },
      { id: 'opt-4', text: 'JSON.toObject()', isCorrect: false }
    ]
  },
  {
    id: 'q-js-2',
    quizId: 'quiz-js-101',
    questionText: 'Which keyword is used to declare a block-scoped variable that cannot be reassigned?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'const creates block-scoped variables whose value cannot be changed through re-assignment.',
    options: [
      { id: 'opt-5', text: 'var', isCorrect: false },
      { id: 'opt-6', text: 'let', isCorrect: false },
      { id: 'opt-7', text: 'const', isCorrect: true },
      { id: 'opt-8', text: 'static', isCorrect: false }
    ]
  },
  {
    id: 'q-js-3',
    quizId: 'quiz-js-101',
    questionText: 'What is the output of `console.log(typeof typeof 1)` in JavaScript?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'typeof 1 evaluates to "number". Then typeof "number" evaluates to "string".',
    options: [
      { id: 'opt-9', text: '"number"', isCorrect: false },
      { id: 'opt-10', text: '"string"', isCorrect: true },
      { id: 'opt-11', text: '"undefined"', isCorrect: false },
      { id: 'opt-12', text: '"object"', isCorrect: false }
    ]
  },
  {
    id: 'q-js-4',
    quizId: 'quiz-js-101',
    questionText: 'What will `Promise.all()` do if one of the passed promises rejects?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'Promise.all rejects immediately with the reason of the first promise that rejected (short-circuiting).',
    options: [
      { id: 'opt-13', text: 'Waits for all promises and ignores the error', isCorrect: false },
      { id: 'opt-14', text: 'Immediately rejects with the first rejection reason', isCorrect: true },
      { id: 'opt-15', text: 'Returns null for rejected promise', isCorrect: false },
      { id: 'opt-16', text: 'Converts error into a resolved promise', isCorrect: false }
    ]
  },
  {
    id: 'q-js-5',
    quizId: 'quiz-js-101',
    questionText: 'Which mechanism is responsible for executing asynchronous callbacks in Node.js/Browser?',
    marks: 2,
    difficulty: 'Hard',
    explanation: 'The Event Loop monitors the Call Stack and Callback Queue/Microtask Queue to schedule non-blocking I/O execution.',
    options: [
      { id: 'opt-17', text: 'Thread Pool Manager', isCorrect: false },
      { id: 'opt-18', text: 'Garbage Collector', isCorrect: false },
      { id: 'opt-19', text: 'Event Loop', isCorrect: true },
      { id: 'opt-20', text: 'JIT Compiler', isCorrect: false }
    ]
  },

  // React Questions
  {
    id: 'q-react-1',
    quizId: 'quiz-react-201',
    questionText: 'What hook is recommended for side effects such as data fetching and DOM subscriptions?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'useEffect handles side effects in functional components after rendering.',
    options: [
      { id: 'opt-21', text: 'useState', isCorrect: false },
      { id: 'opt-22', text: 'useEffect', isCorrect: true },
      { id: 'opt-23', text: 'useContext', isCorrect: false },
      { id: 'opt-24', text: 'useReducer', isCorrect: false }
    ]
  },
  {
    id: 'q-react-2',
    quizId: 'quiz-react-201',
    questionText: 'Which React optimization wrapper prevents unnecessary component re-renders when props have not changed?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'React.memo is a higher order component that skips rendering if props are shallowly equal.',
    options: [
      { id: 'opt-25', text: 'React.memo', isCorrect: true },
      { id: 'opt-26', text: 'useCallback', isCorrect: false },
      { id: 'opt-27', text: 'useMemo', isCorrect: false },
      { id: 'opt-28', text: 'React.lazy', isCorrect: false }
    ]
  },
  {
    id: 'q-react-3',
    quizId: 'quiz-react-201',
    questionText: 'What is the purpose of the `key` prop in React lists?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'Keys help React identify which items have changed, been added, or removed for efficient DOM reconciliation.',
    options: [
      { id: 'opt-29', text: 'To uniquely identify CSS styles', isCorrect: false },
      { id: 'opt-30', text: 'To help React identify item changes during diffing', isCorrect: true },
      { id: 'opt-31', text: 'To bind click handlers to items', isCorrect: false },
      { id: 'opt-32', text: 'To encrypt list item data', isCorrect: false }
    ]
  },
  {
    id: 'q-react-4',
    quizId: 'quiz-react-201',
    questionText: 'In React 18/19, which hook allows marking a state update as a non-urgent transition?',
    marks: 2,
    difficulty: 'Hard',
    explanation: 'useTransition lets you mark updates as non-blocking transitions so urgent updates like typing remain responsive.',
    options: [
      { id: 'opt-33', text: 'useDeferredValue', isCorrect: false },
      { id: 'opt-34', text: 'useTransition', isCorrect: true },
      { id: 'opt-35', text: 'useId', isCorrect: false },
      { id: 'opt-36', text: 'useSyncExternalStore', isCorrect: false }
    ]
  },
  {
    id: 'q-react-5',
    quizId: 'quiz-react-201',
    questionText: 'Which lifecycle event does `useEffect` with an empty dependency array `[]` mimic?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'An empty dependency array causes the effect to run only once after initial mount, similar to componentDidMount.',
    options: [
      { id: 'opt-37', text: 'componentDidMount', isCorrect: true },
      { id: 'opt-38', text: 'componentDidUpdate', isCorrect: false },
      { id: 'opt-39', text: 'shouldComponentUpdate', isCorrect: false },
      { id: 'opt-40', text: 'getDerivedStateFromProps', isCorrect: false }
    ]
  },

  // Cyber Security Questions
  {
    id: 'q-sec-1',
    quizId: 'quiz-sec-301',
    questionText: 'Which cryptographic protocol is used to secure web traffic over HTTPS?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'TLS (Transport Layer Security) encrypts communication over HTTP to provide HTTPS security.',
    options: [
      { id: 'opt-41', text: 'FTP', isCorrect: false },
      { id: 'opt-42', text: 'TLS / SSL', isCorrect: true },
      { id: 'opt-43', text: 'SNMP', isCorrect: false },
      { id: 'opt-44', text: 'UDP', isCorrect: false }
    ]
  },
  {
    id: 'q-sec-2',
    quizId: 'quiz-sec-301',
    questionText: 'What type of attack involves injecting malicious scripts into trusted websites?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'XSS (Cross-Site Scripting) injects client-side scripts into web pages viewed by other users.',
    options: [
      { id: 'opt-45', text: 'SQL Injection', isCorrect: false },
      { id: 'opt-46', text: 'Cross-Site Scripting (XSS)', isCorrect: true },
      { id: 'opt-47', text: 'Man-in-the-Middle', isCorrect: false },
      { id: 'opt-48', text: 'Buffer Overflow', isCorrect: false }
    ]
  },

  // Python Questions
  {
    id: 'q-py-1',
    quizId: 'quiz-py-101',
    questionText: 'Which keyword in Python is used to return a generator object from a function?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'yield pauses function execution and returns a generator iterator value.',
    options: [
      { id: 'opt-49', text: 'return', isCorrect: false },
      { id: 'opt-50', text: 'yield', isCorrect: true },
      { id: 'opt-51', text: 'emit', isCorrect: false },
      { id: 'opt-52', text: 'send', isCorrect: false }
    ]
  },
  {
    id: 'q-py-2',
    quizId: 'quiz-py-101',
    questionText: 'What is the output of `type([])` in Python?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'Square brackets define a built-in Python list object.',
    options: [
      { id: 'opt-53', text: "<class 'array'>", isCorrect: false },
      { id: 'opt-54', text: "<class 'list'>", isCorrect: true },
      { id: 'opt-55', text: "<class 'tuple'>", isCorrect: false },
      { id: 'opt-56', text: "<class 'dict'>", isCorrect: false }
    ]
  },

  // Database Questions
  {
    id: 'q-db-1',
    quizId: 'quiz-db-201',
    questionText: 'Which property in ACID ensures that a database transaction is completed entirely or not at all?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'Atomicity guarantees that all operations within a work unit are completed successfully; otherwise, the transaction is aborted.',
    options: [
      { id: 'opt-57', text: 'Atomicity', isCorrect: true },
      { id: 'opt-58', text: 'Consistency', isCorrect: false },
      { id: 'opt-59', text: 'Isolation', isCorrect: false },
      { id: 'opt-60', text: 'Durability', isCorrect: false }
    ]
  }
];

export const INITIAL_ATTEMPTS = [
  {
    id: 'att-1001',
    quizId: 'quiz-js-101',
    quizTitle: 'JavaScript Fundamentals',
    userId: 'usr-1',
    userName: 'Rahul Sharma',
    score: 8,
    maxScore: 10,
    percentage: 80,
    correctAnswers: 4,
    incorrectAnswers: 1,
    unanswered: 0,
    timeTaken: '08:45', // MM:SS
    status: 'PASSED', // PASSED, FAILED
    startedAt: '2026-08-04T10:15:00Z',
    completedAt: '2026-08-04T10:23:45Z',
    answers: [
      { questionId: 'q-js-1', selectedOptionId: 'opt-2', isCorrect: true },
      { questionId: 'q-js-2', selectedOptionId: 'opt-7', isCorrect: true },
      { questionId: 'q-js-3', selectedOptionId: 'opt-10', isCorrect: true },
      { questionId: 'q-js-4', selectedOptionId: 'opt-13', isCorrect: false },
      { questionId: 'q-js-5', selectedOptionId: 'opt-19', isCorrect: true }
    ]
  },
  {
    id: 'att-1002',
    quizId: 'quiz-react-201',
    quizTitle: 'Quantum React & State Protocols',
    userId: 'usr-1',
    userName: 'Rahul Sharma',
    score: 10,
    maxScore: 10,
    percentage: 100,
    correctAnswers: 5,
    incorrectAnswers: 0,
    unanswered: 0,
    timeTaken: '14:20',
    status: 'PASSED',
    startedAt: '2026-08-03T14:00:00Z',
    completedAt: '2026-08-03T14:14:20Z',
    answers: [
      { questionId: 'q-react-1', selectedOptionId: 'opt-22', isCorrect: true },
      { questionId: 'q-react-2', selectedOptionId: 'opt-25', isCorrect: true },
      { questionId: 'q-react-3', selectedOptionId: 'opt-30', isCorrect: true },
      { questionId: 'q-react-4', selectedOptionId: 'opt-34', isCorrect: true },
      { questionId: 'q-react-5', selectedOptionId: 'opt-37', isCorrect: true }
    ]
  },
  {
    id: 'att-1003',
    quizId: 'quiz-sec-301',
    quizTitle: 'Cypher Fundamentals & Cryptography',
    userId: 'usr-2',
    userName: 'Priya Patel',
    score: 4,
    maxScore: 4,
    percentage: 100,
    correctAnswers: 2,
    incorrectAnswers: 0,
    unanswered: 0,
    timeTaken: '05:10',
    status: 'PASSED',
    startedAt: '2026-08-04T16:20:00Z',
    completedAt: '2026-08-04T16:25:10Z',
    answers: [
      { questionId: 'q-sec-1', selectedOptionId: 'opt-42', isCorrect: true },
      { questionId: 'q-sec-2', selectedOptionId: 'opt-46', isCorrect: true }
    ]
  }
];
