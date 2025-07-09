# pik_runner.py
import sys

if sys.platform == "win32":
    try:
        import ctypes
        ctypes.windll.kernel32.SetConsoleOutputCP(65001)
        ctypes.windll.kernel32.SetConsoleCP(65001)
    except Exception:
        print("Advertencia: No se pudo forzar la codificación UTF-8 en la consola.")

# 1. Importa también las nuevas excepciones
from lexer       import lexer, LexicalError
from parser      import parser, SyntaxErrorPik
from analyzer    import SemanticAnalyzer, SemanticError
from interpreter import Interpreter, InterpreterError

def main(ruta_archivo):
    try:
        with open(ruta_archivo, 'r', encoding='utf-8') as f:
            codigo = f.read()

        # ANÁLISIS LÉXICO + SINTÁCTICO
        arbol_sintactico = parser.parse(codigo, lexer=lexer)
        if not arbol_sintactico:
            print("ERROR EN EL CÓDIGO: el análisis sintáctico falló.")
            return

        # FASE SEMÁNTICA
        analizador = SemanticAnalyzer()
        analizador.visit(arbol_sintactico)

        # EJECUCIÓN
        print(f"--- Ejecutando '{ruta_archivo}' ---")
        interprete = Interpreter()
        interprete.visit(arbol_sintactico)
        print(f"\n--- Ejecución finalizada ---")

    # 2. Captura cada tipo de error con mensaje en español
    except FileNotFoundError:
        print(f"\nERROR EN EL CÓDIGO: el archivo '{ruta_archivo}' no fue encontrado.")
    except (LexicalError, SyntaxErrorPik) as e:
        print(f"\nERROR EN EL CÓDIGO: {e}")
    except SemanticError as e:
        print(f"\nERROR EN EL CÓDIGO: {e}")
    except InterpreterError as e:
        print(f"\nERROR EN EL CÓDIGO: {e}")
    except Exception as e:
        # Error universal de último recurso
        print(f"\nERROR EN EL CÓDIGO: se produjo un error inesperado: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        main(sys.argv[1])
    else:
        print("Uso: python pik_runner.py <ruta_del_archivo.pik>")