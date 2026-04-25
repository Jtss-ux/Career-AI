import { motion } from 'framer-motion';
import { cn, EASE } from '../../lib/utils';

export const Section = ({ children, className = "", id }) => (
  <motion.section
    id={id}
    initial={{ opacity: 0, filter: 'blur(10px)' }}
    whileInView={{ opacity: 1, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1, ease: EASE }}
    className={cn("relative z-10", className)}
  >
    {children}
  </motion.section>
);
