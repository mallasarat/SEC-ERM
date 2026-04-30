import React, { useState, useMemo, useEffect } from "react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  ListChecks, 
  AlertCircle, 
  Activity, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  FileText, 
  ArrowUpRight, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  Lock, 
  Globe, 
  MessageSquare, 
  Send, 
  Users, 
  Building2, 
  Network, 
  Cpu, 
  Boxes, 
  BarChart3, 
  LogOut,
  Zap,
  Check,
  X,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ResponsiveContainer, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

// ── TYPES & DATA ─────────────────────────────────────────────────────

type MaturityLevel = {
  level: number;
  name: string;
  color: string;
  desc: string;
};

const MATURITY_LEVELS: MaturityLevel[] = [
  { level: 1, name: "Initial", color: "#ef4444", desc: "Ad-hoc, inconsistent, reactive" },
  { level: 2, name: "Developing", color: "#f97316", desc: "Basic processes, inconsistently applied" },
  { level: 3, name: "Defined", color: "#ca8a04", desc: "Documented, standardized, repeatable" },
  { level: 4, name: "Managed", color: "#16a34a", desc: "Embedded, automated, data-driven" },
  { level: 5, name: "Optimizing", color: "#0ea5e9", desc: "Predictive, continuously improved" },
];

const PILLARS = [
  { id: "lead", name: "Leadership & Commitment", icon: ShieldCheck, weight: 0.20, color: "#ec4899" },
  { id: "design", name: "Design & Integration", icon: Network, weight: 0.10, color: "#8b5cf6" },
  { id: "comm", name: "Communication & Consultation", icon: Globe, weight: 0.10, color: "#06b6d4" },
  { id: "scope", name: "Scope, Context & Criteria", icon: Target, weight: 0.10, color: "#3b82f6" },
  { id: "risk_a", name: "Risk Assessment", icon: BarChart3, weight: 0.20, color: "#10b981" },
  { id: "treat", name: "Risk Treatment", icon: Shield, weight: 0.10, color: "#22c55e" },
  { id: "monitor", name: "Monitoring & Review", icon: Activity, weight: 0.10, color: "#f59e0b" },
  { id: "report", name: "Recording & Reporting", icon: FileText, weight: 0.05, color: "#6366f1" },
  { id: "improve", name: "Continual Improvement", icon: RotateCcw, weight: 0.05, color: "#f97316" },
];

const DIMENSIONS = ["People", "Process", "Technology", "Governance"];
const DIM_WEIGHTS = { People: 0.20, Process: 0.30, Technology: 0.20, Governance: 0.30 };

const BUSINESS_UNITS = [
  { id: "gen", name: "Generation", icon: Zap, desc: "Power generation assets & operations" },
  { id: "tra", name: "Transmission", icon: Target, desc: "High-voltage grid & transmission lines" },
  { id: "dis", name: "Distribution", icon: Boxes, desc: "Last-mile distribution networks" },
  { id: "corp", name: "Corporate", icon: Building2, desc: "HQ functions & shared services" },
  { id: "sub", name: "Subsidiaries", icon: Network, desc: "Subsidiary entities & affiliates" },
  { id: "jv", name: "Joint Ventures", icon: Users, desc: "JV partnerships & consortiums" },
];

// 36 Standards-aligned questions (Balanced across 9 pillars & 4 dimensions)
const QUESTIONS = [
  // Leadership
  { id: 1, pillar: "lead", dim: "Governance", text: "Does the board exercise active oversight and accountability for maturity outcomes?" },
  { id: 2, pillar: "lead", dim: "People", text: "Is executive commitment to risk management visible and consistently communicated?" },
  { id: 3, pillar: "lead", dim: "Process", text: "Are risk management policies reviewed and approved at the highest governance level?" },
  { id: 4, pillar: "lead", dim: "Technology", text: "Are sufficient resources (budget/tech) allocated to support the ERM framework?" },
  // Design
  { id: 5, pillar: "design", dim: "Process", text: "Is risk management embedded into the organization's strategic planning cycles?" },
  { id: 6, pillar: "design", dim: "Governance", text: "Are roles, authorities, and accountabilities for risk management clearly defined?" },
  { id: 7, pillar: "design", dim: "People", text: "Is risk management training provided to all relevant personnel?" },
  { id: 8, pillar: "design", dim: "Technology", text: "Is there a centralized system for tracking risk treatment and ownership?" },
  // Communication
  { id: 9, pillar: "comm", dim: "People", text: "Is there a formal risk communication strategy for internal stakeholders?" },
  { id: 10, pillar: "comm", dim: "Governance", text: "Are external stakeholder expectations periodically reviewed and addressed?" },
  { id: 11, pillar: "comm", dim: "Technology", text: "Does the organization use digital platforms for real-time risk collaboration?" },
  { id: 12, pillar: "comm", dim: "Process", text: "Are consultation results used to refine the risk management approach?" },
  // Scope, Context & Criteria
  { id: 13, pillar: "scope", dim: "Process", text: "Are internal and external context factors systematically mapped and updated?" },
  { id: 14, pillar: "scope", dim: "Governance", text: "Is the risk appetite statement formally defined and quantified?" },
  { id: 15, pillar: "scope", dim: "Technology", text: "Are contextual changes monitored via automated external intelligence feeds?" },
  { id: 16, pillar: "scope", dim: "Process", text: "Are risk criteria (impact/likelihood scales) tailored to the specific BU context?" },
  // Risk Assessment
  { id: 17, pillar: "risk_a", dim: "Process", text: "Is there a documented, repeatable methodology for risk identification?" },
  { id: 18, pillar: "risk_a", dim: "Technology", text: "Are quantitative tools used to analyze risk impact and velocity?" },
  { id: 19, pillar: "risk_a", dim: "People", text: "Do risk assessment workshops involve diverse cross-functional expertise?" },
  { id: 20, pillar: "risk_a", dim: "Governance", text: "Are assessment results formally validated by risk committees?" },
  // Risk Treatment
  { id: 21, pillar: "treat", dim: "Process", text: "Are treatment plans documented with clear owners and completion dates?" },
  { id: 22, pillar: "treat", dim: "Technology", text: "Is automated control monitoring implemented for critical treatment plans?" },
  { id: 23, pillar: "treat", dim: "People", text: "Do treatment owners have necessary resources to execute mitigation actions?" },
  { id: 24, pillar: "treat", dim: "Governance", text: "Is residual risk formally accepted by the appropriate level of management?" },
  // Monitoring
  { id: 25, pillar: "monitor", dim: "Technology", text: "Are Key Risk Indicators (KRIs) tracked via automated real-time dashboards?" },
  { id: 26, pillar: "monitor", dim: "Process", text: "Are risk monitoring reports reviewed at regular management intervals?" },
  { id: 27, pillar: "monitor", dim: "Governance", text: "Are internal review findings integrated into the monitoring and improvement cycle?" },
  { id: 28, pillar: "monitor", dim: "People", text: "Is there a mechanism for employees to report emerging risks anonymously?" },
  // Recording & Reporting
  { id: 29, pillar: "report", dim: "Governance", text: "Is the output of risk management activities documented to provide a clear record trail?" },
  { id: 30, pillar: "report", dim: "Technology", text: "Does the system provide automated, customizable reporting for various management levels?" },
  { id: 31, pillar: "report", dim: "Process", text: "Are reporting frequencies aligned with the velocity of the monitored risks?" },
  { id: 32, pillar: "report", dim: "People", text: "Is reported risk information presented in a way that supports effective decision-making?" },
  // Continual Improvement
  { id: 33, pillar: "improve", dim: "Governance", text: "Is the overall effectiveness of the ERM framework evaluated annually?" },
  { id: 34, pillar: "improve", dim: "Technology", text: "Are advanced analytical insights used to identify gaps in existing risk controls?" },
  { id: 35, pillar: "improve", dim: "Process", text: "Are 'lessons learned' from risk events used to update the ERM framework?" },
  { id: 36, pillar: "improve", dim: "People", text: "Is a proactive risk culture fostered through rewards and recognition?" },
];

// ── COMPONENTS ──────────────────────────────────────────────────────

const Card = ({ children, className = "", glow = false }: { children: React.ReactNode, className?: string, glow?: boolean }) => (
  <div className={`bg-slate-900/50 backdrop-blur-xl border ${glow ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]' : 'border-white/10'} rounded-2xl p-6 transition-all duration-300 ${className}`}>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, icon: Icon }: { title: string, subtitle?: string, icon?: any }) => (
  <div className="mb-8">
    <div className="flex items-center gap-3 mb-2">
      {Icon && <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><Icon size={20} /></div>}
      <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-400 font-medium">{subtitle}</p>}
  </div>
);

// ── SCREENS ──────────────────────────────────────────────────────────

const WelcomeScreen = ({ onEnter }: { onEnter: () => void }) => (
  <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-[#050d1a] px-6">
    {/* Animated Background Gradients */}
    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/20 blur-[120px] rounded-full animate-pulse" />
    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 text-center max-w-4xl space-y-10"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest">
        <Shield size={14} /> Saudi Electricity Company
      </div>

      <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9]">
        RNOS™ <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Navigator</span>
      </h1>

      <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
        Structured maturity evaluation aligned with ISO 31000.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
        <button 
          onClick={onEnter}
          className="group relative w-full sm:w-auto px-10 py-5 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-600 transition-all shadow-2xl shadow-blue-500/40 active:scale-95 text-lg"
        >
          <span className="relative z-10 flex items-center gap-3">
            Login <ArrowUpRight size={20} />
          </span>
          <div className="absolute inset-0 bg-white/10 rounded-2xl scale-0 group-hover:scale-100 transition-transform origin-center" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
        {[
          { icon: Shield, title: "ISO 31000 Framework", desc: "Standards-aligned comprehensive assessment spanning 9 enterprise risk pillars." },
          { icon: Cpu, title: "Analytical Insights", desc: "Logic validation identifying gaps between governance and operational execution." },
          { icon: RotateCcw, title: "Assessment Engine", desc: "Weighted scoring methodology mapping capabilities to strategic risk intent." }
        ].map((item, idx) => (
          <div key={idx} className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm hover:border-blue-500/50 transition-all group">
            <item.icon size={32} className="text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const LoginScreen = ({ onLogin, onBack }: { onLogin: () => void, onBack: () => void }) => {
  const [loading, setLoading] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex items-center justify-center p-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(27,79,138,0.1)_0%,transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <button onClick={onBack} className="text-slate-500 hover:text-white mb-8 flex items-center gap-2 transition-colors">
          <ChevronLeft size={20} /> Back to Welcome
        </button>

        <Card className="p-8">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-blue-500/30">
              <Lock size={32} />
            </div>
            <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Access Control</p>
            <h2 className="text-2xl font-bold text-white">Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Employee Email</label>
              <input 
                required
                type="email" 
                placeholder="analyst@sec.com.sa"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Access Key</label>
              <input 
                required
                type="password" 
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-all font-medium"
              />
            </div>
            <button 
              disabled={loading}
              className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 disabled:opacity-50 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-sm flex items-center justify-center gap-3"
            >
              {loading ? <Activity size={20} className="animate-spin" /> : "Login"}
            </button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

const BUScreen = ({ onSelect, onBack }: { onSelect: (bu: any) => void, onBack: () => void }) => (
  <div className="min-h-screen bg-[#050d1a] p-8 md:p-12">
    <div className="max-w-6xl mx-auto">
      <button onClick={onBack} className="text-slate-500 hover:text-white mb-10 flex items-center gap-2 transition-colors">
        <ChevronLeft size={20} /> Login
      </button>

      <SectionHeader 
        title="Business Unit Selection" 
        subtitle="Choose the specific operational perimeter for RNOS™ maturity evaluation."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BUSINESS_UNITS.map((bu, idx) => (
          <motion.div 
            key={bu.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => onSelect(bu)}
            className="group cursor-pointer"
          >
            <Card className="h-full hover:border-blue-500/50 hover:bg-blue-500/5 transition-all">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <bu.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{bu.name}</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">{bu.desc}</p>
              <div className="flex items-center text-blue-400 text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                Initiate Maturity Assessment <ChevronRight size={14} className="ml-2" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

const AssessmentScreen = ({ responses, setResponses, onComplete }: { responses: any, setResponses: any, onComplete: () => void }) => {
  const [cur, setCur] = useState(0);
  const q = QUESTIONS[cur];
  const pillar = PILLARS.find(p => p.id === q.pillar)!;

  const handleScore = (score: number) => {
    setResponses((prev: any) => ({ ...prev, [q.id]: score }));
    if (cur < QUESTIONS.length - 1) {
      setCur(cur + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-[#050d1a] flex">
      {/* Sidebar Progress */}
      <div className="w-64 bg-slate-900 border-r border-white/5 p-8 hidden lg:flex flex-col">
        <div className="mb-10">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Assessment Progress</p>
          <h3 className="text-2xl font-bold text-white">{Math.round((Object.keys(responses).length / QUESTIONS.length) * 100)}%</h3>
          <div className="w-full h-1.5 bg-white/5 rounded-full mt-4 overflow-hidden">
            <motion.div 
              className="h-full bg-blue-500" 
              initial={{ width: 0 }}
              animate={{ width: `${(Object.keys(responses).length / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
          {PILLARS.map(p => {
            const count = QUESTIONS.filter(q2 => q2.pillar === p.id && responses[q2.id]).length;
            const total = QUESTIONS.filter(q2 => q2.pillar === p.id).length;
            const active = p.id === q.pillar;
            return (
              <div key={p.id} className={`p-4 rounded-xl border transition-all ${active ? 'bg-blue-600/10 border-blue-500/50' : 'border-white/5'}`}>
                <div className="flex items-center justify-between mb-2">
                  <p className={`text-[10px] font-bold uppercase transition-colors ${active ? 'text-blue-400' : 'text-slate-600'}`}>{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{count}/{total}</p>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-current" style={{ width: `${(count/total)*100}%`, color: p.color }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 md:p-12 relative flex flex-col">
        <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col justify-center">
          <motion.div 
            key={cur}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest">{pillar.name}</span>
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-400 text-[10px] font-bold uppercase tracking-widest">{q.dim}</span>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest ml-auto">Question {cur + 1} of {QUESTIONS.length}</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {q.text}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[1, 2, 3, 4, 5].map(score => (
                <button
                  key={score}
                  onClick={() => handleScore(score)}
                  className={`group relative p-6 rounded-2xl border-2 transition-all text-center ${
                    responses[q.id] === score 
                      ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-500/20' 
                      : 'bg-white/5 border-transparent hover:border-white/10'
                  }`}
                >
                  <p className={`text-2xl font-bold mb-1 ${responses[q.id] === score ? 'text-white' : 'text-slate-500'}`}>{score}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${responses[q.id] === score ? 'text-white/70' : 'text-slate-600'}`}>
                    {MATURITY_LEVELS[score-1].name}
                  </p>
                  {responses[q.id] === score && (
                    <motion.div layoutId="score-active" className="absolute -top-1 -right-1 bg-white text-blue-600 rounded-full p-1 shadow-lg">
                      <Check size={12} strokeWidth={4} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pt-10">
              <button 
                disabled={cur === 0}
                onClick={() => setCur(cur - 1)}
                className="flex items-center gap-2 text-slate-500 hover:text-white disabled:opacity-30 transition-colors uppercase text-xs font-bold tracking-widest"
              >
                <ChevronLeft size={16} /> Previous Question
              </button>
              <button 
                onClick={() => setCur(cur + 1)}
                disabled={!responses[q.id]}
                className="px-10 py-4 bg-white/10 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/20 transition-all disabled:opacity-30"
              >
                Save & Continue
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// ── MATURITY CHARTS ──────────────────────────────────────────────────

const MaturityCharts = ({ maturityResults }: { maturityResults: any }) => {
  const pillarData = useMemo(() => {
    return maturityResults.pillarScores.map((p: any) => ({
      name: p.pillar,
      full: p.pillar,
      score: p.score,
      color: PILLARS.find(x => x.id === p.id)?.color
    }));
  }, [maturityResults]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
      <Card>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Pillar Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pillarData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 5]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                itemStyle={{ color: '#3b82f6' }}
              />
              <Bar dataKey="score">
                {pillarData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.6} stroke={entry.color} strokeWidth={2} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Dimension Performance</h3>
        <div className="h-[300px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={maturityResults.dimScores}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Radar
                name="Maturity"
                dataKey="A"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

// ── MATURITY DASHBOARD ───────────────────────────────────────────────

const MaturityDashboard = ({ responses, history, onDownloadReport, onReset }: { responses: any, history: any[], onDownloadReport: () => void, onReset: () => void }) => {
  const maturityResults = useMaturityEngine(responses);
  const maturityLevel = getML(maturityResults.overall);
  const benchmark = 3.5;
  const benchmarkStatus = maturityResults.overall > benchmark 
    ? "Above Benchmark" 
    : maturityResults.overall === benchmark 
      ? "At Benchmark" 
      : "Below Benchmark";

  const driftValue = history.length > 1
    ? history[history.length - 1].score - history[history.length - 2].score
    : 0;

  const roadmap = useMemo(() => {
    return maturityResults.pillarScores
      .filter((p: any) => p.score < 4 && p.score > 0)
      .sort((a: any, b: any) => a.score - b.score)
      .slice(0, 4)
      .map((p: any) => ({
        pillar: p.pillar,
        priority: p.score < 2 ? "Critical" : p.score < 3 ? "High" : "Strategic",
        uplift: Number((4.0 - p.score) * p.weight).toFixed(2),
        action: p.score < 2 
          ? `Establish foundational ${p.pillar} documentation and executive oversight.`
          : `Enhance ${p.pillar} automation and monitoring capabilities.`
      }));
  }, [maturityResults]);

  return (
    <div className="min-h-screen bg-[#050d1a] p-6 lg:p-12 mb-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-blue-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
              <Activity size={14} /> ISO 31000–Aligned ERM Maturity Assessment
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">RNOS™ Navigator</h1>
            <p className="text-slate-400 text-sm font-medium">Maturity Assessment Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onReset} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest">
              Restart Assessment
            </button>
            <button onClick={onDownloadReport} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all font-bold text-xs uppercase tracking-widest shadow-xl shadow-blue-500/20">
              Download Report
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="flex flex-col items-center justify-center text-center py-10" glow>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Maturity Score</p>
            <div className="text-6xl font-black mb-4" style={{ color: maturityLevel.color }}>
              {maturityResults.overall.toFixed(2)}
            </div>
            <div className="flex flex-col items-center gap-1 mb-2">
               <p className={`text-[10px] font-bold uppercase tracking-widest ${maturityResults.overall >= benchmark ? 'text-emerald-400' : 'text-rose-400'}`}>
                 {benchmarkStatus} (Target: {benchmark})
               </p>
               <p className="text-sm font-bold text-white uppercase tracking-widest">{maturityLevel.name}</p>
            </div>
          </Card>

          <Card className="lg:col-span-1">
             <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
               <p className="text-xs font-bold text-white uppercase tracking-widest">Maturity Trend</p>
             </div>
             <div className="flex items-end justify-between mb-2">
                <div className="text-4xl font-black text-white">
                  {driftValue >= 0 ? '+' : ''}{driftValue.toFixed(2)}
                </div>
                <div className={`text-xs font-bold uppercase ${driftValue >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {driftValue > 0 ? 'Improving' : driftValue < 0 ? 'Regression' : 'Stable'}
                </div>
             </div>
             <div className="h-12 text-slate-400 text-xs font-mono">
                {driftValue > 0 ? 'Positive improvement detected.' : driftValue < 0 ? 'Regression detected in results.' : 'Maturity level stable over time'}
             </div>
          </Card>

          <Card className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center"><AlertCircle size={20} /></div>
               <p className="text-xs font-bold text-white uppercase tracking-widest">Priority Improvement Areas</p>
             </div>
             {maturityResults.weaknesses.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {maturityResults.weaknesses.slice(0, 2).map((w: any) => (
                    <div key={w.id} className="p-4 bg-rose-500/10 rounded-xl border border-rose-500/20">
                      <p className="text-[10px] text-rose-400 font-bold uppercase mb-1 uppercase text-xs">{w.pillar}</p>
                      <p className="text-xl font-bold text-white">{w.score} / 5</p>
                      <p className="text-[10px] text-slate-500 mt-1 italic">Gap detected.</p>
                    </div>
                  ))}
               </div>
             ) : (
               <div className="flex items-center justify-center h-24 text-slate-600 font-medium italic text-sm text-center">
                 Maturity parameters stabilized.
               </div>
             )}
          </Card>
        </div>

        <MaturityCharts maturityResults={maturityResults} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Response Log</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-white/5">
                      <th className="pb-4 font-bold uppercase tracking-widest">Assessment Item</th>
                      <th className="pb-4 font-bold uppercase tracking-widest">Dimension</th>
                      <th className="pb-4 font-bold uppercase tracking-widest text-center">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {QUESTIONS.filter(q => responses[q.id]).map(q => (
                      <tr key={q.id} className="text-slate-300">
                        <td className="py-4 font-medium max-w-[350px] truncate leading-relaxed">{q.text}</td>
                        <td className="py-4 text-slate-500 uppercase tracking-widest">{q.dim}</td>
                        <td className="py-4 text-center">
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded font-bold border border-blue-500/20">{responses[q.id]}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Prioritized Improvement Roadmap</h3>
                <span className="text-[10px] text-slate-500 font-medium italic">Relative Prioritization Index</span>
              </div>
              <div className="space-y-4">
                {roadmap.length > 0 ? (
                  roadmap.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                       <div className={`mt-1.5 p-1 rounded-full ${item.priority === 'Critical' ? 'bg-rose-500' : item.priority === 'High' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                       <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{item.pillar}</span>
                            <div className="flex items-center gap-3">
                              <span className="text-[10px] font-bold text-emerald-400 uppercase">+{item.uplift} Potential Uplift</span>
                              <span className={`text-[10px] font-bold uppercase ${item.priority === 'Critical' ? 'text-rose-400' : item.priority === 'High' ? 'text-amber-400' : 'text-blue-400'}`}>{item.priority}</span>
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.action}</p>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500 italic text-sm">No critical gaps identified.</div>
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-8">
            <MaturityAssistant maturityResults={maturityResults} roadmap={roadmap} />
            
            <Card>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Maturity Insights</h3>
              <div className="space-y-4">
                {maturityResults.weaknesses.length > 0 ? (
                  maturityResults.weaknesses.slice(0, 3).map((w: any, idx: number) => (
                    <div key={idx} className="p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400">Maturity Gap</p>
                        <TrendingUp size={14} className="text-rose-500 rotate-180 opacity-50" />
                      </div>
                      <h4 className="text-sm font-bold text-white mb-2 uppercase">{w.pillar}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Score of {w.score} in {w.pillar}. Targeted attention required to improve Maturity Score.</p>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
                    <CheckCircle2 size={32} className="text-blue-400 mx-auto mb-3" />
                    <p className="text-[10px] font-bold text-white uppercase tracking-widest">Target Maturity Verified</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── MATURITY ENGINE (Weighted Scoring Logic) ────────────────────────
const useMaturityEngine = (responses: any) => {
  return useMemo(() => {
    const answeredIds = Object.keys(responses).map(Number);
    if (!answeredIds.length) return { overall: 0, weaknesses: [], confidence: 0, pillarScores: [], dimScores: [] };

    // Calculate Pillar Scores using 2D Matrix (Dimension weights within Pillar)
    const pillarScores = PILLARS.map(p => {
      const qInPillar = QUESTIONS.filter(q => q.pillar === p.id);
      const answeredInPillar = qInPillar.filter(q => responses[q.id]);

      if (!answeredInPillar.length) {
        return { id: p.id, pillar: p.name, score: 0, weight: p.weight };
      }

      // Calculate Dimension Averages within this Pillar
      const dimAverages = DIMENSIONS.map(dim => {
        const qInDim = answeredInPillar.filter(q => q.dim === dim);
        const avg = qInDim.length 
          ? qInDim.reduce((acc, curr) => acc + responses[curr.id], 0) / qInDim.length 
          : 0;
        return { dim, avg, weight: DIM_WEIGHTS[dim as keyof typeof DIM_WEIGHTS] };
      });

      // Filter to only dimensions with answers in this pillar to avoid dividing by 0
      const activeDims = dimAverages.filter(d => d.avg > 0);
      const totalActiveDimWeight = activeDims.reduce((acc, d) => acc + d.weight, 0);

      const pillarScore = totalActiveDimWeight > 0 
        ? activeDims.reduce((acc, d) => acc + d.avg * d.weight, 0) / totalActiveDimWeight 
        : 0;

      return {
        id: p.id,
        pillar: p.name,
        score: Number(pillarScore.toFixed(2)),
        weight: p.weight
      };
    });

    // Calculate Overall Maturity Score
    const overall = pillarScores.reduce((acc, p) => acc + p.score * p.weight, 0);

    // Calculate Global Dimension Scores (Straight Average across all relevant questions)
    const dimScores = DIMENSIONS.map(dim => {
      const qInDim = QUESTIONS.filter(q => q.dim === dim && responses[q.id]);
      const score = qInDim.length 
        ? qInDim.reduce((acc, curr) => acc + responses[curr.id], 0) / qInDim.length
        : 0;

      return { subject: dim, A: Number(score.toFixed(2)), fullMark: 5 };
    });

    const weaknesses = [...pillarScores]
      .filter(p => p.score > 0 && p.score < 3.5)
      .sort((a, b) => a.score - b.score);

    const confidence = Math.round((answeredIds.length / QUESTIONS.length) * 100);

    return { overall: Number(overall.toFixed(2)), pillarScores, dimScores, weaknesses, confidence };
  }, [responses]);
};

// ── LOGIN ASSISTANT ──────────────────────────────────────────────────
const LoginAssistant = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-72 h-96"
          >
            <Card className="h-full p-0 flex flex-col border-blue-500/30 overflow-hidden shadow-2xl">
              <div className="p-4 bg-blue-600/20 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-xs font-bold uppercase tracking-widest text-white">Navigator Help</span>
                </div>
                <button onClick={() => setOpen(false)}><X size={16} className="text-slate-500 hover:text-white" /></button>
              </div>
              <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                 <div className="p-3 bg-white/5 rounded-xl text-[10px] text-slate-300 leading-relaxed font-medium">
                   Welcome to the RNOS™ Navigator login. <br /><br />
                   If you are a SEC ERM analyst, please enter your corporate credentials.
                 </div>
                 <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] text-blue-300 leading-relaxed font-bold">
                   Assessment Prototype: <br />
                   Access is limited to authorized perimeters. All logins are rule-validated.
                 </div>
              </div>
              <div className="p-4 bg-slate-900/80 border-t border-white/5">
                 <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest">Contact Support</button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setOpen(!open)}
        className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
};

// ── INSIGHT ASSISTANT ───────────────────────────────────────────────
// ── MATURITY ASSISTANT ───────────────────────────────────────────────
const MaturityAssistant = ({ maturityResults, roadmap }: { maturityResults: any, roadmap: any[] }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: "Hello. I am your Maturity Assistant. I provide data-driven guidance based on your assessment results. How can I help you improve your score?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");

    setTimeout(() => {
      let botResponse = "Analyzing your maturity results...";
      const lower = userMsg.toLowerCase();
      const weakest = maturityResults.weaknesses[0];
      const benchmark = 3.5;

      if (lower.includes("weakest") || lower.includes("gap") || lower.includes("problem")) {
        if (weakest) {
          botResponse = `Your weakest maturity area is ${weakest.pillar} with a score of ${weakest.score}/5. This represents a priority maturity gap that requires documentation and oversight.`;
        } else if (maturityResults.overall === 0) {
          botResponse = "Insufficient data to identify gaps. Please complete more assessment items first.";
        } else {
          botResponse = "Your maturity is well-balanced across all assessed domains. No critical gaps detected.";
        }
      } else if (lower.includes("overall") || lower.includes("score") || lower.includes("maturity")) {
        const comparison = maturityResults.overall >= benchmark ? "above" : "below";
        botResponse = `Your current Maturity Score is ${maturityResults.overall.toFixed(2)}, which is ${comparison} the benchmark of ${benchmark.toFixed(2)}. This classifies as '${getML(maturityResults.overall).name}'.`;
      } else if (lower.includes("roadmap") || lower.includes("next") || lower.includes("improve") || lower.includes("plan")) {
        if (weakest && roadmap[0]) {
          botResponse = `To improve your score, focus on: ${roadmap[0].action}. This area represents the highest relative prioritization indicator (~${roadmap[0].uplift}) for your maturity improvement.`;
        } else {
          botResponse = "Maturity parameters are stabilized. Focus on maintenance and data-driven continuous improvement.";
        }
      } else {
        const p = weakest;
        if (p) {
          botResponse = `Based on your current results, the ${p.pillar} pillar is your primary performance gap (${p.score}/5). Addressing the missing controls in this area will yield the highest strategic improvement for your overall Maturity Score of ${maturityResults.overall.toFixed(2)}.`;
        } else {
          botResponse = `Your overall Maturity Score is ${maturityResults.overall.toFixed(2)}. I can provide detailed insights into specific pillar gaps or suggested roadmap actions. What would you like to explore?`;
        }
      }

      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 800);
  };

  return (
    <Card className="flex flex-col h-[420px] p-0 overflow-hidden border-blue-500/30 shadow-lg">
      <div className="p-4 border-b border-white/5 bg-blue-600/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold uppercase tracking-widest text-white">Maturity Assistant</span>
            <span className="text-[10px] text-blue-400 font-medium tracking-tight">Structured Maturity Guidance</span>
          </div>
        </div>
        <MessageSquare size={16} className="text-blue-400" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/10 shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-white/5 flex gap-2">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask about your maturity gaps..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-blue-500 transition-all font-medium"
        />
        <button onClick={handleSend} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20">
          <Send size={16} />
        </button>
      </div>
    </Card>
  );
};

// ── UTILITIES ────────────────────────────────────────────────────────

function getML(score: number): MaturityLevel {
  if (score < 1.5) return MATURITY_LEVELS[0];
  if (score < 2.5) return MATURITY_LEVELS[1];
  if (score < 3.5) return MATURITY_LEVELS[2];
  if (score < 4.5) return MATURITY_LEVELS[3];
  return MATURITY_LEVELS[4];
}

// ── RENAMED SCREENS FOR ALIGNMENT ───────────────────────────────────

const LandingScreen = WelcomeScreen;
const BusinessUnitSelection = BUScreen;
const MaturityAssessment = AssessmentScreen;

// ── APP ROOT ─────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState<"welcome" | "login" | "bu" | "assessment" | "dashboard">("welcome");
  const [selectedBU, setSelectedBU] = useState<any>(null);
  const [responses, setResponses] = useState<any>({});
  const [history, setHistory] = useState<any[]>([]);

  // Maturity Engine trigger logic
  const maturityResults = useMaturityEngine(responses);

  const handleAssessmentComplete = () => {
    setHistory(prev => [
      ...prev,
      {
        date: new Date().toISOString(),
        score: maturityResults.overall,
        pillarScores: [...maturityResults.pillarScores]
      }
    ]);
    setScreen("dashboard");
  };

  const handleReset = () => {
    setResponses({});
    setHistory([]);
    setScreen("welcome");
  };

  return (
    <div className="selection:bg-blue-500 selection:text-white">
      <AnimatePresence mode="wait">
        {screen === "welcome" && (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingScreen onEnter={() => setScreen("login")} />
          </motion.div>
        )}
        
        {screen === "login" && (
          <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoginScreen onLogin={() => setScreen("bu")} onBack={() => setScreen("welcome")} />
          </motion.div>
        )}

        {screen === "bu" && (
          <motion.div key="bu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <BusinessUnitSelection onSelect={(bu) => { setSelectedBU(bu); setScreen("assessment"); }} onBack={() => setScreen("login")} />
          </motion.div>
        )}

        {screen === "assessment" && (
          <motion.div key="assessment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaturityAssessment responses={responses} setResponses={setResponses} onComplete={handleAssessmentComplete} />
          </motion.div>
        )}

        {screen === "dashboard" && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MaturityDashboard responses={responses} history={history} onReset={handleReset} onDownloadReport={() => {}} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {screen === "login" && <LoginAssistant />}
      
      {/* Global Navigation HUD (Only when logged in) */}
      {["bu", "assessment", "dashboard"].includes(screen) && (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-[100]">
          <button 
            onClick={() => setScreen("welcome")}
            className="p-3 text-slate-500 hover:text-white transition-colors rounded-xl hover:bg-white/5"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
          <div className="w-px h-8 bg-white/10" />
          <button 
            onClick={() => setScreen("bu")}
            className={`p-3 transition-colors rounded-xl ${screen === 'bu' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            title="Entity Selection"
          >
            <Building2 size={20} />
          </button>
          <button 
            onClick={() => setScreen("assessment")}
            className={`p-3 transition-colors rounded-xl ${screen === 'assessment' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            title="Active Assessment"
          >
            <ListChecks size={20} />
          </button>
          <button 
            onClick={() => setScreen("dashboard")}
            className={`p-3 transition-colors rounded-xl ${screen === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            title="Maturity Dashboard"
          >
            <LayoutDashboard size={20} />
          </button>
        </nav>
      )}
    </div>
  );
}
