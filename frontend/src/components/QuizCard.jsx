import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, HelpCircle, ArrowRight, Award } from 'lucide-react';

export const QuizCard = ({ quiz }) => {
  const getDifficultyBadge = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return 'ore-glow-gold bg-[#ffaa00]/10 text-[#ffaa00] border-[#ffaa00]/40';
      case 'intermediate':
        return 'ore-glow-emerald bg-[#55ff55]/10 text-[#55ff55] border-[#55ff55]/40';
      case 'advanced':
        return 'ore-glow-diamond bg-[#00ffff]/10 text-[#00ffff] border-[#00ffff]/40';
      default:
        return 'ore-glow-netherite bg-[#555555]/10 text-white border-[#555555]/40';
    }
  };

  return (
    <div className="voxel-card-3d rounded-none overflow-hidden flex flex-col group h-full bg-[#0d0d11] border-2 border-[#1c1c24] relative">
      {/* Banner Image / Thumbnail */}
      <div className="relative h-44 w-full overflow-hidden bg-[#050508] border-b-2 border-[#1c1c24]">
        <img
          src={quiz.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'}
          alt={quiz.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d11] via-[#0d0d11]/50 to-transparent" />
        
        {/* Voxel Badge / Difficulty Indicator */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 font-mono text-[10px] uppercase font-bold border ${getDifficultyBadge(
            quiz.difficulty
          )}`}
        >
          {quiz.difficulty}
        </span>

        {/* Category Tag */}
        <span className="absolute bottom-3 left-3 px-2.5 py-0.5 font-mono text-[10px] text-white bg-[#050508] border border-white/10 uppercase">
          {quiz.categoryName}
        </span>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex flex-col flex-grow space-y-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white font-mono uppercase group-hover:text-[#55ff55] transition-colors line-clamp-1">
            {quiz.title}
          </h3>
          <p className="text-xs text-white/50 font-mono line-clamp-2 leading-relaxed flex-grow">
            {quiz.description}
          </p>
        </div>

        {/* Voxel Stats Slot */}
        <div className="pt-3 border-t border-[#1c1c24] grid grid-cols-3 gap-2 text-[10px] text-white/60 font-mono">
          <div className="flex flex-col items-center justify-center p-2 bg-[#14141a] border border-white/5">
            <Clock className="h-3.5 w-3.5 text-white/80 mb-1" />
            <span>{quiz.duration}m</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-[#14141a] border border-white/5">
            <HelpCircle className="h-3.5 w-3.5 text-[#00ffff] mb-1" />
            <span>{quiz.questionsCount || 5} Qs</span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 bg-[#14141a] border border-white/5">
            <Award className="h-3.5 w-3.5 text-[#55ff55] mb-1" />
            <span>Pass: {quiz.passingScore}%</span>
          </div>
        </div>

        {/* Initiate Directive Link Button */}
        <Link
          to={`/quizzes/${quiz.id}`}
          className="voxel-btn-3d w-full flex items-center justify-between px-4 py-3 bg-[#1e1e24] text-white border border-[#33333f] font-mono text-xs uppercase tracking-wider font-extrabold hover:bg-white hover:text-black hover:border-white transition-all group/btn"
        >
          <span>Initiate Directive</span>
          <ArrowRight className="h-4 w-4 transform group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
