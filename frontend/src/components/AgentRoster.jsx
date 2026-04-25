import { motion } from 'framer-motion';
import { Zap, Shield, Cpu, Layers, Wifi, Users } from 'lucide-react';
import { Section } from './ui/Section';

const stats = [
  { label: 'Latency', value: '42ms', icon: Zap },
  { label: 'Integrity', value: '99.9%', icon: Shield },
  { label: 'Intelligence', value: '1.5 Pro', icon: Cpu },
  { label: 'Tool Access', value: '450+', icon: Layers },
  { label: 'Uptime', value: '100%', icon: Wifi },
  { label: 'Success', value: '94%', icon: Users },
];

export const AgentRoster = () => (
  <Section id="agent-roster" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-[1600px] mx-auto">
    <div className="relative group order-2 lg:order-1">
      <div className="h-[500px] sm:h-[650px] lg:h-[750px] liquid-glass rounded-[2rem] sm:rounded-[3rem] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop" 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60"
          alt="Orchestrator Core"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-transparent" />
        <div className="absolute bottom-8 left-6 right-6 sm:bottom-16 sm:left-16 sm:right-16">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-indigo-400 font-bold">Core Infrastructure</p>
            <span className="bg-indigo-500/20 text-indigo-400 px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-bold border border-indigo-500/30 uppercase tracking-widest">Powered by Gemini 1.5 Pro</span>
          </div>
          <h3 className="font-heading text-4xl sm:text-5xl lg:text-6xl italic mb-4">Orchestrator-1</h3>
          <p className="font-body text-white/60 text-sm sm:text-lg max-w-sm">The apex intelligence layer coordinating specialized agents with zero-latency synchronization.</p>
        </div>
      </div>
    </div>

    <div className="flex flex-col justify-center order-1 lg:order-2">
      <h2 className="font-heading text-4xl sm:text-5xl mb-8 sm:mb-12">Universal Engineering</h2>
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="liquid-glass p-5 sm:p-8 rounded-2xl sm:rounded-3xl group cursor-default"
          >
            <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 mb-4 sm:mb-6 transition-transform group-hover:scale-110" />
            <p className="text-2xl sm:text-3xl font-heading italic mb-1">{stat.value}</p>
            <p className="text-[10px] sm:text-xs uppercase tracking-widest text-white/40">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);
