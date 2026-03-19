// AdMob mock functions 

// Initializes AdMob and checks for the Capacitor platform 
export const initAdMob = () => { 
    if (Capacitor.isNativePlatform()) { 
        // Actual initialization code would go here
        console.log('AdMob initialized'); 
    } else { 
        console.error('initAdMob: not running on a native platform.');
    }
};

// Shows a rewarded ad 
export const showRewardedAd = () => { 
    if (Capacitor.isNativePlatform()) { 
        // Actual code to show rewarded ad would go here 
        console.log('Showing rewarded ad'); 
    } else { 
        console.error('showRewardedAd: not running on a native platform.');
    }
};

// Shows a banner ad 
export const showBanner = () => { 
    if (Capacitor.isNativePlatform()) { 
        // Actual code to show banner ad would go here 
        console.log('Showing banner ad'); 
    } else { 
        console.error('showBanner: not running on a native platform.');
    }
};

// Shows an interstitial ad 
export const showInterstitial = () => { 
    if (Capacitor.isNativePlatform()) { 
        // Actual code to show interstitial ad would go here 
        console.log('Showing interstitial ad'); 
    } else { 
        console.error('showInterstitial: not running on a native platform.');
    }
};
