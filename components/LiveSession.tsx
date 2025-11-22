import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, FunctionDeclaration, Type } from '@google/genai';
import { AgentConfig } from '../types';
import { base64ToUint8Array, createPCM16Blob, decodeAudioData } from '../utils/audioUtils';
import NeoButton from './NeoButton';
import { Mic, MicOff, PhoneOff, Activity, Mail } from 'lucide-react';

interface LiveSessionProps {
  agent: AgentConfig;
  onEndSession: () => void;
}

const LiveSession: React.FC<LiveSessionProps> = ({ agent, onEndSession }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);
  const [status, setStatus] = useState('Initializing connection...');
  const [transcriptionSent, setTranscriptionSent] = useState(false);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Playback Refs
  const nextStartTimeRef = useRef<number>(0);
  const scheduledSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  // Client Ref
  const clientRef = useRef<any>(null); // Holds the session promise
  const activeRef = useRef(true);

  // --- Tools Setup ---
  const sendTranscriptionTool: FunctionDeclaration = {
    name: 'sendTranscriptionEmail',
    description: 'Sends the full conversation transcript and analysis to the recruiter email (alex@octalent.net). Call this at the end of the interview or session.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        candidateName: { type: Type.STRING, description: "Name of the candidate" },
        summary: { type: Type.STRING, description: "Summary of the conversation" },
        recommendation: { type: Type.STRING, description: "FIT or NO-FIT recommendation" },
        recipientEmail: { type: Type.STRING, description: "Must be alex@octalent.net" }
      },
      required: ['candidateName', 'summary', 'recommendation', 'recipientEmail']
    }
  };

  // --- Connection Logic ---
  useEffect(() => {
    activeRef.current = true;

    const initSession = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Init Audio Contexts
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

        // Get Mic
        inputStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        setStatus('Connecting to Agent...');

        const config = {
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: agent.id === 'INTERVIEWER' ? 'Fenrir' : 'Kore' } },
            },
            systemInstruction: agent.systemInstruction,
            tools: [{ functionDeclarations: [sendTranscriptionTool] }]
          },
          callbacks: {
            onopen: async () => {
              if (!activeRef.current) return;
              setIsConnected(true);
              setStatus('Connected. Agent is speaking...');
              
              // Setup Input Pipeline
              sourceNodeRef.current = inputCtx.createMediaStreamSource(inputStreamRef.current!);
              processorRef.current = inputCtx.createScriptProcessor(4096, 1, 1);
              
              processorRef.current.onaudioprocess = (e) => {
                if (!activeRef.current || isMuted) return;
                const inputData = e.inputBuffer.getChannelData(0);
                
                // Visualization
                let sum = 0;
                for(let i=0; i<inputData.length; i++) sum += Math.abs(inputData[i]);
                setVolume(Math.min(100, (sum / inputData.length) * 5000));

                const pcmBlob = createPCM16Blob(inputData);
                clientRef.current.then((session: any) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              sourceNodeRef.current.connect(processorRef.current);
              processorRef.current.connect(inputCtx.destination);
            },
            onmessage: async (msg: LiveServerMessage) => {
              if (!activeRef.current) return;
              
              // Handle Audio Output
              const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (audioData && audioContextRef.current) {
                const ctx = audioContextRef.current;
                const buffer = await decodeAudioData(base64ToUint8Array(audioData), ctx);
                
                const source = ctx.createBufferSource();
                source.buffer = buffer;
                source.connect(ctx.destination);
                
                const currentTime = ctx.currentTime;
                // Schedule carefully
                if (nextStartTimeRef.current < currentTime) {
                  nextStartTimeRef.current = currentTime;
                }
                
                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                
                scheduledSourcesRef.current.add(source);
                source.onended = () => scheduledSourcesRef.current.delete(source);
              }

              // Handle Interruption
              if (msg.serverContent?.interrupted) {
                 scheduledSourcesRef.current.forEach(s => {
                   try { s.stop(); } catch(e){}
                 });
                 scheduledSourcesRef.current.clear();
                 nextStartTimeRef.current = 0;
              }

              // Handle Tool Calls (Transcription Email)
              if (msg.toolCall) {
                for (const fc of msg.toolCall.functionCalls) {
                  if (fc.name === 'sendTranscriptionEmail') {
                    console.log('Mocking email send:', fc.args);
                    setTranscriptionSent(true);
                    
                    // Reply to model
                    clientRef.current.then((session: any) => {
                      session.sendToolResponse({
                        functionResponses: {
                          id: fc.id,
                          name: fc.name,
                          response: { result: "Email sent successfully to alex@octalent.net" }
                        }
                      });
                    });
                  }
                }
              }
            },
            onclose: () => {
              setStatus('Disconnected');
              setIsConnected(false);
            },
            onerror: (e: ErrorEvent) => {
              console.error(e);
              setStatus('Error connecting to AI service.');
            }
          }
        };

        clientRef.current = ai.live.connect(config);

      } catch (err) {
        console.error("Setup error", err);
        setStatus('Failed to access microphone or API.');
      }
    };

    initSession();

    return () => {
      activeRef.current = false;
      // Cleanup Audio
      if (processorRef.current) {
        processorRef.current.disconnect();
        processorRef.current.onaudioprocess = null;
      }
      if (sourceNodeRef.current) sourceNodeRef.current.disconnect();
      if (inputStreamRef.current) inputStreamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      
      scheduledSourcesRef.current.forEach(s => {
        try { s.stop(); } catch(e){}
      });
      
      // Close session if possible (API doesn't strictly expose .close() on the promise wrapper easily, 
      // but dropping the callbacks effectively stops it from the UI perspective. 
      // In a real app, we'd manage the session object more directly).
    };
  }, [agent, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl border-4 border-octn-blue shadow-[12px_12px_0px_0px_#2563EB] p-8 relative flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex justify-between items-start mb-8 border-b-2 border-gray-200 pb-4">
          <div>
            <h2 className="text-3xl font-black uppercase text-black mb-2">{agent.name}</h2>
            <p className="text-gray-600 font-medium">{status}</p>
          </div>
          <div className="bg-red-100 text-red-600 px-2 py-1 border border-red-600 text-xs font-bold uppercase animate-pulse">
            LIVE RECORDING
          </div>
        </div>

        {/* Visualizer */}
        <div className="w-full h-32 bg-gray-100 border-2 border-black mb-8 flex items-end justify-center gap-1 p-4 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i}
              className={`w-3 bg-octn-blue transition-all duration-75 ease-in-out`}
              style={{ 
                height: isConnected ? `${Math.max(10, Math.random() * volume * 2)}%` : '10%',
                opacity: isConnected ? 1 : 0.3
              }}
            />
          ))}
        </div>

        {transcriptionSent && (
           <div className="w-full mb-6 bg-green-100 border-2 border-green-600 p-4 flex items-center gap-3">
             <Mail className="w-6 h-6 text-green-700" />
             <div>
               <p className="font-bold text-green-800 uppercase">Transcription Sent</p>
               <p className="text-sm text-green-700">A copy of this interview has been emailed to alex@octalent.net</p>
             </div>
           </div>
        )}

        {/* Controls */}
        <div className="flex gap-6">
          <button 
            onClick={toggleMute}
            className={`
              p-6 rounded-full border-4 border-black shadow-neo transition-all
              ${isMuted ? 'bg-red-500 text-white' : 'bg-gray-200 text-black hover:bg-white'}
            `}
          >
            {isMuted ? <MicOff size={32} /> : <Mic size={32} />}
          </button>

          <button 
            onClick={onEndSession}
            className="p-6 rounded-full bg-black text-white border-4 border-transparent hover:border-red-500 hover:text-red-500 transition-all shadow-neo"
          >
            <PhoneOff size={32} />
          </button>
        </div>
        
        <p className="mt-8 text-xs text-gray-400 uppercase font-bold tracking-widest">
          Open Concept Talent Network AI
        </p>
      </div>
    </div>
  );
};

export default LiveSession;