# pik/interpreter.py

# Importamos los nodos correctos, incluyendo el nuevo OperacionBinariaNode
from parser import (
    ProgramaNode, MostrarNode, RepetirNode, AsignacionNode, PreguntarNode,
    VariableNode, NumeroNode, CadenaNode, BooleanoNode, OperacionBinariaNode, SiNode,
    MientrasNode, ParaNode, FuncionNode, LlamadaFuncionNode, RetornarNode, DecimalNode  # Agregamos los faltantes
)
import codecs

class InterpreterError(Exception):
    pass

# Función auxiliar para determinar el tipo de valor
def _tipo_valor(val):
    if isinstance(val, bool):       
        return 'booleano'
    if isinstance(val, (int, float)): 
        return 'numero'
    if isinstance(val, str):        
        return 'cadena'
    return type(val).__name__

# Agregar esta clase al inicio del archivo, después de los imports
class ReturnException(Exception):
    def __init__(self, value):
        self.value = value

class Interpreter:
    def __init__(self):
        self.symbol_table = {}

    def visit(self, node):
        method_name = f'visit_{type(node).__name__}'
        visitor = getattr(self, method_name, self.generic_visit)
        return visitor(node)

    def generic_visit(self, node):
        raise InterpreterError(
            f"Error de ejecución: nodo no soportado '{type(node).__name__}'"
        )


    # --- MÉTODOS DE VISITA CORREGIDOS Y COMPLETOS ---

    def visit_ProgramaNode(self, node):
        if node and node.sentencias:
            for sentencia in node.sentencias:
                self.visit(sentencia)

    def visit_MostrarNode(self, node):
        valor = self.visit(node.valor)
        # Traducir booleans de Python a español
        if isinstance(valor, bool):
            valor = 'Verdadero' if valor else 'Falso'
        print(valor, end='')

    def visit_RepetirNode(self, node):
        veces = self.visit(node.veces)
        try:
            num_veces = int(veces)
        except (ValueError, TypeError):
             raise TypeError(f"Error Semántico: El comando 'repetir' esperaba un número, pero recibió '{veces}'.")
        for _ in range(num_veces):
            for sentencia in node.cuerpo:
                self.visit(sentencia)

    def visit_AsignacionNode(self, node):
        nombre_variable = node.nombre
        valor = self.visit(node.valor)
        self.symbol_table[nombre_variable] = valor

    def visit_PreguntarNode(self, node):
        mensaje = self.visit(node.mensaje)
        raw = input(mensaje)

        # 1) ¿Es entero?
        if raw.isdigit():
            valor = int(raw)

        else:
            # 2) ¿Es decimal?
            try:
                valor = float(raw)
            except ValueError:
                # 3) ¿Es booleano?
                low = raw.lower()
                if low in ('verdadero', 'sí'):
                    valor = True
                elif low in ('falso', 'no'):
                    valor = False
                else:
                    # 4) si no, se queda texto
                    valor = raw

        self.symbol_table[node.variable] = valor

    def visit_NumeroNode(self, node):
        return node.valor

    def visit_CadenaNode(self, node):
        texto_crudo = node.valor[1:-1]
        texto_interpretado = texto_crudo.replace('\\n', '\n').replace('\\t', '\t')
        return texto_interpretado

    def visit_VariableNode(self, node):
        nombre_variable = node.nombre
        valor = self.symbol_table.get(nombre_variable)
        if valor is None:
            raise NameError(f"Error: La variable '{nombre_variable}' no ha sido definida.")
        return valor

    def visit_BooleanoNode(self, node):
        return node.valor # es True o False
        # return 'Verdadero' if node.valor else 'Falso'


    def visit_SiNode(self, node):
        if self.visit(node.condicion):
            for sentencia in node.bloque_si:
                self.visit(sentencia)
        elif node.bloque_sino:
            for sentencia in node.bloque_sino:
                self.visit(sentencia)
                
    def visit_OperacionUnariaNode(self, node):
        v = self.visit(node.valor)
        return not v

    def visit_OperacionBinariaNode(self, node):
        valor_izq = self.visit(node.izq)
        valor_der = self.visit(node.der)
        op = node.op

        try:
            if op == '+':
                if isinstance(valor_izq, str) or isinstance(valor_der, str):
                    return str(valor_izq) + str(valor_der)
                return valor_izq + valor_der

            if op == '-':
                return valor_izq - valor_der

            if op == '*':
                return valor_izq * valor_der

            if op == '/':
                if valor_der == 0:
                    raise ZeroDivisionError("Error: No se puede dividir por cero.")
                return valor_izq / valor_der

            if op == '==':
                return valor_izq == valor_der

            if op == '!=':
                return valor_izq != valor_der

            if op == '<':
                return valor_izq < valor_der

            if op == '>':
                return valor_izq > valor_der

            if op == '<=':
                return valor_izq <= valor_der

            if op == '>=':
                return valor_izq >= valor_der

            if op == 'y':
                return bool(valor_izq) and bool(valor_der)

            if op == 'o':
                return bool(valor_izq) or bool(valor_der)

        except TypeError:
            t1 = _tipo_valor(valor_izq)
            t2 = _tipo_valor(valor_der)
            raise InterpreterError(
                f"Error de ejecución: operación '{op}' inválida entre tipos '{t1}' y '{t2}'"
            )
       

    def visit_DecimalNode(self, node):
        return node.valor

    def visit_MientrasNode(self, node):
        while self.visit(node.condicion):
            for sentencia in node.cuerpo:
                self.visit(sentencia)

    def visit_ParaNode(self, node):
        inicio = int(self.visit(node.inicio))
        fin = int(self.visit(node.fin))
        for i in range(inicio, fin + 1):
            self.symbol_table[node.variable] = i
            for sentencia in node.cuerpo:
                self.visit(sentencia)
    
    def visit_SegunNode(self, node):
        test = self.visit(node.condicion)
        # 1. revisar cada caso
        for valor_caso, bloque in node.casos:
            etiqueta = self.visit(valor_caso)
            if test == etiqueta:
                for sentencia in bloque:
                    self.visit(sentencia)
                return   # rompe al primer caso que coincide
        # 2. si no hubo match, ejecutar defecto
        if node.defecto:
            for sentencia in node.defecto:
                self.visit(sentencia)

    def visit_FuncionNode(self, node):
        # Las funciones se almacenan como objetos ejecutables
        self.symbol_table[node.nombre] = {
            'tipo': 'funcion',
            'parametros': node.parametros,
            'cuerpo': node.cuerpo
        }

    def visit_LlamadaFuncionNode(self, node):
        # --- BUILT-INS DE CONVERSIÓN ---
        if node.nombre == 'entero' and len(node.argumentos) == 1:
            return int(self.visit(node.argumentos[0]))

        if node.nombre == 'decimal' and len(node.argumentos) == 1:
            return float(self.visit(node.argumentos[0]))

        if node.nombre == 'texto' and len(node.argumentos) == 1:
            val = self.visit(node.argumentos[0])
            if isinstance(val, bool):
                return 'Verdadero' if val else 'Falso'
            return str(val)

        if node.nombre == 'booleano' and len(node.argumentos) == 1:
            val = self.visit(node.argumentos[0])
            if isinstance(val, bool):
                return val
            if isinstance(val, (int, float)):
                return val != 0
            low = str(val).lower()
            if low in ('verdadero', 'sí'):
                return True
            if low in ('falso', 'no'):
                return False
            # si no se reconoce, lanzar error:
            raise ValueError(f"Error de conversión a booleano: '{val}' no es un valor válido")
        # --- resto de código para funciones definidas por el usuario ---
        if node.nombre not in self.symbol_table:
            raise NameError(f"Error: La función '{node.nombre}' no está definida.")
        
        funcion = self.symbol_table[node.nombre]
        if funcion.get('tipo') != 'funcion':
            raise TypeError(f"Error: '{node.nombre}' no es una función.")
        
        # Evaluar argumentos
        argumentos = [self.visit(arg) for arg in node.argumentos]
        
        # Guardar contexto actual
        contexto_anterior = self.symbol_table.copy()
        
        # Crear contexto local con parámetros
        for i, param in enumerate(funcion['parametros']):
            if i < len(argumentos):
                self.symbol_table[param] = argumentos[i]
        
        # Ejecutar cuerpo de la función
        resultado = None
        try:
            for sentencia in funcion['cuerpo']:
                if isinstance(sentencia, RetornarNode):
                    resultado = self.visit(sentencia.valor) if sentencia.valor else None
                    break
                self.visit(sentencia)
        except ReturnException as e:
            resultado = e.value
        finally:
            # Restaurar contexto
            self.symbol_table = contexto_anterior
        
        return resultado

    def visit_RetornarNode(self, node):
        valor = self.visit(node.valor) if node.valor else None
        raise ReturnException(valor)