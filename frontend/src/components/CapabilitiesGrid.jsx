import { motion } from 'framer-motion';
import { Zap, Users, Layers, Cpu, Shield, Wifi } from 'lucide-react';
import { Section } from './ui/Section';

const capabilities = [
  { title: 'Autonomous Execution', desc: 'Delegated tasks are handled independently from start to finish.', icon: Zap },
  { title: 'Career Trajectory', desc: 'Predictive analytics for optimizing your professional path.', icon: Users },
  { title: 'MCP Integration', desc: 'Plugs directly into the Model Context Protocol for boundless tool access.', icon: Layers },
  { title: 'Context Retention', desc: 'Long-term memory across sessions using advanced persistence.', icon: Cpu },
  { title: 'Shielded Privacy', desc: 'Total isolation of local data with high-grade encryption.', icon: Shield },
  { title: 'Dual-Engine Synthesis', desc: 'Dynamically switches between Gemini 1.5 Pro and Flash for optimal performance.', icon: Wifi },
];

export const CapabilitiesGrid = () => (
  <Section id="performance" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto text-center relative">
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[180px] rounded-full -z-10" />
    <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-12 sm:mb-20">Engineering the Impossible</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {capabilities.map((card, i) => (
        <motion.div 
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -8 }}
          className="liquid-glass-strong p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] text-left group"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl border border-white/10 flex items-center justify-center mb-6 sm:mb-8 bg-white/5 transition-all group-hover:border-indigo-500/50 group-hover:bg-indigo-500/10">
            <card.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white/80 group-hover:text-indigo-400 transition-colors" />
          </div>
          <h4 className="font-heading text-xl sm:text-2xl lg:text-3xl mb-3 sm:mb-4 italic">{card.title}</h4>
          <p className="font-body text-white/50 leading-relaxed text-sm sm:text-base">{card.desc}</p>
        </motion.div>
      ))}
    </div>
  </Section>
);
