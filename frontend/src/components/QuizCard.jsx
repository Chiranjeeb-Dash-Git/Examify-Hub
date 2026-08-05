import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, ArrowRight, Award } from 'lucide-react';

export const QuizCard = ({ quiz }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'intermediate':
        return 'bg-[#6be026]/20 text-[#6be026] border-[#6be026]/30';
      case 'advanced':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-[#38BDF8]/20 text-[#38BDF8] border-[#38BDF8]/30';
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl overflow-hidden flex flex-col group h-full">
      {/* Card Header Banner Image */}
      <div className="relative h-44 w-full overflow-hidden bg-[#181c22]">
        <img
          src={quiz.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
          alt={quiz.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181c22] via-[#181c22]/40 to-transparent" />
        
        {/* Difficulty Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-mono font-medium border backdrop-blur-md ${getDifficultyBadge(
            quiz.difficulty
          )}`}
        >
          {quiz.difficulty}
        </span>

        {/* Category Tag */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md text-[11px] font-mono text-[#38BDF8] bg-[#10141a]/80 border border-[#38BDF8]/30 backdrop-blur-md">
          {quiz.categoryName}
        </span>
      </div>

      {/* Content Body */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1">
          {quiz.title}
        </h3>
        <p className="mt-2 text-xs text-[#88929b] line-clamp-2 leading-relaxed flex-grow">
          {quiz.description}
        </p>

        {/* Meta Stats */}
        <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-[#bdc8d2] font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#38BDF8]" />
            <span>{quiz.duration} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="h-3.5 w-3.5 text-[#6be026]" />
            <span>{quiz.questionsCount || 5} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-amber-400" />
            <span>Pass: {quiz.passingScore}%</span>
          </div>
        </div>

        {/* Action Link */}
        <Link
          to={`/quizzes/${quiz.id}`}
          className="mt-4 flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-[#262a31] hover:bg-[#38BDF8] text-[#dfe2eb] hover:text-[#10141a] font-semibold text-xs transition-all duration-300 group/btn"
        >
          <span>Initiate Assessment</span>
          <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
