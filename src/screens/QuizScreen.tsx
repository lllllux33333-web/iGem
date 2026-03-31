import React, { useState } from 'react';
import { motion } from 'motion/react';

const questions = [
  {
    title: "What's your everyday aesthetic?",
    options: ["Minimalist & Clean", "Vintage & Romantic", "Bold & Avant-Garde", "Nature-Inspired"]
  },
  {
    title: "Choose a material that speaks to you",
    options: ["18K Gold", "Sterling Silver", "Rose Gold", "Platinum"]
  },
  {
    title: "What emotion do you want your jewelry to convey?",
    options: ["Confidence", "Serenity", "Passion", "Mystery"]
  }
];

export default function QuizScreen({ onComplete }: { onComplete: (dna: any) => void }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const handleSelect = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Generate DNA
      setTimeout(() => {
        onComplete({ style: newAnswers[0], material: newAnswers[1], emotion: newAnswers[2] });
      }, 1000);
    }
  };

  if (step >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="w-24 h-24 bg-[#3A2E2A] rounded-full flex items-center justify-center mb-6"
        >
          <span className="text-white text-3xl">✨</span>
        </motion.div>
        <h2 className="text-2xl font-serif mb-2">Analyzing your Aesthetic DNA...</h2>
        <p className="text-gray-500">Extracting your unique style profile</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-8">
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-[#3A2E2A]' : 'bg-gray-200'}`} />
        ))}
      </div>
      
      <motion.div
        key={step}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="mb-8"
      >
        <h2 className="text-2xl font-serif mb-6">{questions[step].title}</h2>
        <div className="flex flex-col gap-3">
          {questions[step].options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              className="p-4 rounded-2xl border border-gray-200 bg-white text-left font-medium hover:border-[#3A2E2A] hover:bg-[#FDFBF7] transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
