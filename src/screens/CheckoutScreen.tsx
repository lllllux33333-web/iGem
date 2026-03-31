import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export default function CheckoutScreen({ model, onPay }: { model?: any, onPay: () => void }) {
  return (
    <div className="px-6 py-4 flex flex-col h-full">
      <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
          <img 
            src={model?.image || "https://images.unsplash.com/photo-1605100804763-247f66156ce4?auto=format&fit=crop&q=80&w=200"} 
            alt="Item" 
            className="w-20 h-20 object-cover rounded-xl"
          />
          <div>
            <h3 className="font-serif font-medium text-lg">{model?.name || "Custom AI Ring"}</h3>
            <p className="text-xs text-gray-500">18K Gold • Sapphire</p>
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-medium">
              <ShieldCheck size={12} /> Blockchain DPP Ready
            </div>
          </div>
        </div>

        <h4 className="font-medium mb-4 flex items-center justify-between">
          Transparent Pricing <Info size={14} className="text-gray-400" />
        </h4>
        
        <div className="space-y-3 text-sm mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Factory Cost (Shuibei)</span>
            <span>¥850.00</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>AI Design Fee</span>
            <span>¥99.00</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Platform Fee (10%)</span>
            <span>¥95.00</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>NGTC Certification</span>
            <span>¥150.00</span>
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between font-serif font-medium text-lg">
            <span>Total</span>
            <span>¥1194.00</span>
          </div>
        </div>
      </div>

      <div className="bg-[#FDFBF7] rounded-2xl p-4 mb-auto border border-[#EAE3D9]">
        <h4 className="font-medium text-sm mb-2">Secure Fulfillment</h4>
        <p className="text-xs text-gray-600 leading-relaxed">
          Funds are locked in escrow. Production cycle is 7-15 days. You will receive a digital traceability certificate upon completion.
        </p>
      </div>

      <button 
        onClick={onPay}
        className="w-full bg-[#3A2E2A] text-white py-4 rounded-full font-medium shadow-lg mt-6"
      >
        Pay ¥1194.00
      </button>
    </div>
  );
}
