import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Sparkles, ChevronDown } from 'lucide-react';
import { BlurText } from './ui/BlurText';
import { EASE } from '../lib/utils';

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4";

export const Hero = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = VIDEO_URL;
    document.head.appendChild(link);
  }, []);

  return (
    <header id="intro" ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y, scale }} className="absolute inset-0 z-0">
        <video 
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-70"
        >
          <source src={VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040A]/30 to-[#02040A]" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 text-center px-4 sm:px-6 max-w-5xl pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: EASE }}
          className="inline-flex items-center gap-2 px-4 py-2 liquid-glass rounded-full mb-8"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs uppercase tracking-[0.3em] font-medium text-white/80">V2.0 Orchestrator Core</span>
        </motion.div>

        <BlurText 
          text="Venture Past the Sky of Intelligence" 
          className="font-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl mb-8 leading-[0.9] italic text-balance justify-center"
        />

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.8 }}
          className="font-body text-lg sm:text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Assistant AI is the first multi-agent orchestration bridge designed for total task autonomy and professional evolution.
        </motion.p>

        <motion.a 
          href="#control-deck"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 1 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-indigo-100 transition-colors"
        >
          Start Commanding
        </motion.a>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-white/30" />
        </motion.div>
      </motion.div>
    </header>
  );
};
