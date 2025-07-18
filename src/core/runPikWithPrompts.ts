// src/core/runPikWithPrompts.ts
import Swal from "sweetalert2";
import { runPik } from "./pyodideRunner";

const QUESTION_RE = /^\s*preguntar\s+"([^"]*)"\s+guardar en\s+([a-zA-Z_]\w*)\s*$/;

export async function runPikWithSweetAlerts(code: string): Promise<string> {
    const lines = code.split("\n");
    const finalLines: string[] = [];

    for (const line of lines) {
        const m = QUESTION_RE.exec(line);
        if (m) {
            const [, promptText, varName] = m;
            // 1) Abrir SweetAlert2
            const { value = "" } = await Swal.fire({
                title: promptText,
                input: "text",
                inputPlaceholder: "Escribe tu respuesta…",
                showCancelButton: false,
                confirmButtonText: "Enviar",
                backdrop: true,
                allowOutsideClick: false,
            });
            // 2) Escapar cualquier comilla
            const safe = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
            // 3) Inyectar la asignación justo aquí
            finalLines.push(`guardar "${safe}" en ${varName}`);
        } else {
            // Cualquier otra línea de PIK la dejamos intacta
            finalLines.push(line);
        }
    }

    // Unimos todo el código transformado
    const transformed = finalLines.join("\n");
    // Y lo ejecutamos en Pyodide
    return runPik(transformed);
}