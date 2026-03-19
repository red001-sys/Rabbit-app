let foodCount = 0;
let lastAdTime = 0;

const MIN_INTERVAL = 60 * 1000; // 1 minuto entre anúncios

// 🔥 Função chamada sempre que usuário adiciona comida
export async function registerFoodAdded() {
  try {
    foodCount++;

    // não mostrar nos primeiros usos
    if (foodCount < 5) return;

    // só a cada 5 ações
    if (foodCount % 5 !== 0) return;

    const now = Date.now();

    // evitar spam de anúncio
    if (now - lastAdTime < MIN_INTERVAL) return;

    // lazy import evita crash se AdMob falhar
    const { showInterstitialAd } = await import('./admob');

    setTimeout(async () => {
      try {
        await showInterstitialAd();
        lastAdTime = Date.now();
      } catch (err) {
        console.log('Erro ao mostrar interstitial', err);
      }
    }, 1200); // delay UX-friendly
  } catch (err) {
    console.log('Erro no adController', err);
  }
}
