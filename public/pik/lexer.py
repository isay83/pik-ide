# pik/lexer.py

import ply.lex as lex
import re
import math

class LexicalError(Exception):
    pass

# --- 1. Definición de Tokens y Palabras Reservadas ---
reserved = {
    'mostrar': 'MOSTRAR',
    'preguntar': 'PREGUNTAR',  
    'guardar': 'GUARDAR', 'en': 'EN', 
    'repetir': 'REPETIR', 'veces': 'VECES', 
    'si': 'SI', 'sino': 'SINO',
    'colorear': 'COLOREAR', 'mover': 'MOVER', 'esperar': 'ESPERAR', 
    'funcion': 'FUNCION', 'retornar': 'RETORNAR', 
    'limpiar': 'LIMPIAR',
    'mientras': 'MIENTRAS', 
    'para': 'PARA', 'desde': 'DESDE', 'hasta': 'HASTA',
    'segun': 'SEGUN', 'caso': 'CASO', 'defecto': 'DEFECTO',
    'y': 'Y', 'o': 'O', 'no': 'NO',
}

tokens = [
    'IDENTIFICADOR', 'NUMERO', 'DECIMAL', 'CADENA', 'BOOLEANO', 'CONSTANTE',
    'SUMA', 'RESTA', 'MULTIPLICACION', 'DIVISION',
    'IGUAL_A', 'DIFERENTE_DE', 'MENOR_IGUAL', 'MAYOR_IGUAL',
    'IGUAL', 'MENOR', 'MAYOR',
    'DOS_PUNTOS', 'PARENTESIS_ABRE', 'PARENTESIS_CIERRA',
    'COMA', 'LLAVE_ABRE', 'LLAVE_CIERRA',
    'NEWLINE', 'INDENT', 'DEDENT'
] + list(reserved.values())

# Constantes predefinidas
constants = {
    'pi': math.pi,
    'e': math.e
}

# --- 2. Reglas del Lexer ---
# Ignorar comentarios de bloque y de línea ANTES de procesar otras reglas
def t_ignore_COMMENT_BLOCK(t):
    r'/\*(.|\n)*?\*/'
    t.lexer.lineno += t.value.count('\n')

def t_ignore_COMMENT_LINE(t):
    r'//.*'
    pass
# Tokens simples
t_SUMA = r'\+'
t_RESTA = r'-'
t_MULTIPLICACION = r'\*'
t_DIVISION = r'/'
t_IGUAL_A = r'=='
t_DIFERENTE_DE = r'!='
t_MENOR_IGUAL = r'<='
t_MAYOR_IGUAL = r'>='
t_MENOR = r'<'
t_MAYOR = r'>'
t_IGUAL = r'='
t_DOS_PUNTOS = r':'
t_PARENTESIS_ABRE = r'\('
t_PARENTESIS_CIERRA = r'\)'
t_COMA = r','
t_LLAVE_ABRE = r'\{'
t_LLAVE_CIERRA = r'\}'


def t_CADENA(t):
    r'"([^"\\]|\\.)*"'
    return t

# Ignorar espacios y tabs que no afectan la indentación
t_ignore = ' \t'

# Números decimales deben ir ANTES que números enteros
def t_DECIMAL(t):
    r'\d+\.\d+'
    t.value = float(t.value)
    return t

def t_NUMERO(t):
    r'\d+'
    t.value = int(t.value)
    return t

def t_BOOLEANO(t):
    r'(verdadero|falso)'
    v = t.value.lower()
    t.value = True if v in ('verdadero') else False
    return t

def t_IDENTIFICADOR(t):
    r'[a-zA-ZáéíóúÁÉÍÓÚñÑ_][a-zA-ZáéíóúÁÉÍÓÚñÑ0-9_]*'
    raw = t.value
    key = raw.lower()
    
    # Verificar si es una palabra reservada
    if key in reserved:
        t.type = reserved[key]
        return t
    
    # Verificar si es una constante
    if raw in constants:
        t.type = 'CONSTANTE'
        return t
    
    # Si no es ni reservada ni constante, es un identificador
    t.type = 'IDENTIFICADOR'
    return t

def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

def t_error(t):
    raise LexicalError(
        f"Error léxico: carácter inesperado '{t.value[0]}' en línea {t.lineno}"
    )

# --- 3. Envoltura del Lexer para Manejar la Indentación ---
class IndentedLexer(object):
    def __init__(self, lexer):
        self.lexer = lexer
        self.tokens = []
        self.current_index = 0

    def input(self, s, **kwargs):
        # 1. Quitar comentarios de bloque y conservar saltos de línea
        def _blk_replacer(m):
            texto = m.group(0)
            return "\n" * texto.count("\n")
        s = re.sub(r'/\*(.|\n)*?\*/', _blk_replacer, s)

        # 2. Quitar comentarios de línea
        s = re.sub(r'//.*', '', s)

        # 3. Inicializar buffer y hacer tokenización con indentación
        self.tokens = []
        self.current_index = 0
        self._tokenize_with_indentation(s)


    def token(self):
        if self.current_index < len(self.tokens):
            tok = self.tokens[self.current_index]
            self.current_index += 1
            return tok
        return None

    def _tokenize_with_indentation(self, data):
        lines = data.split('\n')
        indent_stack = [0]
        
        for line_num, line in enumerate(lines, 1):
            # Saltar líneas vacías o solo con espacios
            if not line.strip():
                continue
            
            # Calcular indentación
            stripped_line = line.lstrip()
            indent_level = len(line) - len(stripped_line)
            
            # Manejar indentación
            if indent_level > indent_stack[-1]:
                indent_stack.append(indent_level)
                self._add_token('INDENT', line_num)
            elif indent_level < indent_stack[-1]:
                while indent_stack and indent_level < indent_stack[-1]:
                    indent_stack.pop()
                    self._add_token('DEDENT', line_num)
                if indent_stack and indent_level != indent_stack[-1]:
                    raise IndentationError(f"Indentación inconsistente en línea {line_num}")
            
            # Tokenizar el contenido de la línea
            self.lexer.input(stripped_line)
            
            while True:
                tok = self.lexer.token()
                if not tok:
                    break
                tok.lineno = line_num
                self.tokens.append(tok)
            
            # Agregar NEWLINE al final de cada línea con contenido
            self._add_token('NEWLINE', line_num)
        
        # Cerrar todos los bloques de indentación al final
        while len(indent_stack) > 1:
            indent_stack.pop()
            self._add_token('DEDENT', len(lines))

    def _add_token(self, token_type, lineno):
        tok = lex.LexToken()
        tok.type = token_type
        tok.value = None
        tok.lineno = lineno
        tok.lexpos = 0
        self.tokens.append(tok)

# Crear el lexer
base_lexer = lex.lex(reflags=re.IGNORECASE, optimize=True)
lexer = IndentedLexer(base_lexer)