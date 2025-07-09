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
        variable: { colourPrimary: "#34d399" }, // Verde menta
        output: { colourPrimary: "#fb7185" }, // Rosa coral
      },
      categoryStyles: {
        logic_category: { colour: "#f472b6" },
        loop_category: { colour: "#60a5fa" },
        math_category: { colour: "#facc15" },
        text_category: { colour: "#c084fc" },
        variable_category: { colour: "#34d399" },
        output_category: { colour: "#fb7185" },
      },
      componentStyles: {
        workspaceBackgroundColour: "#fefce8", // Fondo suave
        toolboxBackgroundColour: "#fefefe",
        flyoutBackgroundColour: "#fafafa",
      },
    });

    if (workspaceRef.current && !workspaceInstance.current) {
      workspaceInstance.current = Blockly.inject(workspaceRef.current, {
        toolbox: toolboxXml,
        grid: { spacing: 25, length: 3, colour: "#ccc", snap: true },
        trashcan: true,
        zoom: { controls: true, wheel: true, startScale: 1.0 },
        theme: pikTheme,
        collapse: true,
        comments: true,
        disable: false,
        maxBlocks: Infinity,
        rtl: false,
        scrollbars: true,
        sounds: true,
        oneBasedIndex: true,
      });

      // Listener para actualizar el código cuando cambian los bloques
      workspaceInstance.current.addChangeListener(() => {
        if (workspaceInstance.current) {
          const code = PikGenerator.workspaceToCode(workspaceInstance.current);
          onCodeUpdate(code);
        }
      });
    }

    // Cleanup function para evitar duplicados
    return () => {
      if (workspaceInstance.current) {
        workspaceInstance.current.dispose();
        workspaceInstance.current = null;
      }
    };
  }, [onCodeUpdate]);

  return (
    <div
      ref={workspaceRef}
      className="h-[500px] bg-gray-50 border rounded-md shadow-inner"
    />
  );
}
