import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { LanguageProvider } from "./contexts/LanguageContext";

// Segurança total para Android
let rootElement: HTMLElement | null = null;

try {
  rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error('Elemento "root" não encontrado.');
  }

  // Params seguros (sem quebrar no Android)
  try {
    const search = window?.location?.search ?? "";
    const params = new URLSearchParams(search);

    if (params.get("premium") === "true") {
      localStorage.setItem("premium_user", "true");
    }
  } catch (err) {
    console.log("Erro params:", err);
  }

  // Render único e seguro
  createRoot(rootElement).render(
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );

} catch (error) {
  console.error("Erro fatal ao iniciar app:", error);

  // fallback visual (evita crash silencioso)
  document.body.innerHTML = `
    <div style="padding:20px;font-family:sans-serif;">
      <h2>Erro ao iniciar app</h2>
      <pre>${String(error)}</pre>
    </div>
  `;
}
