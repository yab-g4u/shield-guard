import React from 'react';
import { motion } from 'framer-motion';
import { Zap, GitBranch, Terminal, Shield, ArrowRight, Layers, Cpu, Code, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

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
      className="group relative h-full flex flex-col p-8 rounded-[32px] bg-[#131929] border border-white/5 hover:border-white/10 transition-all overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      
      <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`} style={{ color: accent }}>
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4 tracking-tight">{title}</h3>
      <p className="text-sm text-white/40 leading-relaxed mb-12 font-medium">
        {description}
      </p>
      
      <div className="mt-auto">
        <Button 
          onClick={onClick}
          className="w-full h-14 rounded-2xl bg-white text-charcoal hover:bg-neutral-200 font-bold text-sm tracking-tight flex items-center justify-between px-6 group/btn shadow-xl shadow-white/5"
        >
          {cta}
          <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-blue-500/20 transition-all duration-700" />
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
    <div className="min-h-screen bg-[#0A0F1E] text-white flex flex-col p-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.03)_0%,transparent_50%)] pointer-events-none" />
      
      <header className="max-w-7xl mx-auto w-full py-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
            <Shield className="w-6 h-6 text-blue-400" />
          </div>
          <span className="text-sm font-black tracking-[0.3em] text-white uppercase">ShieldGuard</span>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
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
            <span className="text-[10px] font-mono text-blue-400 tracking-[0.4em] uppercase mb-6 block font-bold">Onboarding Experience</span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-[1.1]">
              Build programmable <br /> <span className="text-blue-500">telecom trust</span> workflows.
            </h1>
            <p className="text-lg md:text-xl text-white/40 leading-relaxed font-medium">
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
              accent="#00D4FF"
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
              accent="#9c7bf7"
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
              accent="#66bb6a"
              icon={<Terminal className="w-8 h-8" />}
              title="Developer Playground"
              description="Test ShieldGuard APIs directly with real-time Network as Code orchestration responses."
              cta="Open Playground"
              onClick={onSelectPlayground}
            />
          </motion.div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto w-full py-12 flex items-center justify-between text-[10px] font-mono text-white/20 tracking-widest uppercase font-bold">
        <div>ORCHESTRATION GATEWAY: SG_LIVE_MAIN_01</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
          <a href="#" className="hover:text-blue-400 transition-colors">API Reference</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Status</a>
        </div>
      </footer>
    </div>
  );
};
