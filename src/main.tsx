import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

try {
  const search = window?.location?.search ?? "";
    const params = new URLSearchParams(search);

      if (params.get("premium") === "true") {
          localStorage.setItem("premium_user", "true");
            }
            } catch (error) {
              console.error("Erro ao ler parâmetro premium:", error);
              }

              const rootElement = document.getElementById("root");

              if (!rootElement) {
                throw new Error('Elemento "root" não encontrado.');
                }

                createRoot(rootElement).render(<App />);