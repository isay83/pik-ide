// src/features/Panel/Panel.tsx
import * as Blockly from "blockly";
import { useState } from "react";
import BlockButton from "./BlockButton";

const categorias = [
  {
    nombre: "⚙️ Acciones",
    bloques: ["guardar", "mostrar", "preguntar"],
  },
  {
    nombre: "🔢 Valores",
    bloques: ["numero", "texto", "booleano_valor"],
  },
  {
    nombre: "📊 Variables",
    bloques: ["variable", "constante"],
  },
  {
    nombre: "🧪 Operadores",
    bloques: ["operacion", "comparacion", "y", "o", "no"],
  },
  {
    nombre: "🧠 Control de flujo",
    bloques: ["si", "para", "repetir", "mientras", "segun", "caso", "defecto"],
  },
  {
    nombre: "🔄 Convertidores",
    bloques: [
      "entero",
      "decimal",
      "texto_convertido", // si usas 'convertir_a_texto', cámbialo aquí
      "booleano",
    ],
  },
  {
    nombre: "📦 Funciones",
    bloques: ["funcion", "retornar", "llamar_funcion"],
  },
];

export default function Panel({
  workspace,
  hidden,
}: {
  workspace: Blockly.WorkspaceSvg;
  hidden: boolean;
}) {
  const [activa, setActiva] = useState("");

  if (hidden) return null;

  return (
    <div className="w-64 bg-white h-full overflow-y-auto p-4 flex-shrink-0">
      <h2 className="text-lg font-bold text-blue-800 mb-4">📚 Bloques PIK</h2>

      <div className="space-y-3">
        {categorias.map((cat) => (
          <div key={cat.nombre} className="border rounded-md p-2">
            <button
              onClick={() => setActiva(activa === cat.nombre ? "" : cat.nombre)}
              className="w-full text-left font-semibold text-gray-700 hover:text-blue-800"
            >
              {cat.nombre}
            </button>

            {activa === cat.nombre && (
              <div className="mt-2 space-y-1">
                {cat.bloques.map((tipo) => (
                  <BlockButton key={tipo} tipo={tipo} workspace={workspace} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
