// src/App.tsx
import { useCallback, useState, useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { CodeView, Editor, Terminal } from "./features";
import { PikInterpreter } from "./core/pikInterpreter";
import Lottie from "lottie-react";
import { hi, heart, code, run, loading, terminal } from "./assets";
import { Toggle } from "./components";
import "./blocks";

export default function App() {
  const [pikCode, setPikCode] = useState(() => {
    return localStorage.getItem("pikCode") || "";
  });
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isCodeEditable, setIsCodeEditable] = useState(false);
  const workspaceRef = useRef<Blockly.WorkspaceSvg | null>(null);
  const [isWaitingForInput, setIsWaitingForInput] = useState(false);
  const [inputPrompt, setInputPrompt] = useState("");
  const [inputResolver, setInputResolver] = useState<
    ((value: string) => void) | null
  >(null);

  const handleCodeUpdate = useCallback((code: string) => {
    setPikCode(code);

    if (workspaceRef.current) {
      const xml = Blockly.Xml.workspaceToDom(workspaceRef.current);
      const xmlText = Blockly.Xml.domToText(xml);
      localStorage.setItem("pikWorkspaceXml", xmlText);
    }
  }, []);

  // Para persistir en localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pikCode");
    if (saved !== null) setPikCode(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("pikCode", pikCode);
  }, [pikCode]);

  // File input invisible
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Guardar a archivo
  const saveCode = useCallback(() => {
    const blob = new Blob([pikCode], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "code.pik";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pikCode]);

  // Cargar desde archivo
  const loadCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPikCode(ev.target?.result as string);
    };
    reader.readAsText(file);
    e.target.value = "";
  }, []);

  const clearWorkspace = () => {
    if (workspaceRef.current) {
      workspaceRef.current.clear();
      setPikCode("");
      localStorage.removeItem("pikCode");
      localStorage.removeItem("pikWorkspaceXml");
    }
  };

  // Ejecutar código
  const handleRunCode = useCallback(async () => {
    if (!pikCode.trim()) {
      setOutput("⚠️ No hay código para ejecutar");
      return;
    }

    setIsRunning(true);
    setOutput("🚀 Ejecutando código PIK...\n");

    try {
      const interpreter = new PikInterpreter();

      // Configurar el handler de input personalizado
      interpreter.setInputHandler(async (prompt: string) => {
        setInputPrompt(prompt);
        setIsWaitingForInput(true);

        return new Promise((resolve) => {
          setInputResolver(() => resolve);
        });
      });

      const result = await interpreter.execute(pikCode);
      setOutput((prev) => prev + result);
    } catch (error) {
      setOutput(
        (prev) =>
          prev +
          `❌ Error: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`
      );
    } finally {
      setIsRunning(false);
      setIsWaitingForInput(false);
    }
  }, [pikCode]);

  // Función para manejar la respuesta del modal:
  const handleModalInput = useCallback(
    (input: string) => {
      if (inputResolver) {
        setOutput((prev) => prev + inputPrompt + input + "\n");
        inputResolver(input);
        setInputResolver(null);
      }
      setIsWaitingForInput(false);
    },
    [inputPrompt, inputResolver]
  );

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
          <div className="relative flex justify-between items-center mb-3">
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
            {!isCodeEditable && (
              <button
                onClick={clearWorkspace}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition cursor-pointer lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2"
              >
                🧹 Limpiar
              </button>
            )}
          </div>

          <div className="flex h-[500px] border rounded overflow-hidden">
            <Editor
              onCodeUpdate={handleCodeUpdate}
              isCodeEditable={isCodeEditable}
              workspaceRef={workspaceRef}
            />
          </div>
        </div>

        {/* Panel de código + Terminal en misma fila */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Código PIK */}
          <div className="flex-1 transition-all duration-300 ease-in-out bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Lottie
                  animationData={code}
                  loop
                  autoplay
                  className="w-8 md:w-24 lg:w-32"
                />
                <h2 className="text-2xl font-bold text-blue-700 drop-shadow-sm">
                  Código PIK
                </h2>
              </div>

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

            <div className="flex flex-wrap gap-4 mb-4 items-center">
              <div className="border border-gray-300 rounded px-3 py-2 bg-gray-100 shadow-sm">
                <Toggle
                  checked={isCodeEditable}
                  onCheckedChange={setIsCodeEditable}
                  label={isCodeEditable ? "Modo Editor" : "Modo Bloques"}
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={saveCode}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-md shadow hover:bg-emerald-700 transition cursor-pointer"
                >
                  💾 Guardar
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-md shadow hover:bg-sky-700 transition cursor-pointer"
                >
                  📂 Cargar
                </button>
                <input
                  type="file"
                  accept=".pik"
                  ref={fileInputRef}
                  onChange={loadCode}
                  className="hidden"
                />

                {isCodeEditable && (
                  <button
                    onClick={() => setPikCode("")}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-md shadow hover:bg-rose-700 transition cursor-pointer"
                  >
                    🧹 Limpiar
                  </button>
                )}
              </div>
            </div>

            <CodeView
              code={pikCode}
              isEditable={isCodeEditable}
              onChange={(value) => setPikCode(value)}
            />
          </div>

          {/* Terminal Interactiva */}
          <div className="flex-1 transition-all duration-300 ease-in-out bg-gray-900 text-green-400 rounded-lg shadow-md p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lottie
                animationData={terminal}
                loop
                autoplay
                className="w-10 md:w-12 lg:w-16"
              />
              <h2 className="text-2xl font-bold text-purple-300 drop-shadow-sm">
                Terminal
              </h2>
            </div>

            <Terminal
              output={output}
              isWaitingForInput={isWaitingForInput}
              inputPrompt={inputPrompt}
              onInput={handleModalInput}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
