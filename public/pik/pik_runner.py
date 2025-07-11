# pik_runner.py
__file__ = "pik_runner.py"

import sys

# 1. Importa también las nuevas excepciones
from lexer       import lexer, LexicalError
from parser      import parser, SyntaxErrorPik
from analyzer    import SemanticAnalyzer, SemanticError
from interpreter import Interpreter, InterpreterError

def run_pik(codigo: str) -> str:
    try:
        # ANÁLISIS LÉXICO + SINTÁCTICO
        arbol_sintactico = parser.parse(codigo, lexer=lexer)
        if not arbol_sintactico:
            return "ERROR EN EL CÓDIGO: el análisis sintáctico falló."

        # FASE SEMÁNTICA
        analizador = SemanticAnalyzer()
        analizador.visit(arbol_sintactico)

        # EJECUCIÓN
        salida = []
        interprete = Interpreter()

        
        import io
        old_stdout = sys.stdout
        sys.stdout = mystdout = io.StringIO()

        interprete.visit(arbol_sintactico)

        # restaurar stdout
        sys.stdout = old_stdout
        salida_str = mystdout.getvalue()

        return salida_str or "✅ Ejecución sin errores."
    # 2. Captura cada tipo de error con mensaje en español
    except (LexicalError, SyntaxErrorPik, SemanticError, InterpreterError) as e:
        return f"ERROR EN EL CÓDIGO: {e}"
    except Exception as e:
        return f"ERROR INESPERADO: {e}"