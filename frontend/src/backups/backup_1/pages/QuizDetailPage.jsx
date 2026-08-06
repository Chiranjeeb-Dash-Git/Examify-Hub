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
      <div className="min-h-screen bg-[#10141a] flex items-center justify-center p-4">
        <div className="text-[#88929b] font-mono text-sm">Loading quiz directive parameters...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#10141a] py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      {/* Back Link */}
      <Link
        to="/quizzes"
        className="inline-flex items-center gap-2 text-xs font-mono text-[#38BDF8] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assessment Archive
      </Link>

      {/* Main Detail Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/30">
                {quiz.categoryName}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono bg-[#262a31] text-[#dfe2eb] border border-white/10">
                {quiz.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white">{quiz.title}</h1>
          </div>
        </div>

        <p className="text-sm text-[#88929b] leading-relaxed">
          {quiz.description}
        </p>

        {/* Telemetry Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#10141a] border border-white/5 font-mono">
          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">DURATION</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Clock className="h-4 w-4 text-[#38BDF8]" />
              <span>{quiz.duration} Mins</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">QUESTIONS</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <HelpCircle className="h-4 w-4 text-[#6be026]" />
              <span>{quiz.questionsCount || 5} Questions</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">PASSING SCORE</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <Award className="h-4 w-4 text-amber-400" />
              <span>{quiz.passingScore}%</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#88929b] uppercase">MAX ATTEMPTS</span>
            <div className="flex items-center gap-1.5 text-sm font-bold text-white">
              <ShieldAlert className="h-4 w-4 text-purple-400" />
              <span>{quiz.maxAttempts} Attempts</span>
            </div>
          </div>
        </div>

        {/* Directive Instructions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-white">Assessment Directives & Guidelines</h3>
          <ul className="space-y-2 text-xs text-[#88929b]">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#6be026] shrink-0" />
              <span>The timer initiates immediately upon launching the assessment.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#6be026] shrink-0" />
              <span>You may navigate between questions freely using the question grid index.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-[#6be026] shrink-0" />
              <span>Assessment automatically submits when the countdown expires.</span>
            </li>
          </ul>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Start Button */}
        <button
          onClick={handleStartQuiz}
          disabled={starting}
          className="w-full py-4 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-base hover:bg-[#38BDF8]/90 transition-all shadow-lg shadow-[#38BDF8]/20 flex items-center justify-center gap-2"
        >
          <Play className="h-5 w-5 fill-[#10141a]" />
          <span>{starting ? 'Initializing Telemetry...' : 'Start Assessment Directive'}</span>
        </button>
      </div>
    </div>
  );
};
