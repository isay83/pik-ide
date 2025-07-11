// src/core/pyodideRunner.ts
import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | undefined;

export async function initPyodide(): Promise<PyodideInterface> {
    if (!pyodide) {
        pyodide = await loadPyodide({
            indexURL: '/pyodide/',
        });
        // Asegúrate de tener tipos para ModuleType
        await pyodide.loadPackage('ply');
    }
    return pyodide;
}

export async function runPik(code: string): Promise<string> {
    const py = await initPyodide();

    // Lista tus módulos Python
    const modules = [
        'lexer.py',
        'parser.py',
        'analyzer.py',
        'interpreter.py',
        'pik_runner.py',
    ];

    for (const filename of modules) {
        const name = filename.replace(/\.py$/, '');      // e.g. "lexer"
        const src = await fetch(`/pik/${filename}`).then(r => r.text());

        // Crea el módulo, lo registra y ejecuta su código allí
        const loader = `
import sys, types
mod = types.ModuleType("${name}")
mod.__file__ = "${filename}"
sys.modules["${name}"] = mod
exec(${JSON.stringify(src)}, mod.__dict__)
`;
        py.runPython(loader);
    }

    py.runPython(`from pik_runner import run_pik`);

    // Ahora tu paquete ya está cargado, llama a run_pik
    const result = py.runPython(`run_pik(${JSON.stringify(code)})`);

    return typeof result === 'string' ? result : String(result);
}