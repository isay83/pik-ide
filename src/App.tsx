// src/App.tsx
import { useCallback, useState } from "react";
import { CodeView, Editor } from "./features";
import { PikInterpreter } from "./core/pikInterpreter";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import coldark from "react-syntax-highlighter/dist/esm/styles/prism/coldark-dark";
//import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Lottie from "lottie-react";
import { hi, heart, code, run, loading, terminal } from "./assets";
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
        <header className="flex flex-col md:flex-row items-center justify-center mb-4 gap-4 text-center md:text-left">
          <Lottie
            animationData={hi}
            loop
            autoplay
            className="w-40 md:w-60 lg:w-72"
          />
          <div>
            <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#fdafcc] via-[#d6bee2] to-[#a3d1fe] text-transparent bg-clip-text drop-shadow-md">
              PIK Visual
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Aprende a programar con bloques visuales
            </p>
          </div>
        </header>

        {/* Editor de bloques */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center gap-3 mb-3">
            <Lottie
              animationData={heart}
              loop
              autoplay
              className="w-14 md:w-32 lg:w-40"
            />
            <h2 className="text-2xl font-bold text-pink-600 drop-shadow-sm">
              Editor de Bloques
            </h2>
          </div>

          <div className="flex h-[500px] border rounded overflow-hidden">
            <Editor onCodeUpdate={handleCodeUpdate} />
          </div>
        </div>

        {/* Panel de código + Consola en misma fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Código PIK */}
          <div className="flex-1 bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              {/* Título con animación */}
              <div className="flex items-center gap-2">
                <Lottie
                  animationData={code}
                  loop
                  autoplay
                  className="w-14 md:w-32 lg:w-40"
                />
                <h2 className="text-2xl font-bold text-blue-700 drop-shadow-sm">
                  Código PIK
                </h2>
              </div>

              {/* Botón con animación condicional */}
              <button
                onClick={handleRunCode}
                disabled={isRunning || !pikCode.trim()}
                className="px-4 py-2 bg-[#9f9f9f] text-white rounded hover:bg-[#7e7e7e] disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <Lottie
                      animationData={loading}
                      loop
                      autoplay
                      className="w-12"
                    />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Lottie
                      animationData={run}
                      loop
                      autoplay
                      className="w-12"
                    />
                    Ejecutar
                  </>
                )}
              </button>
            </div>

            <CodeView code={pikCode} />
          </div>

          {/* Consola */}
          <div className="flex-1 bg-gray-900 text-green-400 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lottie
                animationData={terminal}
                loop
                autoplay
                className="w-10 md:w-12 lg:w-16"
              />
              <h2 className="text-2xl font-bold text-purple-300 drop-shadow-sm">
                Consola de Salida
              </h2>
            </div>

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
