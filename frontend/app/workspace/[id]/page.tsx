"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronRight, 
  Box, 
  Volume2, 
  Layers, 
  Maximize2,
  PlayCircle
} from 'lucide-react';
import AssemblyScene from '@/components/AssemblyScene';

// Mock Data (Same structure as before)
const MANUAL_DATA = {
  productName: "SANDSBERG Table",
  steps: [
    { stepNumber: 1, title: "Prepare Workspace", description: "Place the table frame upside down on a soft surface to prevent scratching.", voiceGuidance: "Start by placing the table top upside down on a rug or carpet.", pdfPage: 1 },
    { stepNumber: 2, title: "Insert Brackets", description: "Push the plastic corner brackets into the metal frame slots until they click.", voiceGuidance: "Take the four plastic corner brackets and push them into the frame.", pdfPage: 2 },
    { stepNumber: 3, title: "Secure Frame", description: "Align the frame holes with the table top. Use the Allen key to tighten the medium screws.", voiceGuidance: "Use the provided Allen key to secure the frame with ten screws.", pdfPage: 3 },
    { stepNumber: 4, title: "Attach Legs", description: "Screw the four cylindrical legs into the corner brackets by hand, then tighten.", voiceGuidance: "Finally, screw the legs into the brackets. Hand tighten them first.", pdfPage: 4 },
  ]
};

export default function Workspace() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const totalSteps = MANUAL_DATA.steps.length;
  const activeStepData = MANUAL_DATA.steps[currentStep - 1];

  // Simulate Voice Playing
  useEffect(() => {
    setIsPlaying(true);
    const timer = setTimeout(() => setIsPlaying(false), 3000);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="h-screen w-full flex flex-col bg-zinc-50 font-sans text-zinc-900 overflow-hidden">
      
      {/* 1. HEADER: Professional Breadcrumb Style */}
      <header className="h-14 bg-white border-b border-zinc-200 flex items-center justify-between px-4 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-zinc-100 rounded-lg transition-colors text-zinc-500 hover:text-zinc-900">
            <Box className="w-5 h-5" />
          </Link>
          
          <div className="h-4 w-[1px] bg-zinc-300 mx-1" />
          
          <nav className="flex items-center gap-2 text-sm">
            <span className="text-zinc-500 font-medium hover:text-zinc-800 cursor-pointer transition-colors">Dashboard</span>
            <ChevronRight className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-zinc-900">{MANUAL_DATA.productName}</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
           <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Auto-Save On</span>
           <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
             JD
           </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-row overflow-hidden">
        
        {/* LEFT PANEL: Instructions & Context (35% width) */}
        <div className="w-[400px] bg-white border-r border-zinc-200 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-10 relative">
          
          {/* Step Indicator */}
          <div className="px-6 py-6 border-b border-zinc-100">
             <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Step {currentStep} of {totalSteps}</span>
                <span className="text-xs text-zinc-400">PDF Page {activeStepData.pdfPage}</span>
             </div>
             <h2 className="text-2xl font-bold text-zinc-900 leading-tight">{activeStepData.title}</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Main Instruction Text */}
            <div>
               <p className="text-lg text-zinc-600 leading-relaxed">
                 {activeStepData.description}
               </p>
            </div>

            {/* Voice Assistant Card */}
            <div className={`rounded-xl border transition-all duration-500 ${isPlaying ? 'border-indigo-200 bg-indigo-50/50' : 'border-zinc-200 bg-zinc-50'}`}>
              <div className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-full ${isPlaying ? 'bg-indigo-100 text-indigo-600' : 'bg-zinc-200 text-zinc-500'}`}>
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </div>
                  <span className={`text-xs font-semibold uppercase tracking-wider ${isPlaying ? 'text-indigo-600' : 'text-zinc-500'}`}>
                    {isPlaying ? 'Speaking...' : 'Voice Guide'}
                  </span>
                </div>
                <p className="text-sm text-zinc-600 italic">"{activeStepData.voiceGuidance}"</p>
              </div>
              {isPlaying && (
                 <div className="h-1 w-full bg-indigo-100 overflow-hidden rounded-b-xl">
                    <div className="h-full bg-indigo-500 animate-progress origin-left w-full"></div>
                 </div>
              )}
            </div>

            {/* Mock PDF Viewer */}
            <div className="space-y-2">
               <div className="flex items-center gap-2 text-sm font-medium text-zinc-900">
                  <Layers className="w-4 h-4 text-zinc-400" />
                  <span>Reference Diagram</span>
               </div>
               <div className="aspect-[4/3] bg-zinc-100 rounded-lg border border-zinc-200 flex flex-col items-center justify-center text-zinc-400 hover:border-indigo-300 transition-colors cursor-pointer group relative overflow-hidden">
                  {/* In a real app, <img src="..." /> goes here */}
                  <Box className="w-12 h-12 mb-2 group-hover:scale-110 transition-transform duration-300" strokeWidth={1} />
                  <span className="text-xs">Click to expand PDF</span>
                  <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
            </div>

          </div>
        </div>

        {/* RIGHT PANEL: 3D Scene (Flexible width) */}
        <div className="flex-1 bg-zinc-100 relative">
          
          {/* The 3D Canvas */}
          <div className="absolute inset-0">
            <AssemblyScene currentStep={currentStep} />
          </div>

          {/* 3. FLOATING CONTROLS (The "Modern" Touch) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/90 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/20 ring-1 ring-black/5">
             
             <button 
               onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
               disabled={currentStep === 1}
               className="p-3 rounded-xl hover:bg-zinc-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all text-zinc-700"
             >
               <ArrowLeft className="w-6 h-6" />
             </button>

             <div className="h-8 w-[1px] bg-zinc-200 mx-2"></div>

             <div className="flex flex-col items-center px-2">
               <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Step</span>
               <span className="text-xl font-bold text-zinc-900 tabular-nums leading-none">{currentStep}</span>
             </div>

             <div className="h-8 w-[1px] bg-zinc-200 mx-2"></div>

             <button 
               onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
               disabled={currentStep === totalSteps}
               className="group p-3 rounded-xl bg-zinc-900 text-white hover:bg-indigo-600 disabled:opacity-30 disabled:hover:bg-zinc-900 transition-all shadow-lg shadow-zinc-900/20"
             >
               <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          {/* Top Right Tools */}
          <div className="absolute top-6 right-6 flex gap-2">
             <button className="p-2 bg-white rounded-lg shadow-sm border border-zinc-200 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 transition-all">
               <Maximize2 className="w-5 h-5" />
             </button>
             <button 
               onClick={() => setIsPlaying(true)}
               className="p-2 bg-white rounded-lg shadow-sm border border-zinc-200 text-zinc-500 hover:text-indigo-600 hover:border-indigo-200 transition-all"
             >
               <PlayCircle className="w-5 h-5" />
             </button>
          </div>

        </div>
      </div>

      {/* Animation CSS (Add this to globals.css if not using Tailwind config) */}
      <style jsx global>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
}