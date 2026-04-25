import { motion } from 'framer-motion';
import { Section } from './ui/Section';
import { BlurText } from './ui/BlurText';

export const MissionBlock = () => (
  <Section id="orchestration" className="py-24 sm:py-40 px-4 sm:px-6 flex flex-col items-center text-center">
    <motion.div 
      initial={{ height: 0 }}
      whileInView={{ height: 100 }}
      viewport={{ once: true }}
      className="w-[1.2px] bg-gradient-to-b from-transparent via-indigo-500 to-transparent mb-12"
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full -z-10" />
    <BlurText 
      text="We are not just building tools. We are engineering the next great chapter of human productivity." 
      className="max-w-4xl font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic leading-tight text-white/90 justify-center"
      delay={0.2}
    />
  </Section>
);
