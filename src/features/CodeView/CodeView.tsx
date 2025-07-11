// src/features/CodeView/CodeView.tsx
export default function CodeView({ code }: { code: string }) {
  return (
    <div className="h-[300px] overflow-auto">
      <pre className="whitespace-pre-wrap font-mono text-4xl text-gray-800 bg-gray-50 p-3 rounded border-2 border-dashed border-gray-300">
        {code || "// Arrastra bloques para generar código PIK..."}
      </pre>
    </div>
  );
}
