// src/core/pyodideRunner.ts
import { loadPyodide, type PyodideInterface } from 'pyodide';

let pyodide: PyodideInterface | undefined;

export async function initPyodide(): Promise<PyodideInterface> {
    if (!pyodide) {
        pyodide = await loadPyodide({
            indexURL: '/pyodide/',
        });
        await pyodide.loadPackage('ply');
    }
    return pyodide;
}

export async function runPik(
    code: string,
    inputHandler?: (prompt: string) => Promise<string>
): Promise<string> {
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
        const name = filename.replace(/\.py$/, '');
        const src = await fetch(`/pik/${filename}`).then(r => r.text());

        const loader = `
import sys, types
mod = types.ModuleType("${name}")
mod.__file__ = "${filename}"
sys.modules["${name}"] = mod
exec(${JSON.stringify(src)}, mod.__dict__)
`;
        py.runPython(loader);
    }

    // Sistema de input que también imprime el prompt
    py.runPython(`
import builtins
import sys

def simple_input(prompt=""):
    import js
    # NO imprimir el prompt aquí, ya se maneja en el modal
    
    # Obtener la respuesta del usuario
    if hasattr(js, 'customInputHandler') and js.customInputHandler:
        result = js.customInputHandler(prompt)
    else:
        result = js.window.prompt(prompt)
    
    user_input = str(result) if result is not None else ""
    
    # NO imprimir la respuesta del usuario aquí tampoco
    
    return user_input

builtins.input = simple_input
`);

    // Configurar el handler personalizado
    if (inputHandler) {
        py.globals.set('customInputHandler', inputHandler);
    }

    py.runPython(`from pik_runner import run_pik`);

    const runPikFunc = py.globals.get('run_pik');

    try {
        const result = await runPikFunc(code);
        return typeof result === 'string' ? result : String(result);
    } finally {
        runPikFunc.destroy();
    }
}