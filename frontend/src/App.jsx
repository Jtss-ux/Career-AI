import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MissionBlock } from './components/MissionBlock';
import { AgentRoster } from './components/AgentRoster';
import { CapabilitiesGrid } from './components/CapabilitiesGrid';
import { JourneyTimeline } from './components/JourneyTimeline';
import { IntelligenceDomains } from './components/IntelligenceDomains';
import { AssistantChat } from './components/AssistantChat';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { useActiveSection } from './hooks/useActiveSection';

export default function App() {
  const activeSection = useActiveSection([
    'control-deck', 
    'domains', 
    'intro', 
    'orchestration', 
    'agent-roster', 
    'performance'
  ]);

  return (
    <div className="min-h-screen relative">
      <Navbar activeSection={activeSection} />
      <main>
        <AssistantChat />
        <IntelligenceDomains />
        <Hero />
        <MissionBlock />
        <AgentRoster />
        <CapabilitiesGrid />
        <JourneyTimeline />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
