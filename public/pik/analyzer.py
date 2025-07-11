# pik/analyzer.py

from parser import (
    ProgramaNode, MostrarNode, RepetirNode, MientrasNode, ParaNode, AsignacionNode, 
    PreguntarNode, VariableNode, NumeroNode, DecimalNode, CadenaNode, BooleanoNode, 
    OperacionBinariaNode, SiNode, FuncionNode, LlamadaFuncionNode, RetornarNode
)

class SemanticError(Exception):
    pass

class SemanticAnalyzer:
    def __init__(self):
        self.symbol_table = {}
        self.function_table = {}
        self.current_function = None

    def visit(self, node):
        if node is None:
            return
        method_name = f'visit_{type(node).__name__}'
        visitor = getattr(self, method_name, self.generic_visit)
        return visitor(node)

    def generic_visit(self, node):
        raise SemanticError(
            f"Error semántico: operación no soportada en nodo '{type(node).__name__}'"
        )


    def visit_ProgramaNode(self, node):
        try:
            for sentencia in node.sentencias:
                self.visit(sentencia)
        except SemanticError as e:
            raise SemanticError(f"Error semántico: {e}")


    def visit_AsignacionNode(self, node):
        # Si se intenta usar un nombre reservado
        if node.nombre in ('y', 'o', 'no'):
            raise SemanticError(
                f"Error Semántico: '{node.nombre}' es palabra reservada y no puede usarse como variable."
            )

        valor_tipo = self.visit(node.valor)
        self.symbol_table[node.nombre] = valor_tipo
        return valor_tipo

    def visit_PreguntarNode(self, node):
        self.visit(node.mensaje)
        # El resultado de preguntar siempre es una cadena
        self.symbol_table[node.variable] = 'cadena'
        return 'cadena'

    def visit_RepetirNode(self, node):
        tipo_de_veces = self.visit(node.veces)
        if tipo_de_veces not in ('numero', 'decimal'):
            raise SemanticError(f"Error Semántico: 'repetir' esperaba un número, pero recibió un tipo '{tipo_de_veces}'.")
        for sentencia in node.cuerpo:
            self.visit(sentencia)

    def visit_MientrasNode(self, node):
        tipo_condicion = self.visit(node.condicion)
        if tipo_condicion != 'booleano' and tipo_condicion != 'desconocido':
            raise SemanticError(f"Error Semántico: La condición de 'mientras' debe ser booleana, pero se encontró '{tipo_condicion}'.")
        for sentencia in node.cuerpo:
            self.visit(sentencia)

    def visit_ParaNode(self, node):
        tipo_inicio = self.visit(node.inicio)
        tipo_fin = self.visit(node.fin)
        if tipo_inicio not in ('numero', 'decimal') or tipo_fin not in ('numero', 'decimal'):
            raise SemanticError("Error Semántico: Los límites del ciclo 'para' deben ser números.")
        
        # La variable del ciclo es un número
        self.symbol_table[node.variable] = 'numero'
        for sentencia in node.cuerpo:
            self.visit(sentencia)
    
    def visit_SegunNode(self, node):
        # No hay un tipo fijo: la condición puede ser numero, cadena, booleano...
        # tipo_cond = self.visit(node.condicion)
        # Validación opcional: restringir tipos
        for valor_caso, bloque in node.casos:
            # chequea el tipo de cada etiqueta también si quieres
            self.visit(valor_caso)
            for sentencia in bloque:
                self.visit(sentencia)
        if node.defecto:
            for sentencia in node.defecto:
                self.visit(sentencia)

    def visit_MostrarNode(self, node):
        return self.visit(node.valor)

    def visit_SiNode(self, node):
        tipo_condicion = self.visit(node.condicion)
        if tipo_condicion != 'booleano' and tipo_condicion != 'desconocido':
            raise SemanticError(f"Error Semántico: La condición de 'si' debe ser booleana, pero se encontró '{tipo_condicion}'.")
        for sentencia in node.bloque_si:
            self.visit(sentencia)
        if node.bloque_sino:
            for sentencia in node.bloque_sino:
                self.visit(sentencia)

    def visit_FuncionNode(self, node):
        if node.nombre in self.function_table:
            raise SemanticError(f"Error Semántico: La función '{node.nombre}' ya está definida.")
        
        # Guardar el contexto actual
        old_function = self.current_function
        old_symbols = self.symbol_table.copy()
        
        # Establecer el nuevo contexto
        self.current_function = node.nombre
        self.function_table[node.nombre] = {
            'parametros': node.parametros,
            'cuerpo': node.cuerpo
        }
        
        # Agregar parámetros como variables locales
        for param in node.parametros:
            self.symbol_table[param] = 'desconocido'  # Tipo dinámico
        
        # Analizar el cuerpo de la función
        for sentencia in node.cuerpo:
            self.visit(sentencia)
        
        # Restaurar el contexto
        self.current_function = old_function
        self.symbol_table = old_symbols

    def visit_LlamadaFuncionNode(self, node):
        # built-ins
        if node.nombre in ('entero', 'decimal'):
            return 'numero'
        if node.nombre == 'texto':
            return 'cadena'
        if node.nombre == 'booleano':
            return 'booleano'

        if node.nombre not in self.function_table:
            raise SemanticError(f"Error Semántico: La función '{node.nombre}' no está definida.")
        
        func_info = self.function_table[node.nombre]
        if len(node.argumentos) != len(func_info['parametros']):
            raise SemanticError(f"Error Semántico: La función '{node.nombre}' espera {len(func_info['parametros'])} argumentos, pero recibió {len(node.argumentos)}.")
        
        # Verificar tipos de argumentos
        for arg in node.argumentos:
            self.visit(arg)
        
        return 'desconocido'  # Tipo de retorno dinámico

    def visit_RetornarNode(self, node):
        if self.current_function is None:
            raise SemanticError("Error Semántico: 'retornar' solo puede usarse dentro de una función.")
        if node.valor:
            return self.visit(node.valor)
        return None
    
    def visit_OperacionUnariaNode(self, node):
        tipo = self.visit(node.valor)
        if tipo not in ('booleano','desconocido'):
            raise SemanticError(f"Error: 'no' espera booleano, recibió '{tipo}'")
        return 'booleano'


    def visit_OperacionBinariaNode(self, node):
        tipo_izq = self.visit(node.izq)
        tipo_der = self.visit(node.der)
        op = node.op
        
        if tipo_izq == 'desconocido' or tipo_der == 'desconocido':
            return 'desconocido'  # O intenta inferir el tipo
        
        if op in ('+', '-', '*', '/'):
            if op == '+':
                # Permitir suma de números y concatenación de cadenas
                if (tipo_izq in ('numero', 'decimal') and tipo_der in ('numero', 'decimal')):
                    return 'decimal' if 'decimal' in (tipo_izq, tipo_der) else 'numero'
                elif tipo_izq == 'cadena' or tipo_der == 'cadena':
                    return 'cadena'
                else:
                    raise SemanticError(f"Error Semántico: La operación '{op}' no se puede realizar entre '{tipo_izq}' y '{tipo_der}'.")
            else:
        # Para -, *, / solo números
                if tipo_izq in ('numero', 'decimal') and tipo_der in ('numero', 'decimal'):
                    return 'decimal' if 'decimal' in (tipo_izq, tipo_der) else 'numero'
                else:
                    raise SemanticError(f"Error Semántico: La operación '{op}' solo se puede realizar entre números.")
        if op in ('==', '!=', '<', '>', '<=', '>='):
            if tipo_izq != tipo_der and not (tipo_izq in ('numero', 'decimal') and tipo_der in ('numero', 'decimal')):
                print(f"Advertencia: Comparando tipos diferentes ('{tipo_izq}' y '{tipo_der}').")
            return 'booleano'
        if node.op == 'y' or node.op == 'o':
            if tipo_izq!='booleano' or tipo_der!='booleano':
                raise SemanticError(f"Error: '{node.op}' espera booleanos")
            return 'booleano'


    def visit_VariableNode(self, node):
        nombre_variable = node.nombre
        if nombre_variable not in self.symbol_table:
            raise SemanticError(f"Error Semántico: La variable '{nombre_variable}' se usó sin haber sido definida.")
        return self.symbol_table[nombre_variable]

    def visit_NumeroNode(self, node):
        return 'numero'

    def visit_DecimalNode(self, node):
        return 'decimal'

    def visit_CadenaNode(self, node):
        return 'cadena'

    def visit_BooleanoNode(self, node):
        return 'booleano'