import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuiz } from '../context/QuizContext';
import { QuizCard } from '../components/QuizCard';
import { api } from '../services/api';
import { motion } from 'motion/react';
import { Award, Zap, TrendingUp, CheckCircle, Clock, ArrowRight, Activity, Flame, Shield, Swords, Terminal, Box } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const { quizzes, loading: quizLoading } = useQuiz();
  const [userAttempts, setUserAttempts] = useState([]);
  const [stats, setStats] = useState({
    avgScore: user?.averageScore || 85,
    quizzesPassed: 12,
    quizzesFailed: 3,
    totalAttempts: user?.quizzesAttempted || 15,
    highestScore: user?.highestScore || 96
  });

  useEffect(() => {
    const loadUserStats = async () => {
      if (user?.id) {
        try {
          const attempts = await api.getAttemptsForUser(user.id);
          setUserAttempts(attempts);
          if (attempts.length > 0) {
            const passed = attempts.filter(a => a.status === 'PASSED').length;
            const failed = attempts.filter(a => a.status === 'FAILED').length;
            const avg = Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length);
            const highest = Math.max(...attempts.map(a => a.percentage));
            setStats({
              avgScore: avg,
              quizzesPassed: passed,
              quizzesFailed: failed,
              totalAttempts: attempts.length,
              highestScore: highest
            });
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadUserStats();
  }, [user]);

  // Gamified Level System
  const level = Math.floor(stats.quizzesPassed / 3) + 1;
  const currentLevelXp = stats.quizzesPassed % 3;
  const xpNeeded = 3;
  const xpPercentage = (currentLevelXp / xpNeeded) * 100;

  // Mock activity data for heatmap
  const activityData = [
    { day: 'Mon', hours: 2.5, type: 'iron' },
    { day: 'Tue', hours: 4.1, type: 'gold' },
    { day: 'Wed', hours: 6.8, type: 'diamond' },
    { day: 'Thu', hours: 3.2, type: 'iron' },
    { day: 'Fri', hours: 5.4, type: 'emerald' },
    { day: 'Sat', hours: 1.8, type: 'redstone' },
    { day: 'Sun', hours: 4.0, type: 'coal' }
  ];

  // Map day types to voxel themes
  const colorMap = {
    iron: '#a1a1aa',
    gold: '#fbbf24',
    diamond: '#00ffff',
    emerald: '#55ff55',
    redstone: '#f87171',
    coal: '#4b5563'
  };

  // Scroll animations configuration (triggers up and down scroll transitions)
  const scrollReveal = {
    initial: { opacity: 0, y: 60, scale: 0.96 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: false, amount: 0.12 },
    transition: { type: 'spring', stiffness: 70, damping: 14 }
  };

  return (
    <div className="min-h-screen bg-[#060608] voxel-grid py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 selection:bg-[#55ff55] selection:text-black">
      {/* Gamified briefing banner */}
      <motion.div 
        {...scrollReveal}
        className="voxel-card-3d p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-2 border-[#1c1c24] bg-gradient-to-r from-[#0d0d11] to-[#121217]"
      >
        <div className="space-y-3 relative z-10 flex-grow max-w-2xl">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 text-[10px] font-mono text-[#55ff55] border border-[#55ff55]/30 bg-[#55ff55]/5 uppercase tracking-wider font-extrabold rounded-none">
              COMMANDER STATUS ACTIVE
            </span>
            <span className="flex items-center gap-1 text-[10px] font-mono text-white/50">
              <Shield className="w-3.5 h-3.5" />
              SECURE SECTOR 7A
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight uppercase font-mono">
            Welcome, <span className="text-[#55ff55] drop-shadow-[0_0_8px_rgba(85,255,85,0.3)]">{user?.name || 'VoxelCommander'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-mono">
            Directives loaded. Voxel engine standing by. Execute assessments to gather XP.
          </p>

          {/* Minecraft Style XP HUD */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/80 font-bold flex items-center gap-1.5">
                <Swords className="w-4 h-4 text-[#55ff55]" />
                LEVEL {level} EXPLORER
              </span>
              <span className="text-[#55ff55] font-bold">{currentLevelXp} / {xpNeeded} XP</span>
            </div>
            
            {/* Voxel XP Bar */}
            <div className="w-full h-5 voxel-xp-bar relative p-0.5 overflow-hidden flex items-center">
              <div 
                className="h-full voxel-xp-fill transition-all duration-700 ease-out" 
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <p className="text-[10px] font-mono text-white/40">
              {stats.quizzesPassed % 3 === 0 ? 'Directive required to rank up' : `${xpNeeded - currentLevelXp} assessments to Level ${level + 1}`}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-[#14141a]/60 border border-white/5 min-w-[160px] relative">
          <div className="absolute top-1 right-1 h-1.5 w-1.5 bg-[#55ff55] animate-ping" />
          <Box className="w-8 h-8 text-[#55ff55] mb-2 animate-bounce" />
          <span className="text-[10px] font-mono text-white/50 uppercase">Current Rank</span>
          <span className="text-sm font-bold text-white font-mono uppercase tracking-wider drop-shadow-md text-center">Elite Vanguard</span>
        </div>
      </motion.div>

      {/* Intelligence Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Accuracy Core Reactor */}
        <motion.div 
          {...scrollReveal}
          className="voxel-card-3d ore-glow-diamond p-6 flex flex-col justify-between relative overflow-hidden bg-[#0d0d11]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#00ffff] uppercase tracking-wider font-bold">
              ACCURACY REACTOR
            </span>
            <Zap className="h-5 w-5 text-[#00ffff]" />
          </div>

          <div className="my-6 flex items-center justify-center relative">
            <svg className="w-36 h-36 transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                className="text-white/5"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="56"
                stroke="#00ffff"
                strokeWidth="10"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 - (351.8 * stats.avgScore) / 100}
                strokeLinecap="square"
                className="transition-all duration-1000 ease-out"
                fill="transparent"
                style={{ filter: 'drop-shadow(0 0 4px rgba(0, 255, 255, 0.5))' }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white font-mono">{stats.avgScore}%</span>
              <span className="text-[9px] font-mono text-[#00ffff] uppercase tracking-widest">DIAGNOSTIC OK</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#00ffff] font-mono border-t border-[#00ffff]/10 pt-3">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5% calibration gain this cycle</span>
          </div>
        </motion.div>

        {/* Card 2: Inventory Totem */}
        <motion.div 
          {...scrollReveal}
          className="voxel-card-3d ore-glow-emerald p-6 flex flex-col justify-between bg-[#0d0d11]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#55ff55] uppercase tracking-wider font-bold">
              TOTEM OF CONQUEST
            </span>
            <Flame className="h-5 w-5 text-[#55ff55]" />
          </div>

          <div className="my-6 flex flex-col items-center justify-center">
            <span className="text-6xl font-extrabold text-white font-mono tracking-tight drop-shadow-[0_0_10px_rgba(85,255,85,0.2)]">
              {stats.quizzesPassed}
            </span>
            <span className="text-xs text-white/50 font-mono mt-1">Quizzes Passed</span>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#55ff55]/10">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white/60">Success Rate</span>
              <span className="text-[#55ff55] font-bold">
                {Math.round((stats.quizzesPassed / (stats.totalAttempts || 1)) * 100)}%
              </span>
            </div>
            <div className="h-2 w-full voxel-xp-bar overflow-hidden p-0.5">
              <div 
                className="h-full bg-[#55ff55]" 
                style={{ width: `${(stats.quizzesPassed / (stats.totalAttempts || 1)) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Card 3: Redstone Signal Tracker */}
        <motion.div 
          {...scrollReveal}
          className="voxel-card-3d ore-glow-redstone p-6 flex flex-col justify-between bg-[#0d0d11]"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-[#ff5555] uppercase tracking-wider font-bold">
              SIGNAL ACTIVITY
            </span>
            <Activity className="h-5 w-5 text-[#ff5555]" />
          </div>

          <div className="h-36 w-full my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <XAxis dataKey="day" stroke="#ff5555" opacity={0.6} fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ff5555" opacity={0.6} fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0d0d11', borderColor: '#ff5555', borderRadius: '0px', color: '#fff', fontFamily: 'monospace' }}
                  cursor={{ fill: 'rgba(255,85,85,0.05)' }}
                />
                <Bar dataKey="hours" radius={0}>
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colorMap[entry.type]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs font-mono text-[#ff5555] pt-3 border-t border-[#ff5555]/10">
            <span>Redstone status: High</span>
            <span className="text-white/60">Peak: Wed</span>
          </div>
        </motion.div>
      </div>

      {/* Recommended Directives Catalog */}
      <motion.div 
        {...scrollReveal}
        className="space-y-6 pt-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-mono text-2xl font-bold text-white tracking-tight uppercase flex items-center gap-2">
              <Box className="w-6 h-6 text-[#55ff55]" />
              Active Assessment Directives
            </h2>
            <p className="text-xs text-white/50 font-mono mt-0.5">Explore active evaluation courses and skill benchmarks</p>
          </div>
          <Link
            to="/quizzes"
            className="voxel-btn-3d text-xs font-mono font-bold text-white border border-white/10 px-4 py-2.5 hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center gap-1.5"
          >
            <span>View Full Archive ({quizzes.length})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {quizLoading ? (
          <div className="text-center py-12 text-[#55ff55] font-mono text-xs animate-pulse">Loading assessment catalog...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Attempts Terminal */}
      <motion.div 
        {...scrollReveal}
        className="voxel-card-3d p-6 space-y-4 bg-[#0d0d11] border border-white/10"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white font-mono uppercase flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#55ff55]" />
            Assessment Telemetry Logs
          </h3>
          <Link to="/history" className="text-xs text-[#00ffff] hover:underline font-mono uppercase">
            [ Access Archive ]
          </Link>
        </div>

        {userAttempts.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono text-white/40">
            No telemetry logs recorded. Initiate a directive above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#dfe2eb]">
              <thead className="text-xs font-mono uppercase text-white/40 border-b border-[#1c1c24]">
                <tr>
                  <th className="py-3 px-4">assessment_id</th>
                  <th className="py-3 px-4">score_pct</th>
                  <th className="py-3 px-4">time_taken</th>
                  <th className="py-3 px-4">status</th>
                  <th className="py-3 px-4 text-right">telemetry_action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1c1c24] font-mono text-xs">
                {userAttempts.slice(0, 4).map((att) => (
                  <tr key={att.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 px-4 font-sans font-medium text-white">{att.quizTitle}</td>
                    <td className="py-4 px-4 text-[#00ffff] font-bold">{att.percentage}%</td>
                    <td className="py-4 px-4 text-white/50">{att.timeTaken}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 text-[10px] font-mono font-bold ${
                          att.status === 'PASSED'
                            ? 'bg-[#55ff55]/10 text-[#55ff55] border border-[#55ff55]/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {att.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-sans">
                      <Link
                        to={`/quiz/result/${att.id}`}
                        className="text-xs text-[#00ffff] hover:underline font-mono uppercase font-bold"
                      >
                        [ REVIEW ]
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};
