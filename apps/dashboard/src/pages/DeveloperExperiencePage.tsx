import React from 'react';
import { motion } from 'framer-motion';
import { Zap, GitBranch, Terminal, Shield, ArrowRight, Layers, Cpu, Code, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

const PALETTE = {
  clouded: '#d1d1d1',
  greasy: '#828383',
  suede: '#434343',
  wax: '#2b2b2b',
  sooty: '#141414',
  armor: '#030303',
};

interface ExperienceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  accent: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({ icon, title, description, cta, onClick, accent }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative h-full flex flex-col p-8 rounded-[32px] border transition-all overflow-hidden"
      style={{ backgroundColor: PALETTE.sooty, borderColor: PALETTE.suede }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      
      <div className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-8 group-hover:scale-110 transition-transform" style={{ color: accent, backgroundColor: PALETTE.wax, borderColor: PALETTE.suede }}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-sm leading-relaxed mb-12 font-medium" style={{ color: PALETTE.greasy }}>
        {description}
      </p>
      
      <div className="mt-auto">
        <Button 
          onClick={onClick}
          className="w-full h-14 rounded-2xl font-bold text-sm tracking-tight flex items-center justify-between px-6 group/btn shadow-xl"
          style={{ backgroundColor: PALETTE.clouded, color: PALETTE.armor }}
        >
          {cta}
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-white/20 transition-all duration-700" />
    </motion.div>
  );
};

export const DeveloperExperiencePage = ({ 
  onSelectFlowBuilder, 
  onSelectQuickstart, 
  onSelectPlayground,
  onBack
}: { 
  onSelectFlowBuilder: () => void;
  onSelectQuickstart: () => void;
  onSelectPlayground: () => void;
  onBack: () => void;
}) => {
  return (
    <div className="min-h-screen text-white flex flex-col p-6 overflow-hidden" style={{ backgroundColor: PALETTE.armor }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(209,209,209,0.06) 0%, transparent 50%)' }} />
      
      <header className="max-w-7xl mx-auto w-full py-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl border" style={{ backgroundColor: PALETTE.wax, borderColor: PALETTE.suede }}>
            <Shield className="w-6 h-6" style={{ color: PALETTE.clouded }} />
          </div>
          <span className="text-sm font-black tracking-[0.3em] text-white uppercase">ShieldGuard</span>
        </div>
        <button 
          onClick={onBack}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold text-white transition-all"
            style={{ borderColor: PALETTE.suede, backgroundColor: PALETTE.wax }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </header>
      
      <main className="max-w-7xl mx-auto w-full flex-1 flex flex-col justify-center py-20">
        <div className="max-w-3xl mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[10px] font-mono tracking-[0.4em] uppercase mb-6 block font-bold" style={{ color: PALETTE.clouded }}>Onboarding Experience</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Build programmable <br /> <span style={{ color: PALETTE.clouded }}>telecom trust</span> workflows.
            </h1>
            <p className="text-lg md:text-xl leading-relaxed font-medium" style={{ color: PALETTE.greasy }}>
              Choose your path to integrating infrastructure-grade telecom verification into your application.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <ExperienceCard 
              accent={PALETTE.clouded}
              icon={<Zap className="w-8 h-8" />}
              title="Quick Evaluation"
              description="Run your first trust evaluation in under 60 seconds with our interactive simulator."
              cta="Start Quick Demo"
              onClick={onSelectQuickstart}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ExperienceCard 
              accent={PALETTE.greasy}
              icon={<GitBranch className="w-8 h-8" />}
              title="Visual Flow Builder"
              description="Design programmable verification workflows visually using our node-based builder."
              cta="Open Flow Builder"
              onClick={onSelectFlowBuilder}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <ExperienceCard 
              accent={PALETTE.clouded}
              icon={<Terminal className="w-8 h-8" />}
              title="Developer Playground"
              description="Test ShieldGuard APIs directly with real-time Network as Code orchestration responses."
              cta="Open Playground"
              onClick={onSelectPlayground}
            />
          </motion.div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full py-12 flex items-center justify-between text-[10px] font-mono tracking-widest uppercase font-bold" style={{ color: PALETTE.greasy }}>
        <div>ORCHESTRATION GATEWAY: SG_LIVE_MAIN_01</div>
        <div className="flex gap-8">
          <a href="#" className="transition-colors hover:text-white">Documentation</a>
          <a href="#" className="transition-colors hover:text-white">API Reference</a>
          <a href="#" className="transition-colors hover:text-white">Status</a>
        </div>
      </footer>
    </div>
  );
};
