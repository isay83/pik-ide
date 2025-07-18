// src/features/Editor/Editor.tsx
import { useEffect, useRef, useState, useCallback } from "react";
import * as Blockly from "blockly";
import { Panel } from "../../features";
import { PikGenerator, parsePikAst } from "../../core";
import type {
  PikAst,
  StatementNode,
  CallStmtNode,
  IfNode,
  WhileNode,
  AssignNode,
  ExprNode,
  LiteralNode,
  IdentifierNode,
  BinaryOpNode,
} from "../../core";
import {
  isCallStmt,
  isAssign,
  isIf,
  isWhile,
  isLiteral,
  isIdentifier,
} from "../../core";

export default function Editor({
  pikCode,
  onCodeUpdate,
  isCodeEditable,
  workspaceRef,
}: {
  pikCode: string;
  onCodeUpdate: (code: string) => void;
  isCodeEditable: boolean;
  workspaceRef: React.RefObject<Blockly.WorkspaceSvg | null>;
}) {
  const workspaceDivRef = useRef<HTMLDivElement>(null);
  const workspaceInstance = useRef<Blockly.WorkspaceSvg | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  // Función para crear bloques de valor/expresión
  const createValueBlock = useCallback(
    (ws: Blockly.WorkspaceSvg, expr: ExprNode): Blockly.BlockSvg | null => {
      if (isLiteral(expr)) {
        const literal = expr as LiteralNode;
        if (typeof literal.value === "string") {
          const block = ws.newBlock("text");
          block.setFieldValue(literal.value, "TEXT");
          return block;
        } else if (typeof literal.value === "number") {
          const block = ws.newBlock("math_number");
          block.setFieldValue(literal.value.toString(), "NUM");
          return block;
        } else if (typeof literal.value === "boolean") {
          const block = ws.newBlock("logic_boolean");
          block.setFieldValue(literal.value ? "TRUE" : "FALSE", "BOOL");
          return block;
        }
      } else if (isIdentifier(expr)) {
        const identifier = expr as IdentifierNode;
        const block = ws.newBlock("variables_get");
        block.setFieldValue(identifier.name, "VAR");
        return block;
      } else if (expr.type === "BinaryOp") {
        const binOp = expr as BinaryOpNode;
        let blockType = "";

        // Mapear operadores a tipos de bloques
        switch (binOp.operator) {
          case "+":
          case "-":
          case "*":
          case "/":
            blockType = "math_arithmetic";
            break;
          case "==":
          case "!=":
          case "<":
          case ">":
          case "<=":
          case ">=":
            blockType = "logic_compare";
            break;
          case "y":
          case "o":
            blockType = "logic_operation";
            break;
          default:
            return null;
        }

        const block = ws.newBlock(blockType);

        // Configurar el operador
        if (blockType === "math_arithmetic") {
          const opMap: { [key: string]: string } = {
            "+": "ADD",
            "-": "MINUS",
            "*": "MULTIPLY",
            "/": "DIVIDE",
          };
          block.setFieldValue(opMap[binOp.operator] || "ADD", "OP");
        } else if (blockType === "logic_compare") {
          const opMap: { [key: string]: string } = {
            "==": "EQ",
            "!=": "NEQ",
            "<": "LT",
            ">": "GT",
            "<=": "LTE",
            ">=": "GTE",
          };
          block.setFieldValue(opMap[binOp.operator] || "EQ", "OP");
        } else if (blockType === "logic_operation") {
          const opMap: { [key: string]: string } = {
            y: "AND",
            o: "OR",
          };
          block.setFieldValue(opMap[binOp.operator] || "AND", "OP");
        }

        // Conectar operandos
        const leftBlock = createValueBlock(ws, binOp.left);
        const rightBlock = createValueBlock(ws, binOp.right);

        if (leftBlock) {
          leftBlock.initSvg();
          leftBlock.render();
          block.getInput("A")?.connection?.connect(leftBlock.outputConnection);
        }

        if (rightBlock) {
          rightBlock.initSvg();
          rightBlock.render();
          block.getInput("B")?.connection?.connect(rightBlock.outputConnection);
        }

        return block;
      }

      return null;
    },
    []
  );

  // Función mejorada para convertir AST a bloques
  const astToBlocks = useCallback(
    (
      ws: Blockly.WorkspaceSvg,
      nodes: StatementNode[],
      startX = 20,
      startY = 20
    ): Blockly.BlockSvg[] => {
      if (!nodes || !Array.isArray(nodes)) {
        console.warn("astToBlocks: nodes no es un array válido", nodes);
        return [];
      }

      const createdBlocks: Blockly.BlockSvg[] = [];

      nodes.forEach((node, idx) => {
        let block: Blockly.BlockSvg | null = null;

        try {
          if (isCallStmt(node)) {
            const callNode = node as CallStmtNode;
            console.log("Procesando CallStmt:", callNode);

            if (callNode.name === "mostrar") {
              block = ws.newBlock("mostrar");

              // Conectar el argumento
              if (callNode.args && callNode.args.length > 0) {
                const arg = callNode.args[0];
                const valueBlock = createValueBlock(ws, arg);

                if (valueBlock) {
                  valueBlock.initSvg();
                  valueBlock.render();
                  const connection = block.getInput("VALOR")?.connection;
                  if (connection && valueBlock.outputConnection) {
                    connection.connect(valueBlock.outputConnection);
                  }
                }
              }
            } else if (callNode.name === "preguntar") {
              block = ws.newBlock("input");
              // Implementar lógica para preguntar
              if (callNode.args && callNode.args.length > 0) {
                const promptBlock = createValueBlock(ws, callNode.args[0]);
                if (promptBlock) {
                  promptBlock.initSvg();
                  promptBlock.render();
                  block
                    .getInput("PROMPT")
                    ?.connection?.connect(promptBlock.outputConnection);
                }
              }
            } else {
              // Función genérica
              block = ws.newBlock("llamar_funcion");
              block.setFieldValue(callNode.name, "NOMBRE");
              const argsStr = callNode.args
                .map((arg) => {
                  if (isLiteral(arg)) {
                    return String((arg as LiteralNode).value);
                  } else if (isIdentifier(arg)) {
                    return (arg as IdentifierNode).name;
                  }
                  return "?";
                })
                .join(", ");
              block.setFieldValue(argsStr, "PARAMS");
            }
          } else if (isAssign(node)) {
            const assignNode = node as AssignNode;
            console.log("Procesando Assign:", assignNode);

            block = ws.newBlock("variables_set");
            block.setFieldValue(assignNode.target, "VAR");

            // Conectar el valor
            const valueBlock = createValueBlock(ws, assignNode.value);
            if (valueBlock) {
              valueBlock.initSvg();
              valueBlock.render();
              block
                .getInput("VALUE")
                ?.connection?.connect(valueBlock.outputConnection);
            }
          } else if (isIf(node)) {
            const ifNode = node as IfNode;
            console.log("Procesando If:", ifNode);

            block = ws.newBlock("controls_if");

            // Conectar condición
            const conditionBlock = createValueBlock(ws, ifNode.test);
            if (conditionBlock) {
              conditionBlock.initSvg();
              conditionBlock.render();
              block
                .getInput("IF0")
                ?.connection?.connect(conditionBlock.outputConnection);
            }

            // Procesar bloques del cuerpo
            if (ifNode.consequent && ifNode.consequent.length > 0) {
              const bodyBlocks = astToBlocks(
                ws,
                ifNode.consequent,
                startX + 30,
                startY + 50
              );
              if (bodyBlocks.length > 0) {
                const doInput = block.getInput("DO0");
                if (doInput && doInput.connection) {
                  doInput.connection.connect(bodyBlocks[0].previousConnection);
                }
              }
            }

            // Procesar else si existe
            if (ifNode.alternate && ifNode.alternate.length > 0) {
              const elseBlocks = astToBlocks(
                ws,
                ifNode.alternate,
                startX + 30,
                startY + 100
              );
              if (elseBlocks.length > 0) {
                const elseInput = block.getInput("ELSE");
                if (elseInput && elseInput.connection) {
                  elseInput.connection.connect(
                    elseBlocks[0].previousConnection
                  );
                }
              }
            }
          } else if (isWhile(node)) {
            const whileNode = node as WhileNode;
            console.log("Procesando While:", whileNode);

            block = ws.newBlock("controls_whileUntil");
            block.setFieldValue("WHILE", "MODE");

            // Conectar condición
            const conditionBlock = createValueBlock(ws, whileNode.test);
            if (conditionBlock) {
              conditionBlock.initSvg();
              conditionBlock.render();
              block
                .getInput("BOOL")
                ?.connection?.connect(conditionBlock.outputConnection);
            }

            // Procesar cuerpo
            if (whileNode.body && whileNode.body.length > 0) {
              const bodyBlocks = astToBlocks(
                ws,
                whileNode.body,
                startX + 30,
                startY + 50
              );
              if (bodyBlocks.length > 0) {
                const doInput = block.getInput("DO");
                if (doInput && doInput.connection) {
                  doInput.connection.connect(bodyBlocks[0].previousConnection);
                }
              }
            }
          } else {
            console.warn("Tipo de nodo no reconocido:", node.type);
          }

          if (block) {
            block.initSvg();
            block.render();
            block.moveBy(startX, startY + idx * 80);
            createdBlocks.push(block);
          }
        } catch (error) {
          console.error("Error creando bloque para nodo:", node, error);
        }
      });

      // Conectar bloques secuencialmente
      for (let i = 0; i < createdBlocks.length - 1; i++) {
        const currentBlock = createdBlocks[i];
        const nextBlock = createdBlocks[i + 1];

        if (currentBlock.nextConnection && nextBlock.previousConnection) {
          currentBlock.nextConnection.connect(nextBlock.previousConnection);
        }
      }

      return createdBlocks;
    },
    [createValueBlock]
  );

  useEffect(() => {
    const el = workspaceDivRef.current;
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
    if (workspaceDivRef.current && !workspaceInstance.current) {
      workspaceInstance.current = Blockly.inject(workspaceDivRef.current, {
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
      workspaceRef.current = workspaceInstance.current;

      // Restaurar bloques guardados
      const savedXml = localStorage.getItem("pikWorkspaceXml");
      if (savedXml) {
        try {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(savedXml, "text/xml");
          Blockly.Xml.domToWorkspace(
            xmlDoc.documentElement,
            workspaceInstance.current!
          );
        } catch (err) {
          console.error("❌ Error restaurando bloques:", err);
        }
      }

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
        const xml = Blockly.Xml.workspaceToDom(workspaceInstance.current!);
        const xmlText = Blockly.Xml.domToText(xml);
        localStorage.setItem("pikWorkspaceXml", xmlText);
      });
    }

    return () => {
      el?.removeEventListener("dragover", handleDragOver);
      el?.removeEventListener("drop", handleDrop);
    };
  }, [onCodeUpdate, isCodeEditable, workspaceRef]);

  // Reconstruir bloques desde pikCode en modo texto
  useEffect(() => {
    const ws = workspaceInstance.current;
    if (!ws || !isCodeEditable) return;

    console.log("Intentando convertir código a bloques:", pikCode);

    // Limpiar workspace
    ws.clear();

    // Parsear y convertir
    parsePikAst(pikCode)
      .then((ast: PikAst) => {
        console.log("AST parseado:", ast);

        if (!ast.body || !Array.isArray(ast.body)) {
          console.warn("❌ AST.body no es un arreglo válido:", ast.body);
          return;
        }

        if (ast.body.length === 0) {
          console.log("AST vacío, no hay nada que convertir");
          return;
        }

        console.log("Convirtiendo", ast.body.length, "nodos a bloques");
        const blocks = astToBlocks(ws, ast.body);
        console.log("Bloques creados:", blocks.length);
      })
      .catch((err) => {
        console.error("Error parseando PIK:", err);
      });
  }, [pikCode, isCodeEditable, astToBlocks]);

  // Efecto para deshabilitar interacciones y atenuar el workspace
  useEffect(() => {
    const el = workspaceDivRef.current;
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

      {!isCodeEditable && menuVisible && workspaceInstance.current && (
        <div
          className="
            absolute top-0 left-0 h-full w-64
            bg-white border-r shadow-lg z-20
            flex flex-col
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

      <div ref={workspaceDivRef} className="absolute inset-0" />
    </div>
  );
}
