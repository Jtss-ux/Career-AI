import { Orbit } from 'lucide-react';

export const Footer = () => (
  <footer className="pt-20 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 border-t border-white/5 relative bg-[#02040A] overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
    <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 mb-16 sm:mb-20">
      <div className="lg:col-span-5">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <Orbit className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" />
          <span className="font-heading italic text-2xl sm:text-3xl">Assistant AI .</span>
        </div>
        <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl italic leading-[0.9] text-balance mb-8 sm:mb-12">The universe of intelligence is calling.</h2>
        <div className="flex gap-2 sm:gap-4 p-2 liquid-glass rounded-2xl sm:rounded-3xl max-w-md">
          <input type="email" placeholder="Your email" className="flex-1 bg-transparent border-none focus:ring-0 px-4 sm:px-6 font-body text-sm outline-none min-w-0" />
          <button className="bg-white text-black px-4 sm:px-8 py-3 rounded-xl sm:rounded-2xl font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest text-[10px] sm:text-xs shrink-0">Authorize</button>
        </div>
      </div>
      
      <div className="lg:col-span-1 hidden lg:block" />
      
      <div className="lg:col-span-3">
        <h5 className="text-white/30 uppercase tracking-[0.2em] text-[10px] font-bold mb-6 sm:mb-8">Intelligence Operations</h5>
        <ul className="space-y-3 sm:space-y-4 font-body text-base sm:text-lg text-white/60">
          <li><a href="#" className="hover:text-white transition-colors">Orchestration Core</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Agent Marketplace</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Developer Portal</a></li>
          <li><a href="#" className="hover:text-white transition-colors">MCP Registry</a></li>
        </ul>
      </div>

      <div className="lg:col-span-3">
        <h5 className="text-white/30 uppercase tracking-[0.2em] text-[10px] font-bold mb-6 sm:mb-8">Strategic Nodes</h5>
        <ul className="space-y-3 sm:space-y-4 font-body text-base sm:text-lg text-white/60">
          <li><a href="#" className="hover:text-white transition-colors">Security Protocol</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Ethics Guidelines</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Performance Telemetry</a></li>
          <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
        </ul>
      </div>
    </div>

    <div className="pt-8 sm:pt-16 border-t border-white/5 max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
      <p className="text-white/20 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em]">2026 Assistant AI. All rights reserved.</p>
      <div className="flex gap-6 sm:gap-12">
        <span className="text-white/20 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] hover:text-white/40 cursor-pointer transition-colors">Privacy Interface</span>
        <span className="text-white/20 text-[10px] sm:text-xs font-medium uppercase tracking-[0.3em] hover:text-white/40 cursor-pointer transition-colors">Terms of Logic</span>
      </div>
      <div className="flex gap-6 sm:gap-8 items-center grayscale opacity-30">
        <span className="font-heading italic text-lg sm:text-xl">ADK v1.2</span>
        <span className="font-heading italic text-lg sm:text-xl">MCP Enabled</span>
      </div>
    </div>
  </footer>
);
