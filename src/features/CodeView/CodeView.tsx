// src/features/CodeView/CodeView.tsx
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism/solarizedlight";

export default function CodeView({ code }: { code: string }) {
  return (
    <div className="h-[300px] overflow-auto">
      <SyntaxHighlighter
        language="python" // o 'clike', no hay 'pik' por defecto
        style={tomorrow}
        customStyle={{
          fontSize: "1.5rem",
          padding: "1rem",
          borderRadius: "0.5rem",
          border: "2px dashed #d1d5db",
        }}
      >
        {code || "// Arrastra bloques para generar código PIK..."}
      </SyntaxHighlighter>
    </div>
  );
}
