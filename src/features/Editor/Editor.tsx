// src/features/Editor/Editor.tsx
import { useEffect, useRef } from "react";
import * as Blockly from "blockly";
import { toolboxXml } from "../../data/toolbox";
import { PikGenerator } from "../../core/pikGenerator";

export default function Editor({
  onCodeUpdate,
}: {
  onCodeUpdate: (code: string) => void;
}) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);

  useEffect(() => {
    const pikTheme = Blockly.Theme.defineTheme("pikTheme", {
      name: "pikTheme",
      blockStyles: {
        logic: { colourPrimary: "#f472b6" }, // Rosa suave
        loop: { colourPrimary: "#60a5fa" }, // Azul claro
        math: { colourPrimary: "#facc15" }, // Amarillo Pik
        text: { colourPrimary: "#c084fc" }, // Violeta pastel
      },
      categoryStyles: {
        logic_category: { colour: "#f472b6" },
        loop_category: { colour: "#60a5fa" },
        math_category: { colour: "#facc15" },
        text_category: { colour: "#c084fc" },
      },
      componentStyles: {
        workspaceBackgroundColour: "#fefce8", // Fondo suave
        toolboxBackgroundColour: "#fefefe",
        flyoutBackgroundColour: "#fafafa",
      },
    });

    if (workspaceRef.current) {
      workspaceInstance.current = Blockly.inject(workspaceRef.current, {
        toolbox: toolboxXml,
        grid: { spacing: 25, length: 3, colour: "#ccc", snap: true },
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 1.2 },
        theme: pikTheme, // Tema visual para Pik
      });

      workspaceInstance.current.addChangeListener(() => {
        const code = PikGenerator.workspaceToCode(workspaceInstance.current!);
        console.log("Código generado:", code);
        onCodeUpdate(code);
      });
    }
  }, [onCodeUpdate]);

  return (
    <div
      ref={workspaceRef}
      className="h-[600px] bg-gray-50 border rounded-md"
    />
  );
}
