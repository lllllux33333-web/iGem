import React, { useState, useEffect } from 'react';
import { Home, Sparkles, ShoppingBag, User, ChevronLeft } from 'lucide-react';
import HomeScreen from './screens/HomeScreen';
import QuizScreen from './screens/QuizScreen';
import DesignScreen from './screens/DesignScreen';
import ARPreviewScreen from './screens/ARPreviewScreen';
import CheckoutScreen from './screens/CheckoutScreen';
import TrackingScreen from './screens/TrackingScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';

export type Screen = 'home' | 'quiz' | 'design' | 'ar' | 'checkout' | 'tracking' | 'cart' | 'profile';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [aestheticDNA, setAestheticDNA] = useState<any>(null);
  const [generatedModel, setGeneratedModel] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>(() => {
    const saved = localStorage.getItem('jewelry_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('jewelry_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (model: any) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.image === model.image);
      if (exists) return prev.filter(f => f.image !== model.image);
      return [...prev, model];
    });
  };

  const navigate = (screen: Screen) => setCurrentScreen(screen);

  return (
    <div className="flex flex-col h-full bg-[#F5F2ED] text-[#2D2420] font-sans relative">
      {/* Header for screens other than home */}
      {currentScreen !== 'home' && (
        <div className="flex items-center p-4 bg-[#F5F2ED] z-10 sticky top-0">
          <button onClick={() => navigate('home')} className="p-2 -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-serif font-medium ml-2">
            {currentScreen === 'quiz' && 'AI Style Quiz'}
            {currentScreen === 'design' && 'AI Design Studio'}
            {currentScreen === 'ar' && 'AR Try-On'}
            {currentScreen === 'checkout' && 'Transparent Checkout'}
            {currentScreen === 'tracking' && 'Order Tracking'}
            {currentScreen === 'cart' && 'Shopping Cart'}
            {currentScreen === 'profile' && 'Profile'}
          </h1>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {currentScreen === 'home' && <HomeScreen onNavigate={navigate} />}
        {currentScreen === 'quiz' && <QuizScreen onComplete={(dna) => { setAestheticDNA(dna); navigate('design'); }} />}
        {currentScreen === 'design' && <DesignScreen aestheticDNA={aestheticDNA} onGenerate={(model: any) => setGeneratedModel(model)} onTryOn={() => navigate('ar')} favorites={favorites} toggleFavorite={toggleFavorite} />}
        {currentScreen === 'ar' && <ARPreviewScreen model={generatedModel} onCheckout={() => navigate('checkout')} onRegenerate={() => navigate('design')} />}
        {currentScreen === 'checkout' && <CheckoutScreen model={generatedModel} onPay={() => navigate('tracking')} />}
        {currentScreen === 'tracking' && <TrackingScreen />}
        {currentScreen === 'cart' && <CartScreen model={generatedModel} onCheckout={() => navigate('checkout')} />}
        {currentScreen === 'profile' && <ProfileScreen favorites={favorites} onSelectFavorite={(model) => { setGeneratedModel(model); navigate('design'); }} />}
      </div>

      {/* Bottom Navigation */}
      {['home', 'cart', 'profile'].includes(currentScreen) && (
        <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center p-3 pb-6 rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <NavItem icon={<Home size={24} />} label="Home" active={currentScreen === 'home'} onClick={() => navigate('home')} />
          <NavItem icon={<Sparkles size={24} />} label="AI Design" active={currentScreen === 'design' || currentScreen === 'quiz' || currentScreen === 'ar'} onClick={() => navigate('quiz')} />
          <NavItem icon={<ShoppingBag size={24} />} label="Cart" active={currentScreen === 'cart'} onClick={() => navigate('cart')} />
          <NavItem icon={<User size={24} />} label="Profile" active={currentScreen === 'profile'} onClick={() => navigate('profile')} />
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 ${active ? 'text-[#4A3B32]' : 'text-gray-400'}`}>
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </button>
  );
}
