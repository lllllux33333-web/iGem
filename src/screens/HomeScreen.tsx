import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function HomeScreen({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <div className="flex flex-col min-h-full bg-[#F5F2ED]">
      {/* Hero Section */}
      <div className="px-6 pt-12 pb-8">
        <h1 className="text-5xl font-serif font-medium leading-[0.9] tracking-tight mb-6 text-[#1A1A1A]">
          A Digital Soul<br/>for Every Jewel
        </h1>
        <p className="text-sm text-gray-600 mb-8 leading-relaxed max-w-[280px]">
          Where AI meets high-end craftsmanship. Discover a community-driven marketplace for you.
        </p>
        <button 
          onClick={() => onNavigate('quiz')}
          className="w-full bg-[#3A2E2A] text-white py-4 rounded-full font-medium flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform"
        >
          <Sparkles size={20} />
          Generate Design
        </button>
      </div>

      {/* Iconic Brands */}
      <div className="px-6 py-10">
        <h2 className="text-4xl font-serif font-medium mb-4 text-[#1A1A1A] tracking-tight">Iconic Brands</h2>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <p className="text-base text-gray-600">
            Discover niche artisan brands from around the world, curated by region.
          </p>
          <button 
            onClick={() => alert('Navigating to all brands...')}
            className="text-base font-medium text-[#1A1A1A] flex items-center hover:opacity-70 transition-opacity whitespace-nowrap"
          >
            View all brands <ArrowRight size={18} className="ml-1"/>
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6">
          <BrandCard 
            image="/images/brand-pearl .png" 
            title="Pearl Artisan Studio" 
            location="China - Guangzhou" 
            description="Traditional pearl craftsmanship"
            rating="4.9" 
          />
          <BrandCard 
            image="/images/brand-silver.jpeg" 
            title="Silver Miao Heritage" 
            location="China - Guizhou" 
            description="Ethnic silver jewelry art"
            rating="4.8" 
          />
          <BrandCard 
            image="/images/brand-lotus.jpeg" 
            title="Lotus Gem Collective" 
            location="Southeast Asia - Vietnam" 
            description="Handcrafted gemstone designs"
            rating="5" 
          />
        </div>
      </div>

      {/* Community */}
      <div className="px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-medium mb-4 text-[#1A1A1A] tracking-tight">Explore our community</h2>
          <p className="text-base text-gray-600">
            Discover talented designers and their unique creations.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <CommunityCard 
            image="/images/comm-resin.jpeg" 
            title="Resin Water Drop Necklace" 
            author="Kate Berry"
            authorAvatar="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100"
            price="¥1180" 
          />
          <CommunityCard 
            image="/images/comm-earring.png" 
            title="925 Sterling Silver Dainty Earring" 
            author="Annie Clark"
            authorAvatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100"
            price="¥1050" 
          />
          <CommunityCard 
            image="/images/comm-glass.jpeg" 
            title="Colorful Glass Rings - Suplais" 
            author="Karlie Kloss"
            authorAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
            price="¥1350" 
          />
          <CommunityCard 
            image="/images/comm-pearl.jpeg" 
            title="Natural Pearl • Delicate Ocean Jewelry" 
            author="Shaw Valley Studio"
            authorAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100"
            price="¥1499" 
          />
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => alert('Navigating to all creations...')}
            className="text-base font-medium text-[#1A1A1A] flex items-center hover:opacity-70 transition-opacity"
          >
            View all creations <ArrowRight size={18} className="ml-1"/>
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandCard({ image, title, location, description, rating }: any) {
  return (
    <div className="min-w-[280px] w-[280px] bg-[#FDFBF7] rounded-2xl p-4 shadow-sm border border-[#EAE3D9] flex flex-col">
      <img 
        src={image} 
        alt={title} 
        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x300/EAE3D9/1A1A1A?text=Upload+Image\n${encodeURIComponent(title)}` }}
        className="w-full h-48 object-cover rounded-xl mb-5" 
      />
      <div className="inline-block px-3 py-1.5 border border-gray-200 rounded-full text-[11px] font-medium text-[#1A1A1A] mb-4 self-start">
        {location}
      </div>
      <h3 className="font-serif font-medium text-xl mb-2 text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-gray-500 mb-5 flex-1">{description}</p>
      <div className="text-base text-[#1A1A1A] flex items-center gap-1.5 font-medium">
        <span>★</span> {rating}
      </div>
    </div>
  );
}

function CommunityCard({ image, title, author, authorAvatar, price }: any) {
  return (
    <div className="bg-[#FDFBF7] rounded-2xl overflow-hidden shadow-sm border border-[#EAE3D9] flex flex-col">
      <img 
        src={image} 
        alt={title} 
        onError={(e) => { e.currentTarget.src = `https://placehold.co/400x400/EAE3D9/1A1A1A?text=Upload+Image` }}
        className="w-full h-40 sm:h-56 object-cover" 
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-sm sm:text-base mb-3 text-[#1A1A1A] line-clamp-2 leading-snug flex-1">{title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <img 
            src={authorAvatar} 
            alt={author} 
            onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/CCCCCC/FFFFFF?text=${author.charAt(0)}` }}
            className="w-6 h-6 rounded-full object-cover" 
          />
          <span className="text-xs sm:text-sm text-gray-500 truncate">{author}</span>
        </div>
        <div className="font-medium text-lg text-[#1A1A1A]">{price}</div>
      </div>
    </div>
  );
}
