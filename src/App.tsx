// src/App.tsx
import { useCallback, useState } from "react";
import { CodeView, Editor } from "./features";
import { PikInterpreter } from "./core/pikInterpreter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import coldark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
import "./blocks";

export default function App() {
  const [pikCode, setPikCode] = useState("");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleCodeUpdate = useCallback((code: string) => {
    setPikCode(code);
  }, []);

  const handleRunCode = useCallback(async () => {
    if (!pikCode.trim()) {
      setOutput("⚠️ No hay código para ejecutar");
      return;
    }

    setIsRunning(true);
    setOutput("🚀 Ejecutando código PIK...\n");

    try {
      const interpreter = new PikInterpreter();
      const result = await interpreter.execute(pikCode);
      setOutput(result);
    } catch (error) {
      setOutput(
        `❌ Error: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    } finally {
      setIsRunning(false);
    }
  }, [pikCode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-4">
      <div className="max-w-full mx-auto space-y-6">
        <header className="text-center mb-4">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            🎯 PIK Visual
          </h1>
          <p className="text-gray-600">
            Aprende a programar con bloques visuales
          </p>
        </header>

        {/* Editor de bloques */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            🧩 Editor de Bloques
          </h2>
          <div className="flex h-[500px] border rounded overflow-hidden">
            <Editor onCodeUpdate={handleCodeUpdate} />
          </div>
        </div>

        {/* Panel de código + Consola en misma fila */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Código PIK */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold text-gray-800">📝 Código PIK</h2>
              <button
                onClick={handleRunCode}
                disabled={isRunning || !pikCode.trim()}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRunning ? "⏳ Ejecutando..." : "▶️ Ejecutar"}
              </button>
            </div>
            <CodeView code={pikCode} />
          </div>

          {/* Consola */}
          <div className="flex-1 bg-gray-900 text-green-400 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-bold mb-3">🖥️ Consola de Salida</h2>
            <SyntaxHighlighter
              className="whitespace-pre-wrap text-base lg:text-lg xl:text-xl h-60 overflow-auto"
              language="bash"
              style={coldark}
            >
              {output || "Presiona 'Ejecutar' para ver la salida..."}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>
    </div>
  );
}
