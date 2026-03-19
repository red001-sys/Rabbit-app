export async function initAdMob(): Promise<void> {
  console.log("AdMob OFF");
}

export async function showInterstitialAd(): Promise<boolean> {
  console.log("Interstitial OFF");
  return false;
}

export async function showRewardedAd(): Promise<boolean> {
  console.log("Rewarded OFF");
  return false;
}

/*import { AdMob } from "@capacitor-community/admob";
import { Capacitor } from "@capacitor/core";

const REWARDED_AD_UNIT = "ca-app-pub-3940256099942544/5224354917";
const INTERSTITIAL_AD_UNIT = "ca-app-pub-3940256099942544/1033173712";

let initialized = false;
let isNative = false;

export async function initAdMob(): Promise<void> {
  if (initialized) return;

    if (Capacitor.getPlatform() !== "android") {
        console.log("AdMob ignorado fora do Android");
            initialized = true;
                return;
                  }

                    try {
                        await AdMob.initialize({
                              requestTrackingAuthorization: false,
                                    initializeForTesting: true,
                                        });

                                            isNative = true;
                                                console.log("AdMob iniciado");
                                                  } catch (error) {
                                                      console.log("Erro ao iniciar AdMob:", error);
                                                          isNative = false;
                                                            }

                                                              initialized = true;
                                                              }

                                                              export async function showInterstitialAd(): Promise<void> {
                                                                if (!isNative) return;

                                                                  try {
                                                                      await AdMob.prepareInterstitial({
                                                                            adId: INTERSTITIAL_AD_UNIT,
                                                                                  isTesting: true,
                                                                                      });

                                                                                          await AdMob.showInterstitial();
                                                                                            } catch (error) {
                                                                                                console.log("Erro ao mostrar interstitial:", error);
                                                                                                  }
                                                                                                  }

                                                                                                  export async function showRewardedAd(): Promise<boolean> {
                                                                                                    if (!isNative) return false;

                                                                                                      try {
                                                                                                          await AdMob.prepareRewardVideoAd({
                                                                                                                adId: REWARDED_AD_UNIT,
                                                                                                                      isTesting: true,
                                                                                                                          });

                                                                                                                              await AdMob.showRewardVideoAd();
                                                                                                                                  return true;
                                                                                                                                    } catch (error) {
                                                                                                                                        console.log("Erro ao mostrar rewarded:", error);
                                                                                                                                            return false;
                                                                                                                                              }
                                                                                                                                              }*/
