import { AdMob } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

const isTest = import.meta.env.DEV;

const adIds = {
  rewarded: {
    android: isTest ? "ca-app-pub-3940256099942544/5224354917" : "ca-app-pub-9088121551421320/8743324289",
AdMob.addListener('onRewardedVideoAdReward', (rewardItem) => {
    // Liberar a funcionalidade premium ou os macros aqui
});
    // TODO: Substituir o ID abaixo pelo ID REAL de produção do iOS antes de lançar na App Store
    ios: isTest ? "ca-app-pub-3940256099942544/1712485313" : "ca-app-pub-3940256099942544/1712485313",
  },
  interstitial: {
    android: isTest ? "ca-app-pub-3940256099942544/1033173712" : "ca-app-pub-9088121551421320/1581297367",
    // TODO: Substituir o ID abaixo pelo ID REAL de produção do iOS antes de lançar na App Store
    ios: isTest ? "ca-app-pub-3940256099942544/4411468910" : "ca-app-pub-3940256099942544/4411468910",
  }
};

function getAdId(type: 'rewarded' | 'interstitial'): string {
  const platform = Capacitor.getPlatform();
  return platform === 'ios' ? adIds[type].ios : adIds[type].android;
}

export async function iniciarAds(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  await AdMob.initialize({
    initializeForTesting: isTest,
  });
}

export async function showRewardedAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    await AdMob.prepareRewardVideoAd({
      adId: getAdId('rewarded'),
      isTesting: isTest,
    });

    await AdMob.showRewardVideoAd();

    return true;
  } catch (error) {
    console.error("Erro rewarded", error);
    return false;
  }
}

export async function showInterstitialAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;

  try {
    await AdMob.prepareInterstitial({
      adId: getAdId('interstitial'),
      isTesting: isTest,
    });

    await AdMob.showInterstitial();

    return true;
  } catch (error) {
    console.error("Erro interstitial", error);
    return false;
  }
}
