# pik/parser.py

import ply.yacc as yacc
from .lexer import tokens

class SyntaxErrorPik(Exception):
    pass

# --- PRECEDENCIA DE OPERADORES ---
precedence = (
    ('right', 'NO'),
    ('left', 'Y', 'O'),
    ('left', 'IGUAL_A', 'DIFERENTE_DE', 'MENOR', 'MAYOR', 'MENOR_IGUAL', 'MAYOR_IGUAL'),
    ('left', 'SUMA', 'RESTA'),
    ('left', 'MULTIPLICACION', 'DIVISION'),
)

# --- Clases de Nodos AST ---
class ProgramaNode:
    def __init__(self, sentencias): self.sentencias = sentencias
    def __repr__(self): return f"ProgramaNode({self.sentencias})"

class MostrarNode:
    def __init__(self, valor): self.valor = valor
    def __repr__(self): return f"MostrarNode({self.valor})"

class RepetirNode:
    def __init__(self, veces, cuerpo): self.veces = veces; self.cuerpo = cuerpo
    def __repr__(self): return f"RepetirNode(veces={self.veces}, cuerpo={self.cuerpo})"

class MientrasNode:
    def __init__(self, condicion, cuerpo): self.condicion = condicion; self.cuerpo = cuerpo
    def __repr__(self): return f"MientrasNode(condicion={self.condicion}, cuerpo={self.cuerpo})"

class ParaNode:
    def __init__(self, variable, inicio, fin, cuerpo): 
        self.variable = variable; self.inicio = inicio; self.fin = fin; self.cuerpo = cuerpo
    def __repr__(self): return f"ParaNode(var={self.variable}, inicio={self.inicio}, fin={self.fin}, cuerpo={self.cuerpo})"

class SegunNode:
    def __init__(self, condicion, casos, defecto=None):
        # casos: lista de tuplas (valor_caso, bloque_sentencias)
        self.condicion = condicion
        self.casos = casos
        self.defecto = defecto
    def __repr__(self):
        return (f"SegunNode(cond={self.condicion}, "
                f"casos={self.casos}, defecto={self.defecto})")
class AsignacionNode:
    def __init__(self, nombre, valor): self.nombre = nombre; self.valor = valor
    def __repr__(self): return f"AsignacionNode(nombre='{self.nombre}', valor={self.valor})"

class VariableNode:
    def __init__(self, nombre): self.nombre = nombre
    def __repr__(self): return f"VariableNode(nombre='{self.nombre}')"

class PreguntarNode:
    def __init__(self, mensaje, variable): self.mensaje = mensaje; self.variable = variable
    def __repr__(self): return f"PreguntarNode(mensaje={self.mensaje}, variable='{self.variable}')"

class NumeroNode:
    def __init__(self, valor): self.valor = valor
    def __repr__(self): return f"NumeroNode({self.valor})"

class DecimalNode:
    def __init__(self, valor): self.valor = valor
    def __repr__(self): return f"DecimalNode({self.valor})"

class CadenaNode:
    def __init__(self, valor): self.valor = valor
    def __repr__(self): return f"CadenaNode({self.valor})"

class BooleanoNode:
    def __init__(self, valor): self.valor = valor
    def __repr__(self): return f"BooleanoNode({self.valor})"

class OperacionBinariaNode:
    def __init__(self, op, izq, der): self.op = op; self.izq = izq; self.der = der
    def __repr__(self): return f"OperacionBinariaNode(op='{self.op}', izq={self.izq}, der={self.der})"

class OperacionUnariaNode:
    def __init__(self, op, valor):
        self.op = op
        self.valor = valor
    def __repr__(self):
        return f"OperacionUnariaNode(op='{self.op}', valor={self.valor})"

class SiNode:
    def __init__(self, condicion, bloque_si, bloque_sino=None):
        self.condicion = condicion; self.bloque_si = bloque_si; self.bloque_sino = bloque_sino
    def __repr__(self): return f"SiNode(condicion={self.condicion}, si={self.bloque_si}, sino={self.bloque_sino})"

class FuncionNode:
    def __init__(self, nombre, parametros, cuerpo):
        self.nombre = nombre; self.parametros = parametros; self.cuerpo = cuerpo
    def __repr__(self): return f"FuncionNode(nombre='{self.nombre}', params={self.parametros}, cuerpo={self.cuerpo})"

class LlamadaFuncionNode:
    def __init__(self, nombre, argumentos):
        self.nombre = nombre; self.argumentos = argumentos
    def __repr__(self): return f"LlamadaFuncionNode(nombre='{self.nombre}', args={self.argumentos})"

class RetornarNode:
    def __init__(self, valor): self.valor = valor
    def __repr__(self): return f"RetornarNode({self.valor})"

# --- Definición de la Gramática ---
def p_programa(p):
    '''programa : sentencias'''
    p[0] = ProgramaNode(p[1])

def p_sentencias(p):
    '''sentencias : sentencias sentencia
                  | sentencia'''
    if len(p) == 2:
        p[0] = [p[1]] if p[1] is not None else []
    else:
        p[0] = p[1]
        if p[2] is not None:
            p[0].append(p[2])

def p_sentencia(p):
    '''sentencia : instruccion NEWLINE
                 | instruccion
                 | NEWLINE'''
    if len(p) == 2:
        p[0] = p[1] if p[1] != '\n' else None
    else:
        p[0] = p[1]

def p_instruccion(p):
    '''instruccion : asignacion_sentencia
                   | preguntar_sentencia
                   | mostrar_sentencia
                   | repetir_sentencia
                   | mientras_sentencia
                   | para_sentencia
                   | si_sentencia
                   | funcion_sentencia
                   | retornar_sentencia
                   | llamada_funcion
                   | segun_sentencia'''
    p[0] = p[1]

def p_asignacion_sentencia(p):
    '''asignacion_sentencia : GUARDAR expresion EN IDENTIFICADOR'''
    p[0] = AsignacionNode(nombre=p[4], valor=p[2])

def p_preguntar_sentencia(p):
    '''preguntar_sentencia : PREGUNTAR expresion GUARDAR EN IDENTIFICADOR'''
    p[0] = PreguntarNode(mensaje=p[2], variable=p[5])

def p_mostrar_sentencia(p):
    '''mostrar_sentencia : MOSTRAR expresion'''
    p[0] = MostrarNode(p[2])

def p_repetir_sentencia(p):
    '''repetir_sentencia : REPETIR expresion VECES DOS_PUNTOS NEWLINE INDENT sentencias DEDENT'''
    p[0] = RepetirNode(p[2], p[7])

def p_mientras_sentencia(p):
    '''mientras_sentencia : MIENTRAS expresion DOS_PUNTOS NEWLINE INDENT sentencias DEDENT'''
    p[0] = MientrasNode(p[2], p[6])

def p_para_sentencia(p):
    '''para_sentencia : PARA IDENTIFICADOR DESDE expresion HASTA expresion DOS_PUNTOS NEWLINE INDENT sentencias DEDENT'''
    p[0] = ParaNode(p[2], p[4], p[6], p[10])
    
def p_lista_casos(p):
    '''lista_casos : lista_casos caso_item
                  | caso_item'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[2]]

def p_caso_item(p):
    '''caso_item : CASO expresion DOS_PUNTOS NEWLINE INDENT sentencias DEDENT'''
    # p[2] es el valor de la etiqueta, p[6] el bloque de sentencias
    p[0] = (p[2], p[6])

def p_defecto_opt(p):
    '''defecto_opt : DEFECTO DOS_PUNTOS NEWLINE INDENT sentencias DEDENT
                  | empty'''
    if len(p) == 2:
        p[0] = None
    else:
        p[0] = p[5]

def p_segun_sentencia(p):
    '''segun_sentencia : SEGUN expresion DOS_PUNTOS NEWLINE INDENT lista_casos defecto_opt DEDENT'''
    condicion = p[2]
    casos     = p[6]
    defecto   = p[7]
    p[0] = SegunNode(condicion, casos, defecto)

def p_si_sentencia(p):
    '''si_sentencia : SI expresion DOS_PUNTOS NEWLINE INDENT sentencias DEDENT
                    | SI expresion DOS_PUNTOS NEWLINE INDENT sentencias DEDENT SINO DOS_PUNTOS NEWLINE INDENT sentencias DEDENT'''
    if len(p) == 8:
        p[0] = SiNode(condicion=p[2], bloque_si=p[6])
    else:
        p[0] = SiNode(condicion=p[2], bloque_si=p[6], bloque_sino=p[12])

def p_funcion_sentencia(p):
    '''funcion_sentencia : FUNCION IDENTIFICADOR PARENTESIS_ABRE lista_parametros PARENTESIS_CIERRA DOS_PUNTOS NEWLINE INDENT sentencias DEDENT
                        | FUNCION IDENTIFICADOR PARENTESIS_ABRE PARENTESIS_CIERRA DOS_PUNTOS NEWLINE INDENT sentencias DEDENT'''
    if len(p) == 11:
        p[0] = FuncionNode(p[2], p[4], p[9])
    else:
        p[0] = FuncionNode(p[2], [], p[8])

def p_lista_parametros(p):
    '''lista_parametros : lista_parametros COMA IDENTIFICADOR
                        | IDENTIFICADOR'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[3]]

def p_retornar_sentencia(p):
    '''retornar_sentencia : RETORNAR expresion
                          | RETORNAR'''
    if len(p) == 3:
        p[0] = RetornarNode(p[2])
    else:
        p[0] = RetornarNode(None)

def p_llamada_funcion(p):
    '''llamada_funcion : IDENTIFICADOR PARENTESIS_ABRE lista_argumentos PARENTESIS_CIERRA
                       | IDENTIFICADOR PARENTESIS_ABRE PARENTESIS_CIERRA'''
    if len(p) == 5:
        p[0] = LlamadaFuncionNode(p[1], p[3])
    else:
        p[0] = LlamadaFuncionNode(p[1], [])

def p_lista_argumentos(p):
    '''lista_argumentos : lista_argumentos COMA expresion
                        | expresion'''
    if len(p) == 2:
        p[0] = [p[1]]
    else:
        p[0] = p[1] + [p[3]]
        
def p_expresion_unaria(p):
    'expresion : NO expresion'
    p[0] = OperacionUnariaNode(op='no', valor=p[2])

def p_expresion_logica(p):
    '''expresion : expresion Y expresion
                 | expresion O expresion'''
    p[0] = OperacionBinariaNode(op=p[2], izq=p[1], der=p[3])

def p_expresion(p):
    '''expresion : expresion SUMA expresion
                 | expresion RESTA expresion
                 | expresion MULTIPLICACION expresion
                 | expresion DIVISION expresion
                 | expresion IGUAL_A expresion
                 | expresion DIFERENTE_DE expresion
                 | expresion MENOR expresion
                 | expresion MAYOR expresion
                 | expresion MENOR_IGUAL expresion
                 | expresion MAYOR_IGUAL expresion
                 | PARENTESIS_ABRE expresion PARENTESIS_CIERRA
                 | NUMERO
                 | DECIMAL
                 | CADENA
                 | BOOLEANO
                 | IDENTIFICADOR
                 | llamada_funcion'''
    if len(p) == 4:
        if p[2] in ('+', '-', '*', '/', '==', '!=', '<', '>', '<=', '>='):
            p[0] = OperacionBinariaNode(op=p[2], izq=p[1], der=p[3])
        else:  # Paréntesis
            p[0] = p[2]
    else:
        if p.slice[1].type == 'NUMERO':
            p[0] = NumeroNode(p[1])
        elif p.slice[1].type == 'DECIMAL':
            p[0] = DecimalNode(p[1])
        elif p.slice[1].type == 'CADENA':
            p[0] = CadenaNode(p[1])
        elif p.slice[1].type == 'BOOLEANO':
            p[0] = BooleanoNode(p[1]) 
        elif p.slice[1].type == 'IDENTIFICADOR':
            p[0] = VariableNode(p[1])
        else:
            p[0] = p[1]  # Para llamadas de función

def p_empty(p):
    '''empty :'''
    pass

def p_error(p):
    if p:
        raise SyntaxErrorPik(
            f"Error de sintaxis: token inesperado '{p.value}' en línea {p.lineno}"
        )
    else:
        raise SyntaxErrorPik(
            "Error de sintaxis: fin de archivo inesperado"
        )
# --- Construcción del Parser ---

parser = yacc.yacc()