import { motion } from 'framer-motion';
import { cn, EASE } from '../../lib/utils';

export const BlurText = ({ text, delay = 0, className = "" }) => {
  const words = text.split(" ");
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("flex flex-wrap gap-x-[0.3em]", className)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { filter: 'blur(12px)', opacity: 0, y: 40 },
            visible: { 
              filter: 'blur(0px)', 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.8, ease: EASE, delay: delay + (i * 0.08) }
            }
          }}
          className="inline-block"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};
