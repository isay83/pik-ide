// src/features/Editor/Editor.tsx
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { Panel } from "../../features";
import { PikGenerator } from "../../core";

export default function Editor({
  onCodeUpdate,
}: {
  onCodeUpdate: (code: string) => void;
}) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    // Define theme
    const pikTheme = Blockly.Theme.defineTheme("pikTheme", {
      name: "pikTheme",
      blockStyles: {
        logic: { colourPrimary: "#f472b6" },
        loop: { colourPrimary: "#60a5fa" },
        math: { colourPrimary: "#facc15" },
        text: { colourPrimary: "#c084fc" },
        variable: { colourPrimary: "#34d399" },
        output: { colourPrimary: "#fb7185" },
      },
      componentStyles: {
        workspaceBackgroundColour: "#fefce8",
        flyoutBackgroundColour: "#fafafa",
      },
    });

    // Inject Blockly once
    if (workspaceRef.current && !workspaceInstance.current) {
      workspaceInstance.current = Blockly.inject(workspaceRef.current, {
        renderer: "thrasos",
        theme: pikTheme,
        trashcan: true,
        scrollbars: true,
        zoom: { controls: true, wheel: true },
        grid: { spacing: 25, length: 3, colour: "#ccc", snap: true },
      });

      // Actualizar código al cambiar bloques
      workspaceInstance.current.addChangeListener(() => {
        const code = PikGenerator.workspaceToCode(workspaceInstance.current!);
        onCodeUpdate(code);
      });

      // Drag & drop desde el Panel
      workspaceRef.current.addEventListener("dragover", (e) =>
        e.preventDefault()
      );
      workspaceRef.current.addEventListener("drop", (e) => {
        const xmlText = e.dataTransfer?.getData("text/plain");
        if (!xmlText) return;
        /* @ts-expect-error trusted*/
        const dom = Blockly.Xml.textToDom(xmlText);
        Blockly.Xml.domToWorkspace(dom, workspaceInstance.current!);
      });
    }

    return () => {
      workspaceInstance.current?.dispose();
      workspaceInstance.current = null;
    };
  }, [onCodeUpdate]);

  // Toggle drawer y forzar resize de Blockly
  const toggleMenu = () => {
    setMenuVisible((v) => !v);
    setTimeout(() => Blockly.svgResize(workspaceInstance.current!), 200);
  };

  return (
    <div className="relative h-full w-full border rounded shadow-inner overflow-hidden">
      {/* 1) Botón siempre visible */}
      <button
        onClick={toggleMenu}
        className="absolute top-3 left-3 z-30 bg-white border rounded px-3 py-1 shadow text-sm text-blue-700 hover:bg-blue-50"
      >
        {menuVisible ? "⬅ Cerrar" : "☰ Bloques"}
      </button>

      {/* 2) Panel flotante */}
      {menuVisible && workspaceInstance.current && (
        <div
          className="
      absolute top-0 left-0 h-full w-64
      bg-white border-r shadow-lg z-20
      flex flex-col
      /* añade: */
      items-center
    "
        >
          <div
            className="
        flex-1 overflow-y-auto overflow-x-hidden
        p-3 w-full
        flex flex-col
        items-center
      "
          >
            <Panel workspace={workspaceInstance.current} hidden={false} />
          </div>
        </div>
      )}

      {/* 3) Workspace ocupa todo el fondo */}
      <div ref={workspaceRef} className="absolute inset-0" />
    </div>
  );
}
