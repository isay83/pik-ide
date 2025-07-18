// src/core/pyodideRunner.ts
import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface;

export async function initPyodide(): Promise<PyodideInterface> {
    if (!pyodide) {
        pyodide = await loadPyodide({ indexURL: '/pyodide/' });
        await pyodide.loadPackage('ply');

        // Inyectamos un input() síncrono que use prompt nativo
        await pyodide.runPythonAsync(`
import builtins
from js import window

def prompt_input(msg=""):
    answer = window.prompt(msg)
    if answer is None:
        raise EOFError("Input cancelado")
    return str(answer)

builtins.input = prompt_input
`);
    }
    return pyodide;
}

export async function runPik(code: string): Promise<string> {
    const py = await initPyodide();

    // Carga de tus .py (lexer, parser, etc.)
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
        await py.runPythonAsync(`
import sys, types
mod = types.ModuleType("${name}")
mod.__file__ = "${filename}"
sys.modules["${name}"] = mod
exec(${JSON.stringify(src)}, mod.__dict__)
`);
    }

    // Ejecutar run_pik de forma síncrona
    const result = await py.runPythonAsync(`
from pik_runner import run_pik
run_pik(${JSON.stringify(code)})
`);

    return typeof result === 'string' ? result : String(result);
}