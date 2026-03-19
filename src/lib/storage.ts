// safeLocalStorage.ts

const safeLocalStorage = {
  getProfile: () => {
    try {
      const profile = localStorage.getItem('profile');
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting profile from localStorage:', error);
      return null;
    }
  },

  setProfile: (profile) => {
    try {
      localStorage.setItem('profile', JSON.stringify(profile));
    } catch (error) {
      console.error('Error setting profile in localStorage:', error);
    }
  },

  isPremium: () => {
    try {
      const profile = safeLocalStorage.getProfile();
      return profile ? profile.isPremium : false;
    } catch (error) {
      console.error('Error checking premium status:', error);
      return false;
    }
  },

  setPremium: (premiumStatus) => {
    try {
      const profile = safeLocalStorage.getProfile();
      if (profile) {
        profile.isPremium = premiumStatus;
        safeLocalStorage.setProfile(profile);
      }
    } catch (error) {
      console.error('Error setting premium status:', error);
    }
  },

  clearStorage: () => {
    try {
      localStorage.removeItem('profile');
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
};

export default safeLocalStorage;
