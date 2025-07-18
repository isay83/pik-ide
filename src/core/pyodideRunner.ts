// src/core/pyodideRunner.ts
import { loadPyodide, type PyodideInterface } from 'pyodide';
import type { PikAst } from './ast';

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
        py.runPython(loader);
    }

    py.runPython(`from pik_runner import run_pik`);
    const result = py.runPython(`run_pik(${JSON.stringify(code)})`);
    return typeof result === 'string' ? result : String(result);
}

export async function parsePikAst(code: string): Promise<PikAst> {
    const py = await initPyodide();

    // Cargar módulos
    const modules = ['lexer.py', 'parser.py', 'analyzer.py', 'interpreter.py', 'pik_runner.py'];
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

    try {
        // Debug: Primero vamos a ver qué está pasando
        const debugResult = py.runPython(`
import json
from parser import parser as ply_parser
from lexer import lexer

# Debug: Verificar tokens
print("=== TOKENS ===")
lexer.input(${JSON.stringify(code)})
tokens = []
while True:
    token = lexer.token()
    if not token:
        break
    tokens.append({"type": token.type, "value": token.value})
    print(f"Token: {token.type} = {token.value}")

print("\\n=== PARSING ===")
try:
    ast_root = ply_parser.parse(${JSON.stringify(code)}, lexer=lexer)
    print(f"AST Root: {ast_root}")
    print(f"AST Type: {type(ast_root)}")
    
    if hasattr(ast_root, '__dict__'):
        print(f"AST Dict: {ast_root.__dict__}")
    
    # Convertir a dict recursivamente
    def node_to_dict(node):
        if node is None:
            return None
        if isinstance(node, (str, int, float, bool)):
            return node
        if isinstance(node, list):
            return [node_to_dict(item) for item in node]
        
        result = {}
        if hasattr(node, 'type'):
            result['type'] = node.type
        
        # Obtener todos los atributos del nodo
        for attr_name in dir(node):
            if not attr_name.startswith('_'):
                attr_value = getattr(node, attr_name)
                if not callable(attr_value):
                    result[attr_name] = node_to_dict(attr_value)
        
        return result
    
    # Convertir AST
    ast_dict = node_to_dict(ast_root)
    print(f"AST Dict: {ast_dict}")
    
    # Crear estructura final
    if isinstance(ast_dict, list):
        final_ast = {"body": ast_dict}
    elif isinstance(ast_dict, dict) and "body" in ast_dict:
        final_ast = ast_dict
    elif isinstance(ast_dict, dict):
        # Si es un nodo único, envolvemos en body
        final_ast = {"body": [ast_dict]}
    else:
        final_ast = {"body": []}
    
    print(f"Final AST: {final_ast}")
    json.dumps(final_ast, ensure_ascii=False)
    
except Exception as e:
    print(f"Parse error: {e}")
    import traceback
    traceback.print_exc()
    json.dumps({"body": []}, ensure_ascii=False)
`);

        console.log("Debug parsing result:", debugResult);
        return JSON.parse(debugResult) as PikAst;

    } catch (e) {
        console.error("Error en parsePikAst:", e);
        return { body: [] };
    }
}