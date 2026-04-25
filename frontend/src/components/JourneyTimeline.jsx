import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { cn } from '../lib/utils';

const steps = [
  { title: 'Input Synthesis', desc: 'Your request is parsed for intent and complex requirements.', step: '01' },
  { title: 'Agent Selection', desc: 'The orchestrator identifies the best specialists for the task.', step: '02' },
  { title: 'Tool Calibration', desc: 'Active MCP tools are connected and executed in parallel.', step: '03' },
  { title: 'Final Resolution', desc: 'The response is validated and delivered with full context.', step: '04' },
];

export const JourneyTimeline = () => (
  <Section className="py-24 sm:py-40 px-4 sm:px-6 lg:px-12 max-w-[1200px] mx-auto">
    <div className="text-center mb-16 sm:mb-24">
      <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl mb-6 italic">The Intelligence Cycle</h2>
      <p className="font-body text-white/50 tracking-widest uppercase text-xs">A frictionless transition from request to result</p>
    </div>

    <div className="relative">
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent md:-translate-x-1/2" />
      
      {steps.map((item, i) => (
        <div key={item.title} className={cn("relative mb-12 sm:mb-24 md:flex items-center justify-between group pl-12 md:pl-0", i % 2 === 1 ? "md:flex-row-reverse" : "")}>
          <div className="absolute left-4 md:left-1/2 top-6 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20">
            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_15px_#6366f1] group-hover:scale-150 transition-transform" />
          </div>
          <div className="md:w-[45%]">
            <motion.div 
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="liquid-glass p-6 sm:p-8 lg:p-10 rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem]"
            >
              <p className="font-heading text-3xl sm:text-4xl text-indigo-500/30 mb-4">{item.step}</p>
              <h4 className="font-heading text-2xl sm:text-3xl mb-4">{item.title}</h4>
              <p className="font-body text-white/60 leading-relaxed text-sm sm:text-base">{item.desc}</p>
            </motion.div>
          </div>
          <div className="md:w-[45%] h-px" />
        </div>
      ))}
    </div>
  </Section>
);
