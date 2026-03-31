import React from 'react';
import { Clock, Package, ChevronRight } from 'lucide-react';

export default function CartScreen({ model, onCheckout }: { model?: any, onCheckout: () => void }) {
  return (
    <div className="px-6 py-4 flex flex-col h-full">
      {/* Current Cart Items */}
      <h3 className="text-lg font-serif mb-4 text-[#1A1A1A]">Your Cart</h3>
      <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm border border-gray-100">
        <div className="flex gap-4">
          <img 
            src={model?.image || "https://images.unsplash.com/photo-1605100804763-247f66156ce4?auto=format&fit=crop&q=80&w=200"} 
            alt="Custom AI Ring" 
            className="w-20 h-20 object-cover rounded-xl"
          />
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="font-serif font-medium text-lg">{model?.name || "Custom AI Ring"}</h3>
            <p className="text-xs text-gray-500 mb-2">18K Gold • Sapphire</p>
            <div className="flex justify-between items-center">
              <span className="font-medium text-lg text-[#1A1A1A]">¥1194.00</span>
              <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                <Clock size={12} /> 7-15 Days
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onCheckout}
        className="w-full bg-[#3A2E2A] text-white py-4 rounded-full font-medium shadow-lg mb-10 active:scale-95 transition-transform"
      >
        Proceed to Checkout (¥1194.00)
      </button>

      {/* Past Orders */}
      <h3 className="text-lg font-serif mb-4 text-[#1A1A1A]">Past Orders</h3>
      <div className="space-y-4 mb-6">
        <div className="bg-[#FDFBF7] rounded-2xl p-4 border border-[#EAE3D9] flex items-center justify-between active:scale-95 transition-transform cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Package size={20} />
            </div>
            <div>
              <h4 className="font-medium text-sm text-[#1A1A1A]">Resin Water Drop Necklace</h4>
              <p className="text-xs text-gray-500">Delivered on Mar 12, 2026</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
        
        <div className="bg-[#FDFBF7] rounded-2xl p-4 border border-[#EAE3D9] flex items-center justify-between active:scale-95 transition-transform cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <Package size={20} />
            </div>
            <div>
              <h4 className="font-medium text-sm text-[#1A1A1A]">925 Silver Dainty Earring</h4>
              <p className="text-xs text-gray-500">Delivered on Jan 05, 2026</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
}
