import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Camera, Loader2, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { saveEntry } from '@/lib/storage';
import { FoodEntry, NutrientInfo } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

interface FoodEntryDialogProps {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
  dailyGoal: number;
}

interface AIFood {
  name: string;
  quantity: string;
  nutrients: NutrientInfo;
  isEstimate?: boolean;
}

interface AIResponse {
  foods?: AIFood[];
  error?: string | null;
}

const FoodEntryDialog = ({ open, onClose, onAdded }: FoodEntryDialogProps) => {
  const { t, language } = useLanguage();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResponse | null>(null);
  const [error, setError] = useState('');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (base64: string) => {
    return base64.length > 500000 ? base64.slice(0, 500000) : base64;
  };

  const analyzeFood = async (text?: string, photo?: string) => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-food', {
        body: {
          text,
          imageBase64: photo,
          language,
        },
      });

      if (fnError || data?.error) {
        setError(t('food_analyzeError'));
        return;
      }

      setResult(data);
    } catch {
      setError(t('food_connectionError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (imageBase64) return analyzeFood(undefined, imageBase64);
    if (input.trim()) return analyzeFood(input.trim());
  };

  const handleAddFood = (food: AIFood) => {
    try {
      if (!food || !food.name || !food.nutrients) return;

      const entry: FoodEntry = {
        id: Date.now().toString(),
        name: String(food.name).slice(0, 100),
        quantity: food.quantity || '',
        nutrients: {
          calories: Number(food.nutrients.calories) || 0,
          protein: Number(food.nutrients.protein) || 0,
          carbs: Number(food.nutrients.carbs) || 0,
          sugar: Number(food.nutrients.sugar) || 0,
          fat: Number(food.nutrients.fat) || 0,
          sodium: Number(food.nutrients.sodium) || 0,
          fiber: Number(food.nutrients.fiber) || 0,
        },
        timestamp: Date.now(),
        date: new Date().toISOString().split('T')[0],
      };

      saveEntry(entry);

      setInput('');
      setResult(null);
      setImageBase64(null);

      onAdded();
      onClose();
    } catch (err) {
      console.error('Erro ao salvar alimento', err);
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('food_invalidImage'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setImageBase64(compressImage(base64));
    };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 bg-black/40 flex items-end" onClick={onClose}>
        <motion.div
          className="bg-card w-full p-5 rounded-t-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="font-bold mb-3">{t('food_addFood')}</h2>

          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('food_placeholder')}
          />

          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
            {t('food_analyze')}
          </Button>

          <input type="file" ref={fileInputRef} onChange={handlePhoto} hidden />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          {result?.foods?.map((food, i) => (
            <div key={i} className="mt-3 p-3 bg-accent rounded">
              <p className="font-bold">{food.name}</p>
              <Button onClick={() => handleAddFood(food)}>
                <Check /> {t('food_add')}
              </Button>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FoodEntryDialog;