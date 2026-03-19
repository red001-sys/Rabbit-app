import React from "react";

export default function App() {
  return (
    <div style={{ padding: 30 }}>
      <h1>APP OK</h1>
      <p>Se você está vendo isso, o crash NÃO é do Android</p>
    </div>
  );
}


/*import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Premium from "./pages/Premium";
import PaymentSuccess from "./pages/PaymentSuccess";

import { initAdMob } from "./lib/admob";

export default function App() {
  const [isPremium, setIsPremium] = useState(false);
    const [theme, setTheme] = useState<"light" | "dark">("dark");

      useEffect(() => {
          loadSettings();

              (async () => {
                    try {
                            await initAdMob();
                                  } catch (err) {
                                          console.log("Erro iniciando AdMob", err);
                                                }
                                                    })();
                                                      }, []);

                                                        const loadSettings = () => {
                                                            try {
                                                                  const premium = localStorage.getItem("premium_user");
                                                                        if (premium === "true") {
                                                                                setIsPremium(true);
                                                                                      }

                                                                                            const savedTheme = localStorage.getItem("theme");
                                                                                                  const nextTheme = savedTheme === "light" ? "light" : "dark";
                                                                                                        setTheme(nextTheme);

                                                                                                              if (nextTheme === "dark") {
                                                                                                                      document.documentElement.classList.add("dark");
                                                                                                                            } else {
                                                                                                                                    document.documentElement.classList.remove("dark");
                                                                                                                                          }
                                                                                                                                              } catch (err) {
                                                                                                                                                    console.log("Erro carregando preferências", err);
                                                                                                                                                        }
                                                                                                                                                          };

                                                                                                                                                            const toggleTheme = () => {
                                                                                                                                                                const newTheme = theme === "dark" ? "light" : "dark";
                                                                                                                                                                    setTheme(newTheme);

                                                                                                                                                                        try {
                                                                                                                                                                              localStorage.setItem("theme", newTheme);

                                                                                                                                                                                    if (newTheme === "dark") {
                                                                                                                                                                                            document.documentElement.classList.add("dark");
                                                                                                                                                                                                  } else {
                                                                                                                                                                                                          document.documentElement.classList.remove("dark");
                                                                                                                                                                                                                }
                                                                                                                                                                                                                    } catch (err) {
                                                                                                                                                                                                                          console.log("Erro salvando tema", err);
                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                };

                                                                                                                                                                                                                                  const ativarPremium = () => {
                                                                                                                                                                                                                                      try {
                                                                                                                                                                                                                                            setIsPremium(true);
                                                                                                                                                                                                                                                  localStorage.setItem("premium_user", "true");
                                                                                                                                                                                                                                                      } catch (err) {
                                                                                                                                                                                                                                                            console.log("Erro ativando premium", err);
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                  };

                                                                                                                                                                                                                                                                    return (
                                                                                                                                                                                                                                                                        <HashRouter>
                                                                                                                                                                                                                                                                              <Routes>
                                                                                                                                                                                                                                                                                      <Route path="/" element={<Index isPremium={isPremium} />} />
                                                                                                                                                                                                                                                                                              <Route
                                                                                                                                                                                                                                                                                                        path="/premium"
                                                                                                                                                                                                                                                                                                                  element={
                                                                                                                                                                                                                                                                                                                              <Premium
                                                                                                                                                                                                                                                                                                                                            toggleTheme={toggleTheme}
                                                                                                                                                                                                                                                                                                                                                          ativarPremium={ativarPremium}
                                                                                                                                                                                                                                                                                                                                                                      />
                                                                                                                                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                                                                                                                                                        />
                                                                                                                                                                                                                                                                                                                                                                                                <Route path="/payment-success" element={<PaymentSuccess />} />
                                                                                                                                                                                                                                                                                                                                                                                                      </Routes>
                                                                                                                                                                                                                                                                                                                                                                                                          </HashRouter>
                                                                                                                                                                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                                                                                                                                                                            }/*
