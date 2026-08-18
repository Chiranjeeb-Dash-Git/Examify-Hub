// Initial Mock Data for Examify Hub Assessment Platform

export const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'JavaScript', description: 'Core ES6+, closures, async/await, and browser runtime engines.', count: 10 },
  { id: 'cat-2', name: 'React', description: 'JSX, hooks, component lifecycle, virtual DOM, and state management.', count: 10 },
  { id: 'cat-3', name: 'Cyber Security', description: 'Cryptography, network defense, web security vulnerabilities, and protocols.', count: 10 },
  { id: 'cat-4', name: 'Python', description: 'Data structures, OOP, decorators, generators, and standard libraries.', count: 10 },
  { id: 'cat-5', name: 'Computer Networks', description: 'OSI model, TCP/IP, DNS, routing algorithms, and socket programming.', count: 10 },
  { id: 'cat-6', name: 'Database Systems', description: 'SQL query optimization, indexing, ACID transactions, and NoSQL.', count: 10 },
  { id: 'cat-7', name: 'Next.js', description: 'App Router, React Server Components, SSG, SSR, ISR, and API route handlers.', count: 10 }
];

export const INITIAL_USERS = [
  {
    id: 'usr-1',
    name: 'Rahul Sharma',
    email: 'student@aetheris.io',
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
    difficulty: 'Intermediate',
    duration: 15,
    passingScore: 60,
    maxAttempts: 3,
    status: 'Published',
    createdAt: '2026-03-01',
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80',
    questionsCount: 10,
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
    questionsCount: 10,
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
    questionsCount: 10,
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
    questionsCount: 10,
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
    questionsCount: 10,
    attemptsCount: 195,
    avgScore: 72
  },
  {
    id: 'quiz-next-301',
    title: 'Next.js App Router & SSR Protocols',
    description: 'Master Next.js App Router, React Server Components, server actions, dynamic routing, and caching strategies.',
    categoryId: 'cat-7',
    categoryName: 'Next.js',
    difficulty: 'Intermediate',
    duration: 20,
    passingScore: 60,
    maxAttempts: 3,
    status: 'Published',
    createdAt: '2026-03-20',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80',
    questionsCount: 10,
    attemptsCount: 310,
    avgScore: 84
  }
];

export const INITIAL_QUESTIONS = [
  // JavaScript Questions (10 Questions)
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
  {
    id: 'q-js-6',
    quizId: 'quiz-js-101',
    questionText: 'What is a JavaScript Closure?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'A closure is the combination of a function bundled together with references to its surrounding lexical environment.',
    options: [
      { id: 'opt-js6-1', text: 'A function that closes the browser window', isCorrect: false },
      { id: 'opt-js6-2', text: 'A function that retains access to variables from its outer lexical scope', isCorrect: true },
      { id: 'opt-js6-3', text: 'A method to terminate loop execution', isCorrect: false },
      { id: 'opt-js6-4', text: 'A private variable declaration syntax', isCorrect: false }
    ]
  },
  {
    id: 'q-js-7',
    quizId: 'quiz-js-101',
    questionText: 'Which operator checks both value and type equality without coercion?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'The strict equality operator (===) checks whether two operands are equal without type conversion.',
    options: [
      { id: 'opt-js7-1', text: '==', isCorrect: false },
      { id: 'opt-js7-2', text: '===', isCorrect: true },
      { id: 'opt-js7-3', text: '=', isCorrect: false },
      { id: 'opt-js7-4', text: 'equals()', isCorrect: false }
    ]
  },
  {
    id: 'q-js-8',
    quizId: 'quiz-js-101',
    questionText: 'What is the purpose of `Array.prototype.reduce()`?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'reduce() executes a user-supplied reducer callback function on each element of the array, resulting in a single output value.',
    options: [
      { id: 'opt-js8-1', text: 'Filter array elements by condition', isCorrect: false },
      { id: 'opt-js8-2', text: 'Reduce the memory allocation of an array', isCorrect: false },
      { id: 'opt-js8-3', text: 'Accumulate array elements into a single value', isCorrect: true },
      { id: 'opt-js8-4', text: 'Sort array items in descending order', isCorrect: false }
    ]
  },
  {
    id: 'q-js-9',
    quizId: 'quiz-js-101',
    questionText: 'What is the difference between `null` and `undefined`?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'undefined means a variable has been declared but not assigned a value; null is an explicit assignment representing no value.',
    options: [
      { id: 'opt-js9-1', text: 'null means variable unassigned, undefined means explicitly empty', isCorrect: false },
      { id: 'opt-js9-2', text: 'undefined means variable unassigned, null means explicit empty value', isCorrect: true },
      { id: 'opt-js9-3', text: 'Both are identical in type and value', isCorrect: false },
      { id: 'opt-js9-4', text: 'null is a number, undefined is an object', isCorrect: false }
    ]
  },
  {
    id: 'q-js-10',
    quizId: 'quiz-js-101',
    questionText: 'What does the `async` keyword return when applied to a function?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'Async functions always return a Promise, resolving to the returned value or rejecting if an exception is thrown.',
    options: [
      { id: 'opt-js10-1', text: 'A Callback function', isCorrect: false },
      { id: 'opt-js10-2', text: 'A Promise', isCorrect: true },
      { id: 'opt-js10-3', text: 'An Event Listener', isCorrect: false },
      { id: 'opt-js10-4', text: 'A Generator object', isCorrect: false }
    ]
  },

  // React Questions (10 Questions)
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
  {
    id: 'q-react-6',
    quizId: 'quiz-react-201',
    questionText: 'What is the Virtual DOM in React?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'The Virtual DOM is a lightweight in-memory representation of the real DOM used to compute efficient UI updates.',
    options: [
      { id: 'opt-r6-1', text: 'A shadow DOM browser extension', isCorrect: false },
      { id: 'opt-r6-2', text: 'An in-memory representation of the real DOM tree', isCorrect: true },
      { id: 'opt-r6-3', text: 'A backend server rendering engine', isCorrect: false },
      { id: 'opt-r6-4', text: 'A CSS styling framework', isCorrect: false }
    ]
  },
  {
    id: 'q-react-7',
    quizId: 'quiz-react-201',
    questionText: 'Which hook returns a mutable ref object whose `.current` property persists across re-renders without triggering a render?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'useRef returns a ref object whose current property is initialized to passed argument and persists across renders.',
    options: [
      { id: 'opt-r7-1', text: 'useRef', isCorrect: true },
      { id: 'opt-r7-2', text: 'useState', isCorrect: false },
      { id: 'opt-r7-3', text: 'useImperativeHandle', isCorrect: false },
      { id: 'opt-r7-4', text: 'useLayoutEffect', isCorrect: false }
    ]
  },
  {
    id: 'q-react-8',
    quizId: 'quiz-react-201',
    questionText: 'What is prop drilling in React?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'Prop drilling occurs when data is passed through multiple layers of nested components that do not need it themselves.',
    options: [
      { id: 'opt-r8-1', text: 'Creating database connections in props', isCorrect: false },
      { id: 'opt-r8-2', text: 'Passing props through deeply nested component trees', isCorrect: true },
      { id: 'opt-r8-3', text: 'Injecting CSS classes into child components', isCorrect: false },
      { id: 'opt-r8-4', text: 'Validating prop types with TypeScript', isCorrect: false }
    ]
  },
  {
    id: 'q-react-9',
    quizId: 'quiz-react-201',
    questionText: 'What is the purpose of React Context API?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'Context provides a way to share values between components without having to explicitly pass a prop through every level.',
    options: [
      { id: 'opt-r9-1', text: 'To manage URL routes', isCorrect: false },
      { id: 'opt-r9-2', text: 'To share global state across component trees', isCorrect: true },
      { id: 'opt-r9-3', text: 'To compile JSX into JavaScript', isCorrect: false },
      { id: 'opt-r9-4', text: 'To optimize web image loading', isCorrect: false }
    ]
  },
  {
    id: 'q-react-10',
    quizId: 'quiz-react-201',
    questionText: 'What does `useCallback` cache in React?',
    marks: 2,
    difficulty: 'Hard',
    explanation: 'useCallback returns a memoized version of the callback function that only changes if dependencies change.',
    options: [
      { id: 'opt-r10-1', text: 'The result value of a function', isCorrect: false },
      { id: 'opt-r10-2', text: 'A memoized callback function instance', isCorrect: true },
      { id: 'opt-r10-3', text: 'A DOM element node reference', isCorrect: false },
      { id: 'opt-r10-4', text: 'A state snapshot', isCorrect: false }
    ]
  },

  // Cyber Security Questions (10 Questions)
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
  {
    id: 'q-sec-3',
    quizId: 'quiz-sec-301',
    questionText: 'What is asymmetric encryption?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'Asymmetric encryption uses a key pair: a public key for encryption and a private key for decryption.',
    options: [
      { id: 'opt-s3-1', text: 'Uses the same key for encryption and decryption', isCorrect: false },
      { id: 'opt-s3-2', text: 'Uses a public key to encrypt and a private key to decrypt', isCorrect: true },
      { id: 'opt-s3-3', text: 'Does not require key exchange', isCorrect: false },
      { id: 'opt-s3-4', text: 'Only works on plain text files', isCorrect: false }
    ]
  },
  {
    id: 'q-sec-4',
    quizId: 'quiz-sec-301',
    questionText: 'What does a Firewall do in network security?',
    marks: 2,
    difficulty: 'Easy',
    explanation: 'A firewall monitors and filters incoming and outgoing network traffic based on established security rules.',
    options: [
      { id: 'opt-s4-1', text: 'Encrypts hard drive files', isCorrect: false },
      { id: 'opt-s4-2', text: 'Filters network traffic based on security policies', isCorrect: true },
      { id: 'opt-s4-3', text: 'Speeds up internet connection bandwidth', isCorrect: false },
      { id: 'opt-s4-4', text: 'Generates random passwords', isCorrect: false }
    ]
  },
  {
    id: 'q-sec-5',
    quizId: 'quiz-sec-301',
    questionText: 'What is SQL Injection (SQLi)?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'SQLi is a code injection technique where malicious SQL statements are inserted into entry fields for execution.',
    options: [
      { id: 'opt-s5-1', text: 'Injecting JavaScript into HTML inputs', isCorrect: false },
      { id: 'opt-s5-2', text: 'Executing arbitrary SQL statements via unsafe user inputs', isCorrect: true },
      { id: 'opt-s5-3', text: 'Flooding a database with ping requests', isCorrect: false },
      { id: 'opt-s5-4', text: 'Stealing browser cookies', isCorrect: false }
    ]
  },

  // Python Questions (10 Questions)
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
  {
    id: 'q-py-3',
    quizId: 'quiz-py-101',
    questionText: 'What is a Python Decorator?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'A decorator is a function that takes another function as an argument and extends its behavior without modifying it explicitly.',
    options: [
      { id: 'opt-p3-1', text: 'A design pattern for GUI themes', isCorrect: false },
      { id: 'opt-p3-2', text: 'A function that wraps another function to modify its behavior', isCorrect: true },
      { id: 'opt-p3-3', text: 'A class variable modifier', isCorrect: false },
      { id: 'opt-p3-4', text: 'A built-in module for file formatting', isCorrect: false }
    ]
  },

  // Database Questions (10 Questions)
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
  },
  {
    id: 'q-db-2',
    quizId: 'quiz-db-201',
    questionText: 'Which SQL clause is used to filter records after aggregation (GROUP BY)?',
    marks: 2,
    difficulty: 'Medium',
    explanation: 'HAVING filters group rows created by GROUP BY, whereas WHERE filters individual rows before grouping.',
    options: [
      { id: 'opt-d2-1', text: 'WHERE', isCorrect: false },
      { id: 'opt-d2-2', text: 'HAVING', isCorrect: true },
      { id: 'opt-d2-3', text: 'ORDER BY', isCorrect: false },
      { id: 'opt-d2-4', text: 'FILTER BY', isCorrect: false }
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
    correctAnswers: 8,
    incorrectAnswers: 2,
    unanswered: 0,
    timeTaken: '08:45',
    status: 'PASSED',
    startedAt: '2026-08-04T10:15:00Z',
    completedAt: '2026-08-04T10:23:45Z',
    answers: [
      { questionId: 'q-js-1', selectedOptionId: 'opt-2', isCorrect: true },
      { questionId: 'q-js-2', selectedOptionId: 'opt-7', isCorrect: true },
      { questionId: 'q-js-3', selectedOptionId: 'opt-10', isCorrect: true },
      { questionId: 'q-js-4', selectedOptionId: 'opt-13', isCorrect: false },
      { questionId: 'q-js-5', selectedOptionId: 'opt-19', isCorrect: true },
      { questionId: 'q-js-6', selectedOptionId: 'opt-js6-2', isCorrect: true },
      { questionId: 'q-js-7', selectedOptionId: 'opt-js7-2', isCorrect: true },
      { questionId: 'q-js-8', selectedOptionId: 'opt-js8-3', isCorrect: true },
      { questionId: 'q-js-9', selectedOptionId: 'opt-js9-2', isCorrect: true },
      { questionId: 'q-js-10', selectedOptionId: 'opt-js10-1', isCorrect: false }
    ]
  }
];
