// src/core/pyodideRunner.ts

import { loadPyodide, type PyodideInterface } from 'pyodide'

let pyodide: PyodideInterface | undefined

/**
 * Inicializa Pyodide la primera vez y reutiliza la instancia después
 */
export async function initPyodide(): Promise<PyodideInterface> {
    if (!pyodide) {
        pyodide = await loadPyodide({
            indexURL: '/pyodide/',    // apunta a public/pyodide/
        })
    }
    return pyodide
}

/**
 * Ejecuta tu intérprete Pik completo cargando
 * lexer, parser, analyzer, interpreter y pik_runner
 */
export async function runPik(code: string): Promise<string> {
    const py = await initPyodide()

    // Lista de tus módulos Python en public/pik/
    const modules = [
        'lexer.py',
        'parser.py',
        'analyzer.py',
        'interpreter.py',
        'pik_runner.py',
    ]

    for (const name of modules) {
        const src = await fetch(`/pik/${name}`).then(r => r.text())
        py.runPython(src)
    }

    // Llama a run_pik definido en pik_runner.py
    const result = py.runPython(`run_pik(${JSON.stringify(code)})`)

    // Asegura que siempre devuelves string
    return typeof result === 'string' ? result : String(result)
}