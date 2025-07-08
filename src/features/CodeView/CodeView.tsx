// src/features/CodeView/CodeView.tsx
export default function CodeView({ code }: { code: string }) {
  return (
    <div className="p-4 bg-white border rounded-md h-[600px] overflow-auto">
      <h2 className="font-bold text-lg mb-2">Código PIK</h2>
      <pre className="whitespace-pre-wrap font-mono text-sm">{code}</pre>
    </div>
  );
}
