import React, { useState } from "react";
import { showRewardedAd } from "../lib/admob";

interface IndexProps {
  isPremium: boolean;
}

interface Alimento {
  id: number;
  nome: string;
  macronutrientes: string;
}

const alimentos: Alimento[] = [
  { id: 1, nome: "Maçã", macronutrientes: "Carbs: 14g, Proteína: 0.3g, Gordura: 0.2g" },
  { id: 2, nome: "Ovo", macronutrientes: "Carbs: 1g, Proteína: 6g, Gordura: 5g" },
  { id: 3, nome: "Banana", macronutrientes: "Carbs: 23g, Proteína: 1g, Gordura: 0.3g" },
  { id: 4, nome: "Peito de Frango", macronutrientes: "Carbs: 0g, Proteína: 31g, Gordura: 3.6g" },
  { id: 5, nome: "Aveia", macronutrientes: "Carbs: 12g, Proteína: 2.5g, Gordura: 1.5g" },
];

const Index: React.FC<IndexProps> = ({ isPremium }) => {
  const [liberados, setLiberados] = useState<number[]>([]);
  const [anunciosAssistidos, setAnunciosAssistidos] = useState(0);
  const MAX_ANUNCIOS = 5;

  const handleLiberar = async (id: number) => {
    if (isPremium || liberados.includes(id)) return;
    if (anunciosAssistidos >= MAX_ANUNCIOS) return;

    const sucesso = await showRewardedAd();
    if (sucesso) {
      setLiberados(prev => [...prev, id]);
      setAnunciosAssistidos(prev => prev + 1);
    }
  };

  return (
    <div className="flex-1 p-5">
      {alimentos.map(a => (
        <div key={a.id} className="p-2.5 border border-gray-300 mb-2.5 rounded shadow-sm">
          <span className="font-bold text-base block mb-1">{a.nome}</span>
          {isPremium || liberados.includes(a.id) ? (
            <span className="text-gray-700">{a.macronutrientes}</span>
          ) : (
            <button 
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
              onClick={() => handleLiberar(a.id)}
            >
              Assistir anúncio para liberar
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Index;
