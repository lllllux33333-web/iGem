import React from 'react';
import { User, CreditCard, Shield, LogOut, ChevronRight, Heart } from 'lucide-react';

export default function ProfileScreen({ favorites, onSelectFavorite }: any) {
  return (
    <div className="px-6 py-4 flex flex-col h-full">
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8">
        <img 
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" 
          alt="User Avatar" 
          className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
        />
        <div>
          <h3 className="font-serif font-medium text-xl text-[#1A1A1A]">Kate Berry</h3>
          <p className="text-sm text-gray-500">kate.berry@example.com</p>
        </div>
      </div>

      {/* Saved Designs */}
      {favorites && favorites.length > 0 && (
        <div className="mb-8">
          <h3 className="font-serif text-lg mb-4 text-[#1A1A1A] flex items-center gap-2">
            <Heart size={18} className="text-red-500 fill-red-500" /> Saved Designs
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {favorites.map((fav: any, idx: number) => (
              <div 
                key={idx} 
                onClick={() => onSelectFavorite(fav)}
                className="min-w-[120px] bg-white rounded-2xl p-2 shadow-sm border border-gray-100 snap-start cursor-pointer active:scale-95 transition-transform"
              >
                <img src={fav.image} alt={fav.name} className="w-full h-24 object-cover rounded-xl mb-2" />
                <p className="text-xs font-medium text-center truncate px-1">{fav.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="space-y-3 mb-auto">
        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
              <User size={18} />
            </div>
            <span className="font-medium text-sm text-[#1A1A1A]">Personal Information</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600">
              <CreditCard size={18} />
            </div>
            <span className="font-medium text-sm text-[#1A1A1A]">Payment Methods</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>

        <button className="w-full bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-gray-100 active:scale-95 transition-transform">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600">
              <Shield size={18} />
            </div>
            <span className="font-medium text-sm text-[#1A1A1A]">Security & Privacy</span>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Actions */}
      <div className="mt-8 space-y-3 mb-6">
        <button className="w-full py-4 rounded-full border border-[#3A2E2A] text-[#3A2E2A] font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
          Register New Account
        </button>
        <button className="w-full py-4 rounded-full bg-red-50 text-red-600 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
}
