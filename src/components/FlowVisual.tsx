import { motion } from 'motion/react';
import { 
  Shield, 
  User, 
  Smartphone, 
  MapPin, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  XSquare,
  Zap,
  Activity
} from 'lucide-react';

export const FlowVisual = () => {
  const nodes = [
    { id: 'start', type: 'Real-time', label: 'Transaction Initiated', icon: Activity, pos: { x: 80, y: 430 }, color: 'purple' },
    { id: 'auth', type: 'Auth', label: 'User Login', icon: User, pos: { x: 150, y: 100 }, color: 'purple' },
    
    { id: 'sim', type: 'CAMARA', label: 'SIM Swap', icon: RefreshCw, pos: { x: 280, y: 300 }, color: 'cyan' },
    { id: 'device', type: 'CAMARA', label: 'Device Status', icon: Smartphone, pos: { x: 280, y: 500 }, color: 'emerald' },
    { id: 'loc', type: 'CAMARA', label: 'Location Verification', icon: MapPin, pos: { x: 280, y: 700 }, color: 'rose' },
    
    { id: 'score', type: 'Calculate', label: 'Risk Score', icon: Zap, pos: { x: 460, y: 200 }, color: 'purple' },
    { id: 'kyc', type: 'CAMARA', label: 'KYC Match', icon: CheckCircle2, pos: { x: 460, y: 700 }, color: 'emerald' },
    
    { id: 'branch', type: 'IF', label: 'Condition Branch', icon: Activity, pos: { x: 610, y: 250 }, color: 'amber' },
    
    { id: 'allow', type: 'Decision', label: 'Allow Transaction', icon: CheckCircle2, pos: { x: 800, y: 200 }, color: 'emerald' },
    { id: 'verify', type: 'Decision', label: 'Verify User', icon: AlertCircle, pos: { x: 800, y: 450 }, color: 'amber' },
    { id: 'block', type: 'Decision', label: 'Block Transaction', icon: XSquare, pos: { x: 800, y: 700 }, color: 'rose' },
  ];

  const connections = [
    { from: 'start', to: 'sim' },
    { from: 'start', to: 'device' },
    { from: 'start', to: 'loc' },
    { from: 'auth', to: 'score' },
    { from: 'sim', to: 'score' },
    { from: 'device', to: 'score' },
    { from: 'loc', to: 'kyc' },
    { from: 'score', to: 'branch' },
    { from: 'kyc', to: 'branch' },
    { from: 'branch', to: 'allow' },
    { from: 'branch', to: 'verify' },
    { from: 'branch', to: 'block' },
  ];

  const getColors = (color: string) => {
    const maps: Record<string, any> = {
      purple: { border: 'border-purple-500/30', bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'bg-purple-500/5' },
      cyan: { border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', text: 'text-cyan-400', glow: 'bg-cyan-500/5' },
      emerald: { border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'bg-emerald-500/5' },
      rose: { border: 'border-rose-500/30', bg: 'bg-rose-500/10', text: 'text-rose-400', glow: 'bg-rose-500/5' },
      amber: { border: 'border-amber-500/30', bg: 'bg-amber-500/10', text: 'text-amber-400', glow: 'bg-amber-500/5' },
    };
    return maps[color] || maps.purple;
  };

  return (
    <div className="w-full h-full bg-[#020617] relative overflow-hidden rounded-2xl border border-white/5 font-mono select-none">
      {/* Grid background */}
      <div className="absolute inset-0 opacity-[0.05]" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, white 0.5px, transparent 0.5px)', 
          backgroundSize: '20px 20px' 
        }} 
      />

      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 800" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
          </linearGradient>
        </defs>
        {connections.map((conn, i) => {
          const fromNode = nodes.find(n => n.id === conn.from)!;
          const toNode = nodes.find(n => n.id === conn.to)!;
          
          const dx = toNode.pos.x - fromNode.pos.x;
          
          const path = `M ${fromNode.pos.x + 80} ${fromNode.pos.y} C ${fromNode.pos.x + dx/1.5} ${fromNode.pos.y}, ${fromNode.pos.x + dx/3} ${toNode.pos.y}, ${toNode.pos.x - 80} ${toNode.pos.y}`;

          return (
            <motion.path
              key={i}
              d={path}
              stroke="url(#lineGrad)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3 3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, delay: i * 0.05, repeat: Infinity, repeatType: 'loop', ease: "linear" }}
            />
          );
        })}
      </svg>

      {nodes.map((node) => {
        const colors = getColors(node.color);
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute group"
            style={{ 
              left: `${(node.pos.x / 1000) * 100}%`, 
              top: `${(node.pos.y / 800) * 100}%`, 
              transform: 'translate(-50%, -50%)',
              width: '14%'
            }}
          >
            <div className={`p-2.5 rounded-xl bg-slate-950 border ${colors.border} shadow-2xl group-hover:border-white/20 transition-all duration-300 relative z-10 overflow-hidden`}>
              <div className="flex items-center gap-1.5 mb-1.5">
                 <div className={`w-4 h-4 rounded ${colors.bg} flex items-center justify-center`}>
                    <node.icon className={`w-2.5 h-2.5 ${colors.text}`} />
                 </div>
                 <span className="text-[7px] font-black uppercase tracking-[0.1em] text-white/30">{node.type}</span>
              </div>
              
              <h4 className="text-[10px] font-bold text-white mb-1.5 truncate">{node.label}</h4>
              
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-1">
                    <div className={`w-1 h-1 rounded-full ${colors.text} animate-pulse`} />
                    <span className={`text-[6px] ${colors.text} font-bold uppercase`}>Live</span>
                 </div>
              </div>
              
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-blue-500/40 rounded-l-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-blue-500/40 rounded-r-full" />
            </div>
          </motion.div>
        );
      })}
      
      {/* Node Config Panel Mock */}
      <div className="absolute bottom-6 right-6 w-64 p-5 rounded-2xl bg-[#0b0f1a]/80 backdrop-blur-xl border border-white/10 shadow-3xl text-white/80">
         <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-black tracking-widest uppercase">Node Config</span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
         </div>
         
         <div className="space-y-4">
            <div className="space-y-1.5">
               <label className="text-[8px] font-black uppercase tracking-widest text-white/30">Action</label>
               <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">ALLOW</span>
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
               </div>
            </div>
            
            <div className="space-y-1.5">
               <label className="text-[8px] font-black uppercase tracking-widest text-white/30">Target System</label>
               <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs font-mono">
                  gateway_v1.auth
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};
