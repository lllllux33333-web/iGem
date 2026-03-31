import React, { useState, Suspense } from 'react';
import { Wand2, Image as ImageIcon, Box, ChevronLeft, Heart } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture } from '@react-three/drei';
import * as THREE from 'three';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

function RingModel({ textureUrl }: { textureUrl: string }) {
  const texture = useTexture(textureUrl);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);

  return (
    <mesh>
      <torusGeometry args={[1.5, 0.4, 32, 100]} />
      <meshStandardMaterial 
        map={texture} 
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
}

export default function DesignScreen({ aestheticDNA, onGenerate, onTryOn, favorites, toggleFavorite }: any) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const [sketchImage, setSketchImage] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [is3DView, setIs3DView] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSketchImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectTemplate = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    setShowTemplates(false);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    try {
      setIsGenerating(true);
      
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }

      // Create a new GoogleGenAI instance right before making an API call
      // to ensure it always uses the most up-to-date API key.
      const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) || 
                     (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || 
                     (import.meta as any).env?.VITE_GEMINI_API_KEY || 
                     (import.meta as any).env?.VITE_API_KEY || 
                     '';
        
      if (!apiKey) {
        if (window.aistudio) {
          await window.aistudio.openSelectKey();
          alert("Please select your API key and try generating again.");
          setIsGenerating(false);
          return;
        } else {
          throw new Error("API Key not found. Please configure your Gemini API key.");
        }
      }

      const ai = new GoogleGenAI({ apiKey });

      const parts: any[] = [
        { text: `A highly detailed, photorealistic 3D render of a jewelry piece. Design description: ${prompt}. Studio lighting, premium quality, white background.` }
      ];

      if (sketchImage) {
        const mimeType = sketchImage.split(';')[0].split(':')[1];
        const base64Data = sketchImage.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      let imageUrl = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        setGeneratedImageUrl(imageUrl);
        setModelReady(true);
        onGenerate({ name: "Custom AI Piece", description: prompt, image: imageUrl });
      } else {
        throw new Error("No image generated");
      }

    } catch (error: any) {
      console.error("Generation error:", error);
      const errorMessage = error.message || "";
      if (errorMessage.includes("Requested entity was not found") || 
          errorMessage.includes("permission") || 
          errorMessage.includes("403")) {
        if (window.aistudio) {
          alert("API key error or permission denied. Please re-select your API key.");
          await window.aistudio.openSelectKey();
        }
      } else {
        alert("Failed to generate design. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const isFavorite = generatedImageUrl && favorites?.some((f: any) => f.image === generatedImageUrl);

  return (
    <div className="px-6 py-4 flex flex-col h-full relative">
      {showTemplates && (
        <div className="absolute inset-0 z-50 bg-[#F5F2ED] flex flex-col">
          <div className="flex items-center p-4 bg-white border-b border-gray-200 sticky top-0">
            <button onClick={() => setShowTemplates(false)} className="p-2 -ml-2">
              <ChevronLeft size={24} />
            </button>
            <h2 className="text-lg font-serif font-medium ml-2">Template Library</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-20">
            <div>
              <h3 className="font-serif text-lg mb-4 text-[#1A1A1A]">Rings</h3>
              <div className="grid grid-cols-2 gap-4">
                <TemplateCard icon="💍" title="Classic Solitaire" prompt="A classic solitaire diamond ring with a smooth platinum band" onClick={selectTemplate} />
                <TemplateCard icon="👑" title="Vintage Halo" prompt="A vintage-inspired halo ring with a cushion-cut sapphire and intricate milgrain detailing" onClick={selectTemplate} />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-4 text-[#1A1A1A]">Necklaces</h3>
              <div className="grid grid-cols-2 gap-4">
                <TemplateCard icon="📿" title="Pearl Pendant" prompt="A delicate 18K gold chain necklace featuring a single, perfectly round South Sea pearl" onClick={selectTemplate} />
                <TemplateCard icon="✨" title="Diamond Tennis" prompt="A luxurious diamond tennis necklace with brilliant-cut diamonds set in white gold" onClick={selectTemplate} />
              </div>
            </div>
            <div>
              <h3 className="font-serif text-lg mb-4 text-[#1A1A1A]">Earrings</h3>
              <div className="grid grid-cols-2 gap-4">
                <TemplateCard icon="✨" title="Gold Hoops" prompt="Thick, minimalist 18K yellow gold hoop earrings with a high-polish finish" onClick={selectTemplate} />
                <TemplateCard icon="💎" title="Emerald Studs" prompt="Elegant emerald-cut emerald stud earrings surrounded by a halo of tiny diamonds" onClick={selectTemplate} />
              </div>
            </div>
          </div>
        </div>
      )}

      {aestheticDNA && !modelReady && (
        <div className="bg-white p-4 rounded-2xl mb-6 shadow-sm border border-gray-100">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Aesthetic DNA</h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(aestheticDNA).map((val: any, i) => (
              <span key={i} className="px-3 py-1 bg-[#F5F2ED] rounded-full text-xs font-medium">{val}</span>
            ))}
          </div>
        </div>
      )}

      {!modelReady ? (
        <div className="flex-1 flex flex-col">
          <h2 className="text-2xl font-serif mb-4">Describe your dream jewelry</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., A minimalist ring with a rough-cut sapphire, inspired by ocean waves..."
            className="w-full h-32 p-4 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:border-[#3A2E2A] resize-none mb-4"
          />
          
          <div className="flex gap-4 mb-auto">
            <input type="file" accept="image/*" id="sketch-upload" className="hidden" onChange={handleFileUpload} />
            <label 
              htmlFor="sketch-upload" 
              className="flex-1 py-3 rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center gap-1 text-sm font-medium cursor-pointer relative overflow-hidden"
            >
              {sketchImage ? (
                <>
                  <img src={sketchImage} alt="Sketch" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                  <span className="relative z-10 text-[#3A2E2A] flex items-center gap-1"><ImageIcon size={16} /> Sketch Added</span>
                </>
              ) : (
                <>
                  <ImageIcon size={16} className="text-gray-500" /> 
                  <span className="text-gray-600">Upload Sketch</span>
                </>
              )}
            </label>
            <button 
              onClick={() => setShowTemplates(true)}
              className="flex-1 py-3 rounded-xl border border-gray-200 bg-white flex flex-col items-center justify-center gap-1 text-sm font-medium text-gray-600"
            >
              <Box size={16} /> Select Template
            </button>
          </div>

          <button
            onClick={handleGenerate}
            disabled={!prompt || isGenerating}
            className="w-full bg-[#3A2E2A] text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
          >
            {isGenerating ? (
              <span className="animate-pulse">Generating 3D Model...</span>
            ) : (
              <>
                <Wand2 size={20} /> Generate Design
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white rounded-3xl mb-6 flex items-center justify-center relative overflow-hidden shadow-inner border border-gray-100">
            {is3DView && generatedImageUrl ? (
              <div className="absolute inset-0 w-full h-full">
                <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
                  <Suspense fallback={null}>
                    <RingModel textureUrl={generatedImageUrl} />
                    <Environment preset="city" />
                  </Suspense>
                  <OrbitControls autoRotate enableZoom={true} />
                </Canvas>
              </div>
            ) : (
              <img 
                src={generatedImageUrl || "https://images.unsplash.com/photo-1605100804763-247f66156ce4?auto=format&fit=crop&q=80&w=600"} 
                alt="Generated 3D Model" 
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white pointer-events-none">
              <h3 className="font-serif text-lg">AI Generated Concept</h3>
              <p className="text-xs opacity-80">PBR High-Fidelity Rendering</p>
            </div>
            <button 
              onClick={() => setIs3DView(!is3DView)}
              className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white border border-white/30 z-10 hover:bg-white/30 transition-colors"
            >
              {is3DView ? "2D View" : "360° View"}
            </button>
            <button 
              onClick={() => toggleFavorite({ name: "Custom AI Piece", description: prompt, image: generatedImageUrl })}
              className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white border border-white/30 z-10 hover:bg-white/30 transition-colors"
            >
              <Heart size={18} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>

          <div className="flex gap-3 mb-6">
            <button onClick={() => setModelReady(false)} className="flex-1 py-4 rounded-full border border-[#3A2E2A] text-[#3A2E2A] font-medium">
              Edit Design
            </button>
            <button onClick={onTryOn} className="flex-1 py-4 rounded-full bg-[#3A2E2A] text-white font-medium flex items-center justify-center gap-2">
              <Box size={18} /> AR Try-On
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({ icon, title, prompt, onClick }: any) {
  return (
    <button 
      onClick={() => onClick(prompt)}
      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center active:scale-95 transition-transform"
    >
      <div className="text-3xl mb-2">{icon}</div>
      <div className="text-sm font-medium text-[#1A1A1A] mt-2">{title}</div>
    </button>
  );
}
