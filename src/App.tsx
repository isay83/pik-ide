// src/App.tsx
import { useCallback, useState } from "react";
import { CodeView, Editor } from "./features";
import "./blocks"; // registra todos los bloques antes de que se monte Blockly

export default function App() {
  const [pikCode, setPikCode] = useState("");

  const handleCodeUpdate = useCallback((code: string) => {
    setPikCode(code);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-6 bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen">
      <Editor onCodeUpdate={handleCodeUpdate} />
      <CodeView code={pikCode} />
    </div>
  );
}
