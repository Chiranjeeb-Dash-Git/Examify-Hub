import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Trophy, Award, Flame, Star, Crown } from 'lucide-react';

export const LeaderboardPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await api.getLeaderboard();
        setLeaderboard(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const topThree = leaderboard.slice(0, 3);
  const remainingRanked = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-[#10141a] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
          <Trophy className="h-3.5 w-3.5" />
          HALL OF FAME
        </div>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Candidate <span className="text-[#38BDF8]">Leaderboard</span>
        </h1>
        <p className="text-sm text-[#88929b] font-mono">
          Top candidate telemetry ranked by accuracy, average score, and completed directives
        </p>
      </div>

      {/* Top 3 Podium Display */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-3 gap-4 pt-6 max-w-2xl mx-auto items-end">
          {/* Rank 2 - Silver */}
          {topThree[1] && (
            <div className="glass-panel p-5 rounded-3xl border border-slate-400/30 text-center flex flex-col items-center relative space-y-2 bg-[#181c22]">
              <div className="relative">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-slate-300 shadow-lg"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-slate-300 text-[#10141a] font-bold text-xs px-2.5 py-0.5 rounded-full font-mono">
                  #2
                </span>
              </div>
              <h3 className="font-bold text-white text-sm pt-2">{topThree[1].name}</h3>
              <span className="text-xl font-extrabold text-slate-300 font-mono">{topThree[1].averageScore}%</span>
              <span className="text-[10px] text-[#88929b] font-mono">{topThree[1].quizzesAttempted} Quizzes</span>
            </div>
          )}

          {/* Rank 1 - Gold */}
          {topThree[0] && (
            <div className="glass-panel p-6 rounded-3xl border border-amber-400/40 text-center flex flex-col items-center relative space-y-2 bg-gradient-to-b from-amber-500/10 to-[#181c22] scale-105 shadow-2xl shadow-amber-500/10">
              <Crown className="h-6 w-6 text-amber-400 -mb-1 animate-bounce" />
              <div className="relative">
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].name}
                  className="h-20 w-20 rounded-full object-cover border-2 border-amber-400 shadow-xl"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-400 text-[#10141a] font-bold text-xs px-3 py-0.5 rounded-full font-mono">
                  #1
                </span>
              </div>
              <h3 className="font-bold text-white text-base pt-2">{topThree[0].name}</h3>
              <span className="text-2xl font-extrabold text-amber-400 font-mono">{topThree[0].averageScore}%</span>
              <span className="text-[10px] text-[#88929b] font-mono">{topThree[0].quizzesAttempted} Quizzes</span>
            </div>
          )}

          {/* Rank 3 - Bronze */}
          {topThree[2] && (
            <div className="glass-panel p-5 rounded-3xl border border-amber-700/30 text-center flex flex-col items-center relative space-y-2 bg-[#181c22]">
              <div className="relative">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].name}
                  className="h-16 w-16 rounded-full object-cover border-2 border-amber-600 shadow-lg"
                />
                <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-700 text-white font-bold text-xs px-2.5 py-0.5 rounded-full font-mono">
                  #3
                </span>
              </div>
              <h3 className="font-bold text-white text-sm pt-2">{topThree[2].name}</h3>
              <span className="text-xl font-extrabold text-amber-600 font-mono">{topThree[2].averageScore}%</span>
              <span className="text-[10px] text-[#88929b] font-mono">{topThree[2].quizzesAttempted} Quizzes</span>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <h3 className="text-lg font-bold text-white">Full Leaderboard Telemetry</h3>

        {loading ? (
          <div className="text-center py-12 text-[#88929b]">Loading rank metrics...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#dfe2eb]">
              <thead className="text-xs font-mono uppercase text-[#88929b] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Quizzes Completed</th>
                  <th className="py-3 px-4">Highest Score</th>
                  <th className="py-3 px-4 text-right">Average Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {leaderboard.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-bold">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[#262a31] text-xs text-[#38BDF8]">
                        #{student.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-sans font-medium text-white flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-8 w-8 rounded-full object-cover border border-white/10"
                      />
                      <span>{student.name}</span>
                    </td>
                    <td className="py-4 px-4 text-[#88929b]">{student.quizzesAttempted}</td>
                    <td className="py-4 px-4 text-white font-bold">{student.highestScore}%</td>
                    <td className="py-4 px-4 text-right text-[#38BDF8] font-bold text-base">
                      {student.averageScore}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
