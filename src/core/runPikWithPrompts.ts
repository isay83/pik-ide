// src/core/runPikWithPrompts.ts
import Swal from "sweetalert2";
import { runPik } from "./pyodideRunner";

// 1) Capturamos indentación en grupo 1
// 2) Permitimos opcionalmente “:” al final de la línea
const QUESTION_RE =
    /^(\s*)preguntar\s+"([^"]*)"\s+guardar en\s+([a-zA-Z_]\w*)(\s*:\s*)?$/;

export async function runPikWithSweetAlerts(
    code: string
): Promise<string> {
    const lines = code.split("\n");
    const finalLines: string[] = [];

    for (const line of lines) {
        const m = QUESTION_RE.exec(line);
        if (m) {
            const [, indent, promptText, varName] = m;

            // 2) Abrimos SweetAlert2
            const { value = "" } = await Swal.fire({
                title: promptText,
                input: "text",
                inputPlaceholder: "Tu respuesta…",
                showCancelButton: false,
                confirmButtonText: "Enviar",
                backdrop: true,
                allowOutsideClick: false,
            });

            // 3) Escapamos comillas y barras
            const safe = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

            // 4) Rein yectamos con la misma indentación
            finalLines.push(`${indent}guardar "${safe}" en ${varName}`);
        } else {
            finalLines.push(line);
        }
    }

    const transformed = finalLines.join("\n");

    // debug: mira en consola qué le estás pasando realmente a Pyodide
    console.log("🔁 Código transformado:\n" + transformed);

    return runPik(transformed);
}