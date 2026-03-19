import { UserProfile, FoodEntry, NutrientInfo } from '@/types';

const KEYS = {
  PROFILE: 'calorie_app_profile',
  ENTRIES: 'calorie_app_entries',
  AD_COUNT: 'calorie_app_ad_count',
  PREMIUM: 'calorie_app_premium',
  MACROS_UNLOCK: 'macrosUnlock'
};

// =======================
// SAFE HELPERS
// =======================

function safeParse<T>(data: string | null, fallback: T): T {
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error('Erro ao fazer parse do storage:', err);
    return fallback;
  }
}

function safeSet(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Erro ao salvar no storage:', err);
  }
}

// =======================
// PROFILE
// =======================

export function getProfile(): UserProfile | null {
  return safeParse<UserProfile | null>(
    localStorage.getItem(KEYS.PROFILE),
    null
  );
}

export function saveProfile(profile: UserProfile) {
  safeSet(KEYS.PROFILE, profile);
}

// =======================
// ENTRIES
// =======================

export function getEntries(): FoodEntry[] {
  return safeParse<FoodEntry[]>(
    localStorage.getItem(KEYS.ENTRIES),
    []
  );
}

export function saveEntry(entry: FoodEntry) {
  try {
    if (!entry || !entry.id || !entry.date || !entry.nutrients) {
      console.warn('Entrada inválida ignorada:', entry);
      return;
    }

    const entries = getEntries();
    entries.push(entry);

    safeSet(KEYS.ENTRIES, entries);
  } catch (err) {
    console.error('Erro ao salvar entrada:', err);
  }
}

export function deleteEntry(id: string) {
  try {
    const entries = getEntries().filter(e => e.id !== id);
    safeSet(KEYS.ENTRIES, entries);
  } catch (err) {
    console.error('Erro ao deletar entrada:', err);
  }
}

// =======================
// FILTERS
// =======================

export function getTodayEntries(): FoodEntry[] {
  try {
    const today = new Date().toISOString().split('T')[0];

    return getEntries().filter(e => {
      if (!e.date) return false;
      return e.date === today;
    });
  } catch (err) {
    console.error('Erro ao buscar entradas de hoje:', err);
    return [];
  }
}

export function getEntriesForWeek(): FoodEntry[] {
  try {
    const now = Date.now();
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;

    return getEntries().filter(e => {
      const time = new Date(e.date).getTime();
      return !isNaN(time) && time >= weekAgo;
    });
  } catch (err) {
    console.error('Erro ao buscar semana:', err);
    return [];
  }
}

// =======================
// TOTALS
// =======================

export function getTodayTotals(): NutrientInfo {
  try {
    const entries = getTodayEntries();

    return entries.reduce(
      (acc, e) => ({
        calories: acc.calories + (e.nutrients?.calories || 0),
        protein: acc.protein + (e.nutrients?.protein || 0),
        carbs: acc.carbs + (e.nutrients?.carbs || 0),
        sugar: acc.sugar + (e.nutrients?.sugar || 0),
        fat: acc.fat + (e.nutrients?.fat || 0),
        sodium: acc.sodium + (e.nutrients?.sodium || 0),
        fiber: acc.fiber + (e.nutrients?.fiber || 0),
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        sugar: 0,
        fat: 0,
        sodium: 0,
        fiber: 0
      }
    );
  } catch (err) {
    console.error('Erro ao calcular totais:', err);

    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      sugar: 0,
      fat: 0,
      sodium: 0,
      fiber: 0
    };
  }
}

// =======================
// ADS (SEM ADMob AQUI)
// =======================

export function getAdCount(): number {
  const value = localStorage.getItem(KEYS.AD_COUNT);
  const parsed = Number(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function incrementAdCount(): number {
  const count = getAdCount() + 1;
  localStorage.setItem(KEYS.AD_COUNT, count.toString());
  return count;
}

export function resetAdCount() {
  localStorage.setItem(KEYS.AD_COUNT, '0');
}

// =======================
// PREMIUM
// =======================

export function isPremium(): boolean {
  return localStorage.getItem(KEYS.PREMIUM) === 'true';
}

export function setPremium(value: boolean) {
  localStorage.setItem(KEYS.PREMIUM, value.toString());
}

// =======================
// MACROS UNLOCK
// =======================

export const unlockMacros = () => {
  const unlockUntil = Date.now() + 60 * 60 * 1000;
  localStorage.setItem(KEYS.MACROS_UNLOCK, unlockUntil.toString());
};

export const macrosUnlocked = () => {
  const unlock = localStorage.getItem(KEYS.MACROS_UNLOCK);
  if (!unlock) return false;

  const value = Number(unlock);
  if (isNaN(value)) return false;

  return Date.now() < value;
};