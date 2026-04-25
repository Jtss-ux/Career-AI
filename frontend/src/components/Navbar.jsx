import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Orbit, Menu, X } from 'lucide-react';
import { cn, EASE } from '../lib/utils';

const navItems = [
  { label: 'Control Deck', id: 'control-deck' },
  { label: 'Domains', id: 'domains' },
  { label: 'Intro', id: 'intro' },
  { label: 'Orchestration', id: 'orchestration' },
  { label: 'Agent Roster', id: 'agent-roster' },
  { label: 'Performance', id: 'performance' },
];

export const Navbar = ({ activeSection }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-4 lg:px-12 py-4 flex justify-between items-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-3 liquid-glass rounded-full pointer-events-auto cursor-pointer flex items-center gap-3"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Orbit className="w-6 h-6 text-indigo-400 animate-pulse-slow" />
          <span className="font-heading italic text-xl pr-2 text-white">Assistant AI .</span>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden lg:flex items-center gap-1 p-2 liquid-glass rounded-full pointer-events-auto bg-white/5 relative"
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                className={cn(
                  "px-5 py-2 text-[10px] font-bold transition-colors uppercase tracking-[0.2em] rounded-full relative z-10",
                  isActive ? "text-white" : "text-white/40 hover:text-white/70"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-indigo-500/20 ring-1 ring-indigo-500/40 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </a>
            );
          })}
        </motion.div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-3 liquid-glass rounded-full pointer-events-auto"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </motion.button>
      </nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-space-void/95 border-l border-white/10 p-8 pt-24"
            >
              <nav className="flex flex-col gap-4">
                {navItems.map((item, i) => {
                  const isActive = activeSection === item.id;
                  return (
                    <motion.a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={() => setMobileOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, ease: EASE }}
                      className={cn(
                        "px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.15em] transition-all",
                        isActive 
                          ? "bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
