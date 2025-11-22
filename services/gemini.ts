import { GoogleGenAI } from "@google/genai";
import { Player, GradeResponse, AnalysisResponse } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from the environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

/**
 * Uses gemini-2.5-flash with Google Search to find the latest grades.
 */
export const fetchLatestGrades = async (players: Player[]): Promise<GradeResponse> => {
  if (players.length === 0) {
    return { text: "Nessun giocatore nella lista.", sources: [] };
  }

  const playerList = players.map(p => `${p.name} (${p.role})`).join(", ");
  const prompt = `
    Cerca i voti (pagelle) della Gazzetta dello Sport per l'ultima giornata di Serie A giocata per questi giocatori del fantacalcio:
    ${playerList}.
    
    Per ogni giocatore, indica chiaramente:
    1. Il Voto base (se ha giocato).
    2. Eventuali bonus/malus (gol, assist, ammonizioni) se menzionati.
    3. Se non ha giocato o ha preso S.V. (Senza Voto).

    Sii conciso e preciso. Presenta i risultati in una lista leggibile.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Nessun risultato trovato.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Filter for web chunks only
    const webSources = chunks.filter(c => c.web);

    return {
      text,
      sources: webSources,
    };
  } catch (error) {
    console.error("Error fetching grades:", error);
    throw new Error("Impossibile recuperare i voti al momento.");
  }
};

/**
 * Uses gemini-3-pro-preview with Thinking Mode to analyze the team.
 */
export const analyzeTeamStrategy = async (players: Player[]): Promise<AnalysisResponse> => {
  if (players.length === 0) {
    return { text: "Aggiungi giocatori per ricevere un'analisi." };
  }

  const playerList = players.map(p => `- ${p.name} (${p.role})`).join("\n");
  const prompt = `
    Agisci come un esperto allenatore di Serie A e analista di Fantacalcio.
    Analizza la seguente rosa:
    ${playerList}

    Usa la tua profonda conoscenza calcistica per:
    1. Identificare i punti di forza della squadra.
    2. Identificare le debolezze o i rischi (es. titolarità incerta, propensione ai cartellini).
    3. Consigliare il modulo migliore (es. 3-4-3, 4-3-3) basato su questi giocatori.
    4. Fornire una previsione sul potenziale complessivo della squadra per il campionato.

    Rifletti attentamente sulle sinergie tra i giocatori e le loro attuali condizioni generali.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingBudget: 32768, // Max thinking budget for deep analysis
        },
      },
    });

    return {
      text: response.text || "Impossibile generare l'analisi.",
    };
  } catch (error) {
    console.error("Error analyzing team:", error);
    throw new Error("Impossibile analizzare la squadra al momento.");
  }
};
