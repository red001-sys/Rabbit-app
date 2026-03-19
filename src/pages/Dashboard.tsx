import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Camera, Sparkles, ChevronRight, Trash2 } from 'lucide-react';
import CircleProgress from '@/components/CircleProgress';
import FoodEntryDialog from '@/components/FoodEntryDialog';
import FoodDetailSheet from '@/components/FoodDetailSheet';
import SettingsDialog from '@/components/SettingsDialog';
import AdDialog from '@/components/AdDialog';
import { SteakIcon, OilDropIcon, SugarCubesIcon } from '@/components/MacroIcons';
import {
  getProfile,
  getTodayTotals,
  getTodayEntries,
  deleteEntry
} from '@/lib/storage';
import { calculateDailyMacroGoals } from '@/lib/calories';
import { useNavigate } from 'react-router-dom';
import { MASCOT_LOGO } from '@/lib/mascot';
import { useLanguage } from '@/contexts/LanguageContext';
import { registerFoodAdded } from '@/lib/adController';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [, setRefresh] = useState(0);
  const refresh = useCallback(() => setRefresh(r => r + 1), []);

  const [showFoodEntry, setShowFoodEntry] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAd, setShowAd] = useState(false);

  const [entryMode, setEntryMode] = useState<'text' | 'photo'>('text');

  // 🔐 SAFE PROFILE
  const profile = useMemo(() => getProfile(), []);

  if (!profile) {
    return null; // ou loader
  }

  const totals = getTodayTotals();
  const goals = calculateDailyMacroGoals(profile.dailyCalorieGoal);
  const todayEntries = getTodayEntries();

  const remaining = profile.dailyCalorieGoal - totals.calories;

  const percentage =
    profile.dailyCalorieGoal > 0
      ? Math.min(
          Math.round((totals.calories / profile.dailyCalorieGoal) * 100),
          100
        )
      : 0;

  // 🎯 MONETIZAÇÃO CONTROLADA
  const handleFoodAdded = useCallback(() => {
    registerFoodAdded();
    refresh();
  }, [refresh]);

  return (
    <div className="min-h-[100dvh] bg-background pb-20">

      {/* HEADER */}
      <div className="hero-header px-5 pt-8 pb-28 relative overflow-hidden">
        <div className="relative z-10">

          <div className="flex items-center justify-between mb-8">

            <div className="flex items-center gap-3">
              <img src={MASCOT_LOGO} className="w-10 h-10 rounded-xl" />

              <div>
                <p className="text-xs text-white/70 font-semibold">
                  {t('dash_hello')}
                </p>

                <h1 className="text-lg font-extrabold text-white">
                  {profile.name || 'User'}
                </h1>
              </div>
            </div>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2.5 rounded-2xl bg-white/15"
            >
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-white/70 font-semibold">
              {t('dash_todayCalories')}
            </p>

            <p className="text-5xl font-extrabold text-white mt-1">
              {totals.calories}
            </p>

            <p className="text-sm text-white/70 font-semibold mt-1">
              {t('dash_of', { goal: profile.dailyCalorieGoal })}
            </p>
          </div>
        </div>
      </div>

      {/* PROGRESS */}
      <div className="px-5 -mt-16">
        <div className="bg-card rounded-[1.75rem] p-8">
          <div className="flex justify-center">
            <CircleProgress
              value={percentage}
              max={100}
              size={180}
              strokeWidth={14}
              displayText={`${percentage}%`}
              unit={t('dash_ofGoal')}
            />
          </div>

          <p className="text-center mt-3">
            {remaining <= 0
              ? t('dash_goalReached')
              : t('dash_remaining', { remaining })}
          </p>
        </div>
      </div>

      {/* ADD BUTTONS */}
      <div className="px-5 mt-4 flex gap-3">

        <button
          onClick={() => {
            setEntryMode('text');
            setShowFoodEntry(true);
          }}
          className="flex-1 p-4 bg-card rounded-xl"
        >
          {t('dash_addText')}
        </button>

        <button
          onClick={() => {
            setEntryMode('photo');
            setShowFoodEntry(true);
          }}
          className="flex-1 p-4 bg-card rounded-xl"
        >
          {t('dash_addPhoto')}
        </button>

      </div>

      {/* LIST */}
      <div className="px-5 mt-5">

        {todayEntries.length === 0 ? (
          <div className="bg-card p-8 text-center">
            <p className="text-3xl">🥗</p>
            <p>{t('dash_noFood')}</p>
          </div>
        ) : (
          todayEntries.map(entry => (
            <div key={entry.id} className="flex justify-between p-3">
              <span>{entry.name}</span>

              <button
                onClick={() => {
                  deleteEntry(entry.id);
                  refresh();
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <FoodEntryDialog
        open={showFoodEntry}
        onClose={() => setShowFoodEntry(false)}
        onAdded={handleFoodAdded} // 🔥 AQUI
        dailyGoal={profile.dailyCalorieGoal}
      />

      <AdDialog
        open={showAd}
        onClose={() => setShowAd(false)}
        onPremium={() => navigate('/premium')}
      />
    </div>
  );
};

export default Dashboard;