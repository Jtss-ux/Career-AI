import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Section } from './ui/Section';
import { cn, EASE } from '../lib/utils';

const faqs = [
  { q: "How does the orchestrator select agents?", a: "The core intelligence layer evaluates the intent and context of your query, matching it against the specialized knowledge profiles of our agent roster." },
  { q: "Is my task data processed locally?", a: "Yes. Assistant AI prioritizes local execution and leverages encrypted bridges for external model routing, ensuring your data remains isolated." },
  { q: "Can I add custom agents to the roster?", a: "The current ADK architecture supports seamless integration of custom agents through our modular specialist API." },
  { q: "How secure is the MCP integration?", a: "The Model Context Protocol integration uses high-level isolation layers to ensure tools only access the specific context granted by the user." },
];

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-12 max-w-[1000px] mx-auto text-center">
      <h2 className="font-heading text-4xl sm:text-5xl mb-12 sm:mb-20 italic">Common Inquiries</h2>
      <div className="space-y-3 sm:space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="text-left">
            <button 
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full p-5 sm:p-6 lg:p-8 liquid-glass rounded-2xl sm:rounded-3xl flex justify-between items-center gap-4 group transition-all hover:bg-white/[0.02]"
            >
              <span className="font-heading text-lg sm:text-xl lg:text-2xl italic group-hover:text-indigo-400 transition-colors text-left">{faq.q}</span>
              <ChevronDown className={cn("w-5 h-5 sm:w-6 sm:h-6 text-white/30 transition-transform duration-500 shrink-0", openIndex === i ? "rotate-180" : "")} />
            </button>
            <AnimatePresence>
              {openIndex === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="p-6 sm:p-8 lg:p-10 font-body text-white/50 leading-relaxed text-sm sm:text-base lg:text-lg border-x border-white/5 bg-white/[0.01] rounded-b-2xl sm:rounded-b-3xl">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </Section>
  );
};
