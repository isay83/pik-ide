// src/features/Terminal/Terminal.tsx
import { useState, useEffect, useRef } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import coldark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";

interface TerminalProps {
  output: string;
  isWaitingForInput: boolean;
  inputPrompt: string;
  onInput: (input: string) => void;
}

export default function Terminal({
  output,
  isWaitingForInput,
  inputPrompt,
  onInput,
}: TerminalProps) {
  const [inputValue, setInputValue] = useState("");
  const [displayLines, setDisplayLines] = useState<string[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Actualizar líneas de salida
  useEffect(() => {
    if (output) {
      setDisplayLines([output]);
    } else {
      setDisplayLines([]);
    }
  }, [output]);

  // Auto-scroll al final
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [displayLines, isWaitingForInput]);

  return (
    <div
      ref={terminalRef}
      className="h-[300px] sm:h-[340px] md:h-[380px] lg:h-[420px] xl:h-[460px] max-h-[60vh] border-dashed border-2 border-gray-700 rounded overflow-auto cursor-text"
    >
      {/* Contenido de la terminal */}
      <div className="p-4 font-mono text-sm">
        {displayLines.length > 0 ? (
          <div className="mb-1">
            <SyntaxHighlighter
              customStyle={{
                margin: 0,
                padding: 0,
                background: "transparent",
                overflow: "visible",
                whiteSpace: "pre-wrap", // Esto preserva los saltos de línea
              }}
              wrapLongLines={true}
              language="bash"
              style={coldark}
            >
              {displayLines[0]} {/* Mostrar todo el contenido junto */}
            </SyntaxHighlighter>
          </div>
        ) : (
          <div className="text-gray-500">
            Presiona 'Ejecutar' para ver la salida...
          </div>
        )}
      </div>

      {/* Modal para input */}
      {isWaitingForInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4 text-gray-800">
              {inputPrompt}
            </h3>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onInput(inputValue);
                  setInputValue("");
                }
              }}
              className="w-full p-2 border border-gray-300 rounded mb-4 text-gray-800"
              placeholder="Ingresa tu respuesta..."
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  onInput(inputValue);
                  setInputValue("");
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
