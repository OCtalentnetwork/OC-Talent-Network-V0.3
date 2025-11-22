import React, { useState } from 'react';
import { AgentType, AgentConfig } from '../types';
import LiveSession from '../components/LiveSession';
import NeoButton from '../components/NeoButton';
import { Briefcase, HeartHandshake, ArrowRight, CheckSquare } from 'lucide-react';

const AGENTS: Record<AgentType, AgentConfig> = {
  [AgentType.INTERVIEWER]: {
    id: AgentType.INTERVIEWER,
    name: "The Interview Agent",
    role: "Recruiter Bot",
    description: "Conducts initial high-volume interviews for AEC roles. Assesses candidate fit immediately.",
    color: "bg-octn-blue",
    systemInstruction: `You are "The Interview Agent" for Open Concept Talent Network (OCTN). 
    Your goal is to screen candidates for Architecture, Engineering, and Construction (AEC) roles.
    1. Start by introducing yourself warmly and asking for the candidate's name.
    2. Ask 3 distinct questions related to their experience in the AEC industry (e.g., "What specific CAD software have you used?", "Tell me about a project challenge you overcame.").
    3. Listen carefully. 
    4. After the questions, determine if they are a "FIT" (good experience, articulate) or "NO-FIT".
    5. Explain your recommendation to them politely.
    6. If FIT: Tell them a human manager will contact them.
    7. If NO-FIT: Suggest they speak to the Career Advisor Agent for help.
    8. CRITICAL: Before saying goodbye, you MUST call the 'sendTranscriptionEmail' tool to log this interview.
    Keep responses concise and professional.`
  },
  [AgentType.ADVISOR]: {
    id: AgentType.ADVISOR,
    name: "Career Advisor Agent",
    role: "Career Coach",
    description: "Provides personalized advice on resume building, skill gaps, and career transitions in AEC.",
    color: "bg-octn-purple",
    systemInstruction: `You are "The Career Advisor Agent" for Open Concept Talent Network.
    Your goal is to support candidates who might not fit current roles or general job seekers.
    1. Introduce yourself as a supportive coach.
    2. Ask what they are struggling with (Resume? Skills? Interview confidence?).
    3. Provide 2-3 actionable, concrete tips specifically for the Architecture/Engineering/Construction market.
    4. Be empathetic but practical.
    5. End by encouraging them to keep applying.
    6. CRITICAL: Call the 'sendTranscriptionEmail' tool at the end to record the session for our records.`
  }
};

const LandingPage: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentConfig | null>(null);
  const [showConsent, setShowConsent] = useState(false);

  const handleAgentSelect = (agent: AgentConfig) => {
    setSelectedAgent(agent);
    setShowConsent(true);
  };

  const handleConsentGiven = () => {
    setShowConsent(false);
    // Session starts automatically because selectedAgent is not null and we mount LiveSession
  };

  const handleEndSession = () => {
    setSelectedAgent(null);
    setShowConsent(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Hero */}
      <header className="bg-octn-dark text-white py-20 px-6 border-b-4 border-black">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase leading-none tracking-tighter">
            The Future of <br/><span className="text-octn-blue">AEC Hiring</span> is Voice
          </h1>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto text-gray-300 mb-10">
            Two distinct AI agents designed to optimize your candidate journey. 
            Screen faster. Support better.
          </p>
          <NeoButton variant="accent" className="text-xl px-8 py-4">
            Start Hiring Now
          </NeoButton>
        </div>
      </header>

      {/* Agent Selection */}
      <main className="flex-grow container mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Interview Agent Card */}
          <div className="bg-white border-4 border-black shadow-neo-lg flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-octn-blue p-6 border-b-4 border-black">
              <Briefcase className="w-12 h-12 text-white mb-4" />
              <h2 className="text-3xl font-black text-white uppercase">The Interview Agent</h2>
            </div>
            <div className="p-8 flex-grow">
              <p className="text-lg font-medium mb-6">
                Conducts initial, high-volume job interviews, assesses candidate fit against current openings, and provides immediate recommendations.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-octn-blue"/> <span>Automatic Screening</span></li>
                <li className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-octn-blue"/> <span>Fit/No-Fit Analysis</span></li>
                <li className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-octn-blue"/> <span>Routing to Recruiters</span></li>
              </ul>
            </div>
            <div className="p-6 border-t-4 border-black bg-gray-50">
              <NeoButton fullWidth onClick={() => handleAgentSelect(AGENTS.INTERVIEWER)}>
                Start Interview
              </NeoButton>
            </div>
          </div>

          {/* Career Advisor Card */}
          <div className="bg-white border-4 border-black shadow-neo-lg flex flex-col h-full hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-octn-purple p-6 border-b-4 border-black">
              <HeartHandshake className="w-12 h-12 text-white mb-4" />
              <h2 className="text-3xl font-black text-white uppercase">Career Advisor</h2>
            </div>
            <div className="p-8 flex-grow">
              <p className="text-lg font-medium mb-6">
                Provides personalized, actionable career transition and skill-building advice to candidates or general job seekers.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-octn-purple"/> <span>Resume Feedback</span></li>
                <li className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-octn-purple"/> <span>Skill Gap Analysis</span></li>
                <li className="flex items-center gap-2"><CheckSquare className="w-5 h-5 text-octn-purple"/> <span>Market Insights</span></li>
              </ul>
            </div>
            <div className="p-6 border-t-4 border-black bg-gray-50">
              <NeoButton variant="accent" fullWidth onClick={() => handleAgentSelect(AGENTS.ADVISOR)}>
                Get Advice
              </NeoButton>
            </div>
          </div>

        </div>
      </main>

      {/* Consent Modal */}
      {showConsent && selectedAgent && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full border-4 border-white p-8">
            <h3 className="text-2xl font-black uppercase mb-4 text-black border-b-4 border-black pb-2">
              Consent Required
            </h3>
            <p className="text-lg mb-6 font-medium leading-relaxed">
              By proceeding, you consent to this conversation being <strong>transcribed and recorded</strong> using Google Cloud AI technologies. 
              Transcripts will be sent to <strong>alex@octalent.net</strong> for review by Open Concept Talent Network recruiters.
            </p>
            <div className="flex flex-col gap-4">
              <NeoButton onClick={handleConsentGiven} className="w-full">
                I Consent & Start Session
              </NeoButton>
              <button 
                onClick={handleEndSession} 
                className="text-center underline font-bold uppercase hover:text-red-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active Live Session */}
      {selectedAgent && !showConsent && (
        <LiveSession agent={selectedAgent} onEndSession={handleEndSession} />
      )}
    </div>
  );
};

export default LandingPage;