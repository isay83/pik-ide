// src/features/CodeView/CodeView.tsx
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { pikLanguage } from "../../languages/pikLanguage";
import { pikTheme } from "../../themes/pikTheme";

interface Props {
  code: string;
  isEditable?: boolean;
  onChange?: (code: string) => void;
}

export default function CodeView({
  code,
  isEditable = false,
  onChange,
}: Props) {
  return (
    <div className="h-[300px] sm:h-[340px] md:h-[380px] lg:h-[420px] xl:h-[460px] max-h-[60vh] border-dashed border-2 border-gray-300 rounded overflow-auto">
      <CodeMirror
        value={code || "// Arrastra bloques para generar código PIK..."}
        onChange={onChange}
        height="100%"
        theme={pikTheme}
        extensions={[pikLanguage, EditorView.editable.of(isEditable)]}
        className="text-lg"
      />
    </div>
  );
}
