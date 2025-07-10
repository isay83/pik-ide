// src/data/toolbox.ts
export const toolboxJson = {
  kind: "categoryToolbox",
  style: "pikTheme",
  contents: [
    {
      kind: "category",
      name: "📤 Salida",
      colour: "#fb7185",
      contents: [{ kind: "block", type: "mostrar" }],
    },
    {
      kind: "category",
      name: "📦 Variables",
      colour: "#34d399",
      contents: [{ kind: "block", type: "guardar" }],
    },
    {
      kind: "category",
      name: "🔢 Números",
      colour: "#facc15",
      contents: [
        { kind: "block", type: "numero" },
        { kind: "block", type: "operacion" },
      ],
    },
    {
      kind: "category",
      name: "📝 Texto",
      colour: "#c084fc",
      contents: [{ kind: "block", type: "texto" }],
    },
    {
      kind: "category",
      name: "🤔 Lógica",
      colour: "#f472b6",
      contents: [
        { kind: "block", type: "si" },
        { kind: "block", type: "comparacion" },
      ],
    },
    {
      kind: "category",
      name: "🔄 Bucles",
      colour: "#60a5fa",
      contents: [{ kind: "block", type: "repetir" }],
    },
    {
      kind: "category",
      name: "❓ Entrada",
      colour: "#a78bfa",
      contents: [{ kind: "block", type: "preguntar" }],
    },
  ],
};