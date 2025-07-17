// src/features/Editor/Editor.tsx
import { useEffect, useRef, useState } from "react";
import * as Blockly from "blockly";
import { Panel } from "../../features";
import { PikGenerator } from "../../core";

export default function Editor({
  onCodeUpdate,
  isCodeEditable,
}: {
  onCodeUpdate: (code: string) => void;
  isCodeEditable: boolean;
}) {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;

    const handleDragOver = (e: DragEvent) => {
      if (!isCodeEditable) e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      if (isCodeEditable) return;
      const xml = e.dataTransfer?.getData("text/plain");
      if (!xml) return;
      /* @ts-expect-error trusted */
      const dom = Blockly.Xml.textToDom(xml);
      Blockly.Xml.domToWorkspace(dom, workspaceInstance.current!);
    };

    el?.addEventListener("dragover", handleDragOver);
    el?.addEventListener("drop", handleDrop);

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
        function: { colourPrimary: "#a78bfa" },
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
        move: {
          drag: true,
          wheel: true,
          scrollbars: true,
        },
        modalInputs: true,
        zoom: { controls: true, wheel: false, startScale: 1.0 },
        grid: { spacing: 25, length: 3, colour: "#ccc", snap: true },
      });

      // Centrar y resize tras montarse
      setTimeout(() => {
        Blockly.svgResize(workspaceInstance.current!);
        const ws = workspaceInstance.current!;
        if (typeof ws.scrollCenter === "function") {
          ws.scrollCenter();
        } else {
          const m = ws.getMetrics()!;
          ws.scroll(
            (m.contentWidth - m.viewWidth) / 2 + m.absoluteLeft,
            (m.contentHeight - m.viewHeight) / 2 + m.absoluteTop
          );
        }
      }, 50);

      // Actualizar código al cambiar bloques
      workspaceInstance.current.addChangeListener(() => {
        const code = PikGenerator.workspaceToCode(workspaceInstance.current!);
        onCodeUpdate(code);
      });

      // Drag & drop desde el Panel
      /*
      function onDragOver(e: DragEvent) {
        if (!isCodeEditable) e.preventDefault();
      }
      function onDrop(e: DragEvent) {
        if (isCodeEditable) return;
        const xml = e.dataTransfer?.getData("text/plain");
        if (!xml) return;
        */
      /* ts-expect-error trusted*/
      /*const dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspaceInstance.current!);
      }
      workspaceRef.current.addEventListener("dragover", onDragOver);
      workspaceRef.current.addEventListener("drop", onDrop);
      */
    }

    return () => {
      workspaceInstance.current?.dispose();
      workspaceInstance.current = null;
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("drop", handleDrop);
    };
  }, [onCodeUpdate, isCodeEditable]);

  // Efecto para deshabilitar interacciones y atenuar el workspace
  useEffect(() => {
    const el = workspaceRef.current;
    if (!el) return;
    el.style.pointerEvents = isCodeEditable ? "none" : "auto";
    el.style.opacity = isCodeEditable ? "0.5" : "1";
  }, [isCodeEditable]);

  // Toggle drawer y forzar resize de Blockly
  const toggleMenu = () => {
    setMenuVisible((v) => !v);
    setTimeout(() => Blockly.svgResize(workspaceInstance.current!), 200);
  };

  return (
    <div className="relative h-full w-full border rounded shadow-inner overflow-hidden">
      {/* 1) Botón siempre visible */}
      {/* Botón flotante: alineado fuera del contenido principal */}
      {/* botón y panel solo si NO estamos en modo texto */}
      {!isCodeEditable && (
        <div
          className={`
    absolute z-30 top-4
    ${menuVisible ? "left-72" : "left-4"} 
    transition-all duration-300
  `}
        >
          <button
            onClick={toggleMenu}
            className="bg-white border rounded px-3 py-1 shadow text-sm text-blue-700 hover:bg-blue-50 cursor-pointer transition-colors duration-200"
          >
            {menuVisible ? "← Ocultar" : "☰ Bloques"}
          </button>
        </div>
      )}

      {/* 2) Panel flotante */}
      {/* panel flotante solo en modo bloques */}
      {!isCodeEditable && menuVisible && workspaceInstance.current && (
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
