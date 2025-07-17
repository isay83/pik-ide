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

    const modules = [
        'lexer.py',
        'parser.py',
        'analyzer.py',
        'interpreter.py',
        'pik_runner.py',
    ];

    for (const filename of modules) {
        const name = filename.replace(/\.py$/, '');
        const src = await fetch(`/pik/${filename}`).then(r => r.text());

        const loader = `
import sys, types
mod = types.ModuleType("${name}")
mod.__file__ = "${filename}"
sys.modules["${name}"] = mod
exec(${JSON.stringify(src)}, mod.__dict__)
`;
        await py.runPythonAsync(loader);
    }

    // Reemplazar input de Python por prompt de navegador
    await py.runPythonAsync(`
import builtins
from js import window

def prompt_input(msg=""):
    response = window.prompt(msg)
    if response is None:
        raise EOFError("Input cancelled")
    return response

builtins.input = prompt_input
`);

    await py.runPythonAsync(`from pik_runner import run_pik`);

    const result = await py.runPythonAsync(`run_pik(${JSON.stringify(code)})`);

    return typeof result === 'string' ? result : String(result);
}