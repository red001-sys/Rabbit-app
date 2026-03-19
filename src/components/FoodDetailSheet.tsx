import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import { calculateDailyMacroGoals } from '@/lib/calories';
import {
  getTodayTotals,
  isPremium,
  unlockMacros,
  macrosUnlocked,
} from '@/lib/storage';
import { showRewardedAd } from '@/lib/admob';
import { useLanguage } from '@/contexts/LanguageContext';

const FoodDetailSheet = ({ open, onClose, dailyGoal }: any) => {
  const { t } = useLanguage();

  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);

  const totals = getTodayTotals();
  const goals = calculateDailyMacroGoals(dailyGoal);
  const premium = isPremium();

  useEffect(() => {
    setUnlocked(macrosUnlocked());
  }, [open]);

  const handleAd = async () => {
    try {
      setLoading(true);

      const ok = await showRewardedAd();

      if (ok) {
        unlockMacros();
        setUnlocked(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const showAdvanced = premium || unlocked;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/40 flex items-end" onClick={onClose}>
        <motion.div
          className="bg-card w-full p-5 rounded-t-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between mb-4">
            <h2>{t('detail_title')}</h2>
            <button onClick={onClose}><X /></button>
          </div>

          <p>{totals.calories} / {dailyGoal} kcal</p>

          {!showAdvanced && (
            <button
              onClick={handleAd}
              disabled={loading}
              className="mt-4 w-full p-3 bg-accent rounded"
            >
              <Play />
              {loading ? 'Carregando...' : '🔓 Desbloquear análise completa'}
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FoodDetailSheet;
