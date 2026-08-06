import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuiz } from '../context/QuizContext';
import { Clock, HelpCircle, Award, ShieldAlert, ArrowLeft, Play, CheckCircle } from 'lucide-react';

export const QuizDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quizzes, startQuizSession, loading: quizLoading } = useQuiz();
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState('');
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const q = quizzes.find(item => item.id === id);
    if (q) setQuiz(q);
  }, [id, quizzes]);

  const handleStartQuiz = async () => {
    setStarting(true);
    setError('');
    try {
      await startQuizSession(quiz.id);
      navigate(`/quiz/${quiz.id}/attempt`);
    } catch (err) {
      setError(err.message || 'Failed to start quiz session.');
      setStarting(false);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="text-white/40 font-mono text-xs uppercase tracking-widest">Loading quiz directive parameters...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 text-white font-body">
      {/* Back Link */}
      <Link
        to="/quizzes"
        className="inline-flex items-center gap-2 text-xs font-mono text-white/60 hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO ASSESSMENT ARCHIVE</span>
      </Link>

      {/* Main Detail Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-6 bg-[#0a0a0c] backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 font-mono text-xs">
              <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 uppercase tracking-wider">
                {quiz.categoryName}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/5 text-white/70 border border-white/10 uppercase tracking-wider">
                {quiz.difficulty}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight">{quiz.title}</h1>
          </div>
        </div>

        <p className="text-sm text-white/70 leading-relaxed font-body">
          {quiz.description}
        </p>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#050505] border border-white/10 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">DURATION</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Clock className="h-4 w-4 text-white/80" />
              <span>{quiz.duration} Mins</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">QUESTIONS</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <HelpCircle className="h-4 w-4 text-emerald-400" />
              <span>{quiz.questionsCount || 5} Questions</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">PASSING SCORE</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Award className="h-4 w-4 text-amber-300" />
              <span>{quiz.passingScore}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/40 uppercase tracking-widest">MAX ATTEMPTS</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <ShieldAlert className="h-4 w-4 text-purple-300" />
              <span>{quiz.maxAttempts} Attempts</span>
            </div>
          </div>
        </div>

        {/* Directive Instructions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Assessment Directives & Guidelines</h3>
          <ul className="space-y-2 text-xs text-white/60">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>The timer initiates immediately upon launching the assessment directive.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>You may navigate between questions freely using the question grid index.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Assessment automatically submits when the countdown expires.</span>
            </li>
          </ul>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          disabled={starting}
          className="w-full py-4 rounded-xl bg-white text-black font-mono text-xs tracking-[0.25em] font-bold uppercase hover:bg-white/90 transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-3 group"
        >
          <Play className="h-4 w-4 fill-black" />
          <span>{starting ? 'INITIALIZING TELEMETRY...' : 'START ASSESSMENT DIRECTIVE'}</span>
        </button>
      </div>
    </div>
  );
};
