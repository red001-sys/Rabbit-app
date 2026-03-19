import React from "react";

interface PremiumProps {
  toggleTheme: () => void;
  ativarPremium: () => void;
}

export default function Premium({ toggleTheme, ativarPremium }: PremiumProps) {
  const comprarPremium = async () => {
    await ativarPremium();
    alert("Premium ativado! Reinicie o app.");
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 p-4">
      <h1 className="text-2xl font-bold mb-5 text-foreground">Premium</h1>
      <button 
        className="bg-primary text-primary-foreground px-4 py-2 rounded-md mb-4 font-semibold" 
        onClick={comprarPremium}
      >
        Ativar Premium (Remove anúncios)
      </button>
      <button 
        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md font-semibold" 
        onClick={toggleTheme}
      >
        Trocar tema
      </button>
    </div>
  );
}
