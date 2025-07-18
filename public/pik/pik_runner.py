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

        # EJECUCIÓN CON CAPTURA DE SALIDA
        import io
        import sys
        
        # Capturar stdout
        old_stdout = sys.stdout
        sys.stdout = mystdout = io.StringIO()
        
        # Ejecutar el intérprete
        interprete = Interpreter()
        interprete.visit(arbol_sintactico)
        
        # Restaurar stdout y obtener la salida
        sys.stdout = old_stdout
        salida_completa = mystdout.getvalue()
        
        # Retornar la salida completa
        return salida_completa if salida_completa else "✅ Ejecución sin errores."
        
    except (LexicalError, SyntaxErrorPik, SemanticError, InterpreterError) as e:
        return f"ERROR EN EL CÓDIGO: {e}"
    except Exception as e:
        return f"ERROR INESPERADO: {e}"