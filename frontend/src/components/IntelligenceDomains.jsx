import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { Section } from './ui/Section';
import { cn } from '../lib/utils';

const domains = [
  { title: 'Task Matrix', img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80', span: true },
  { title: 'Career Nexus', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80', span: false },
  { title: 'Deep Knowledge', img: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?auto=format&fit=crop&q=80', span: false },
  { title: 'Uptime Guard', img: 'https://images.unsplash.com/photo-1551288049-bbbda5366391?auto=format&fit=crop&q=80', span: false },
  { title: 'Control Deck', img: 'https://images.unsplash.com/photo-1544006659-f0b21f04cb1d?auto=format&fit=crop&q=80', span: true },
];

export const IntelligenceDomains = () => (
  <Section id="domains" className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12 sm:mb-16">
      <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl">Intelligence Domains</h2>
      <a href="#" className="uppercase tracking-[0.2em] text-xs font-bold text-indigo-400 hover:text-white transition-colors pb-2 border-b border-indigo-500">Explore All Modules</a>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {domains.map((item, i) => (
        <motion.div 
          key={item.title}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 0.98 }}
          className={cn(
            "h-[280px] sm:h-[350px] lg:h-[400px] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] overflow-hidden relative group cursor-pointer", 
            item.span ? "sm:col-span-2 lg:col-span-2" : "sm:col-span-1 lg:col-span-1"
          )}
        >
          <img 
            src={item.img} 
            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110 opacity-70"
            alt={item.title}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02040A] via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 flex justify-between items-end">
            <h4 className="font-heading text-2xl sm:text-3xl lg:text-4xl">{item.title}</h4>
            <button className="p-2 sm:p-3 liquid-glass rounded-full group-hover:bg-white group-hover:text-black transition-all shrink-0 ml-4">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  </Section>
);
