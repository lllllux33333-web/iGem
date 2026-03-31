import React from 'react';
import { CheckCircle2, Circle, Link as LinkIcon, Share2 } from 'lucide-react';

export default function TrackingScreen() {
  const steps = [
    { title: "Order Placed & Funds Locked", date: "Today", completed: true },
    { title: "3D Printing & Casting", date: "Est. 3 days", completed: false },
    { title: "Polishing & Setting", date: "Est. 7 days", completed: false },
    { title: "NGTC Certification", date: "Est. 10 days", completed: false },
    { title: "Delivery", date: "Est. 12-15 days", completed: false },
  ];

  return (
    <div className="px-6 py-4">
      <div className="bg-gradient-to-br from-[#3A2E2A] to-[#2D2420] rounded-3xl p-6 text-white mb-8 shadow-xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-xs opacity-70 mb-1">Digital Product Passport</p>
            <h3 className="font-serif text-xl">Custom AI Ring</h3>
          </div>
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
            <LinkIcon size={20} />
          </div>
        </div>
        
        <div className="bg-black/20 rounded-xl p-3 text-xs font-mono break-all mb-4">
          TX: 0x8f3c...9a2b1
        </div>
        
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-white/10 rounded text-[10px]">Authenticity Verified</span>
          <span className="px-2 py-1 bg-white/10 rounded text-[10px]">Traceable</span>
        </div>
      </div>

      <h3 className="font-serif text-lg mb-6">Production Tracker</h3>
      
      <div className="relative pl-4 border-l-2 border-gray-100 space-y-8 mb-8">
        {steps.map((step, i) => (
          <div key={i} className="relative">
            <div className="absolute -left-[25px] top-0 bg-[#F5F2ED]">
              {step.completed ? (
                <CheckCircle2 size={20} className="text-green-600 bg-white rounded-full" />
              ) : (
                <Circle size={20} className="text-gray-300 bg-white rounded-full" />
              )}
            </div>
            <div>
              <h4 className={`text-sm font-medium ${step.completed ? 'text-[#2D2420]' : 'text-gray-500'}`}>
                {step.title}
              </h4>
              <p className="text-xs text-gray-400 mt-1">{step.date}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-4 rounded-full border border-[#3A2E2A] text-[#3A2E2A] font-medium flex items-center justify-center gap-2">
        <Share2 size={18} /> Share Story on Community
      </button>
    </div>
  );
}
