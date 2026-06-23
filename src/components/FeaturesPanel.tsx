import { useState } from 'react';
import { 
  Bell, Star, Share2, 
  Settings, X, Check, Volume2, VolumeX,
  Smartphone, Globe, Trophy, Zap
} from 'lucide-react';

interface FeaturesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: {
    notifications: boolean;
    sound: boolean;
    darkMode: boolean;
    arabicNames: boolean;
  };
  onSettingsChange: (key: string, value: boolean) => void;
  favorites: string[];
  onToggleFavorite: (matchId: string) => void;
}

export default function FeaturesPanel({ 
  isOpen, onClose, settings, onSettingsChange, favorites 
}: FeaturesPanelProps) {
  const [activeTab, setActiveTab] = useState<'settings' | 'features'>('features');

  if (!isOpen) return null;

  const premiumFeatures = [
    { icon: <Zap className="w-5 h-5 text-yellow-400" />, title: 'تحديث لحظي', desc: 'نتائج كل 30 ثانية', active: true },
    { icon: <Trophy className="w-5 h-5 text-green-400" />, title: 'ترتيب المجموعات', desc: '12 مجموعة مباشرة', active: true },
    { icon: <Globe className="w-5 h-5 text-blue-400" />, title: 'تغطية شاملة', desc: '48 منتخب', active: true },
    { icon: <Bell className="w-5 h-5 text-red-400" />, title: 'إشعارات الأهداف', desc: 'تنبيه فوري', active: settings.notifications },
    { icon: <Star className="w-5 h-5 text-yellow-400" />, title: 'المباريات المفضلة', desc: `${favorites.length} مباراة محفوظة`, active: favorites.length > 0 },
    { icon: <Smartphone className="w-5 h-5 text-purple-400" />, title: 'تصميم متجاوب', desc: 'جوال وكمبيوتر', active: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      <div 
        className="relative bg-gradient-to-br from-[#1a1a3e] to-[#0d0d2e] rounded-2xl w-full max-w-md border border-white/10 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Settings className="w-5 h-5 text-green-400" />
            الإعدادات والمميزات
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('features')}
            className={`flex-1 py-3 text-sm font-bold cursor-pointer transition-colors ${activeTab === 'features' ? 'text-green-400 border-b-2 border-green-400' : 'text-white/50'}`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            ⭐ المميزات
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm font-bold cursor-pointer transition-colors ${activeTab === 'settings' ? 'text-green-400 border-b-2 border-green-400' : 'text-white/50'}`}
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            ⚙️ الإعدادات
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {activeTab === 'features' && (
            <div className="space-y-3">
              {premiumFeatures.map((feature, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                    feature.active 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feature.active ? 'bg-green-500/20' : 'bg-white/5'}`}>
                    {feature.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>{feature.title}</p>
                    <p className="text-white/50 text-xs">{feature.desc}</p>
                  </div>
                  {feature.active ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <span className="text-white/30 text-xs">غير مفعل</span>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* Notifications */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-white font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>إشعارات الأهداف</p>
                    <p className="text-white/50 text-xs">تنبيه عند تسجيل هدف</p>
                  </div>
                </div>
                <button
                  onClick={() => onSettingsChange('notifications', !settings.notifications)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.notifications ? 'bg-green-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Sound */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  {settings.sound ? <Volume2 className="w-5 h-5 text-blue-400" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
                  <div>
                    <p className="text-white font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>الصوت</p>
                    <p className="text-white/50 text-xs">صوت عند الإشعارات</p>
                  </div>
                </div>
                <button
                  onClick={() => onSettingsChange('sound', !settings.sound)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.sound ? 'bg-green-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.sound ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Arabic Names */}
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-white font-bold text-sm" style={{ fontFamily: 'Cairo, sans-serif' }}>أسماء عربية</p>
                    <p className="text-white/50 text-xs">عرض أسماء المنتخبات بالعربية</p>
                  </div>
                </div>
                <button
                  onClick={() => onSettingsChange('arabicNames', !settings.arabicNames)}
                  className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${settings.arabicNames ? 'bg-green-500' : 'bg-white/20'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.arabicNames ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {/* Share */}
              <button className="w-full flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl text-green-400 font-bold cursor-pointer hover:from-green-500/30 transition-all"
                style={{ fontFamily: 'Cairo, sans-serif' }}
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'العرباوية ماتش',
                      text: 'تابع مباريات كأس العالم 2026 مباشرة!',
                      url: window.location.href,
                    });
                  }
                }}
              >
                <Share2 className="w-4 h-4" />
                مشاركة الموقع
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <p className="text-center text-white/30 text-xs" style={{ fontFamily: 'Cairo, sans-serif' }}>
            العرباوية ماتش © 2026 | جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
