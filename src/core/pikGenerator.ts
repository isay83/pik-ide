import * as Blockly from 'blockly'
// cSpell:ignore operadores comparadores

// Definimos nuestras propias precedencias y sangría
const ORDER_NONE = 0
//const ORDER_ATOMIC = 1
const INDENT = '  '  // dos espacios para sangrar bloques anidados

// Función utilitaria para concatenar el siguiente bloque
function appendNext(block: Blockly.Block): string {
  const next = block.getNextBlock();
  const nextCode = PikGenerator.blockToCode(next);
  return (Array.isArray(nextCode) ? nextCode[0] : nextCode || '');
}

// Interfaz con la firma exacta de cada método
interface PikBlockGenerator {
    // Acciones de Pik
    mostrar(block: Blockly.Block): string
    guardar(block: Blockly.Block): string
    preguntar(block: Blockly.Block): string
    // Tipos de datos
    numero(block: Blockly.Block): [string, number]
    texto(block: Blockly.Block): [string, number]
    booleano_valor(block: Blockly.Block): [string, number]
    // Variables y constantes
    variable(block: Blockly.Block): [string, number]
    // Símbolos
    comentario(block: Blockly.Block): string
    texto_multilinea(block: Blockly.Block): [string, number]
    comentario_bloque(block: Blockly.Block): string
    parentesis(block: Blockly.Block): [string, number]
    salto_linea(): [string, number]
    tab(): [string, number]
    // Operaciones y comparaciones
    operacion(block: Blockly.Block): [string, number]
    comparacion(block: Blockly.Block): [string, number]
    // Operadores lógicos
    y(block: Blockly.Block): [string, number]
    o(block: Blockly.Block): [string, number]
    no(block: Blockly.Block): [string, number]
    // Estructuras de control
    si(block: Blockly.Block): string
    para(block: Blockly.Block): string
    repetir(block: Blockly.Block): string
    mientras(block: Blockly.Block): string
    segun(block: Blockly.Block): string
    caso(block: Blockly.Block): string
    // Convertidores de tipos
    entero(block: Blockly.Block): [string, number]
    decimal(block: Blockly.Block): [string, number]
    texto_convertido(block: Blockly.Block): [string, number]
    booleano(block: Blockly.Block): [string, number]
    // Funciones
    funcion(block: Blockly.Block): string
    retornar(block: Blockly.Block): string
    llamar_funcion(block: Blockly.Block): [string, number]
}

// operación aritmética
const operadores = {
    SUMA: '+',
    RESTA: '-',
    MULTIPLICACION: '*',
    DIVISION: '/',
} as const
type OperadorKey = keyof typeof operadores

// comparación
const comparadores = {
    IGUAL: '==',
    DIFERENTE: '!=',
    MAYOR: '>',
    MENOR: '<',
    MAYOR_IGUAL: '>=',
    MENOR_IGUAL: '<=',
} as const
type ComparadorKey = keyof typeof comparadores

// Creamos la instancia y la casteamos a nuestra interfaz
export const PikGenerator = new Blockly.Generator('Pik') as Blockly.Generator & PikBlockGenerator

// Bloques de código

// =================== ACCIONES DE PIK =============================
// MOSTRAR
PikGenerator.mostrar = block => {
  const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '""';
  return `mostrar ${val}\n` + appendNext(block);
}
PikGenerator.forBlock['mostrar'] = PikGenerator.mostrar
// GUARDAR
PikGenerator.guardar = block => {
  const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '0';
  const name = block.getField('VAR')?.getText() || 'item';
  return `guardar ${val} en ${name}\n` + appendNext(block);
}
PikGenerator.forBlock['guardar'] = PikGenerator.guardar
// PREGUNTAR
PikGenerator.preguntar = block => {
  const question = PikGenerator.valueToCode(block, 'PREGUNTA', ORDER_NONE) || '""';
  const variable = block.getField('VAR')?.getText() || 'item';
  return `preguntar ${question} guardar en ${variable}\n` + appendNext(block);
}
PikGenerator.forBlock['preguntar'] = PikGenerator.preguntar

// =================== TIPOS DE DATOS =============================
// NÚMERO
PikGenerator.numero = block => {
    const n = block.getFieldValue('NUM') || '0'
    return [n, ORDER_NONE]
}
PikGenerator.forBlock['numero'] = PikGenerator.numero
// TEXTO
PikGenerator.texto = block => {
    const t = block.getFieldValue('TEXT') || ''
    return [`"${t}"`, ORDER_NONE]
}
PikGenerator.forBlock['texto'] = PikGenerator.texto
// BOOLEANO LITERAL
PikGenerator.booleano_valor = block => {
    const b = block.getFieldValue("BOOL")
    return [b, ORDER_NONE]
}
PikGenerator.forBlock["booleano_valor"] = PikGenerator.booleano_valor

// =================== VARIABLES Y CONSTANTES =============================
// VARIABLES
PikGenerator.variable = block => {
    const name = block.getField("VAR")?.getText() || "item"
    return [name, ORDER_NONE]
}
PikGenerator.forBlock["variable"] = PikGenerator.variable

// =================== SÍMBOLOS =============================
// COMENTARIO DE UNA LÍNEA
PikGenerator.comentario = block => {
    const txt = block.getFieldValue("TEXTO") || "";
    return `// ${txt}\n` + appendNext(block);
}
PikGenerator.forBlock["comentario"] = PikGenerator.comentario
// COMENTARIO DE VARIAS LÍNEAS
PikGenerator.comentario_bloque = block => {
    let code = "/*\n"
    const body = PikGenerator.statementToCode(block, "LINEAS")
    code += PikGenerator.prefixLines(body, INDENT)
    code += "*/\n"
    return code
}
PikGenerator.forBlock["comentario_bloque"] = PikGenerator.comentario_bloque
// PARÉNTESIS
PikGenerator.parentesis = block => {
    const expr = PikGenerator.valueToCode(block, "EXPR", ORDER_NONE) || ""
    return [`(${expr})`, ORDER_NONE]
}
PikGenerator.forBlock["parentesis"] = PikGenerator.parentesis
// SALTO DE LÍNEA
PikGenerator.salto_linea = () => ['"\\n"', ORDER_NONE]
PikGenerator.forBlock["salto_linea"] = PikGenerator.salto_linea
// TABULACIÓN
PikGenerator.tab = () => ['"\\t"', ORDER_NONE]
PikGenerator.forBlock["tab"] = PikGenerator.tab

// =================== OPERACIONES ARITMÉTICAS Y COMPARACIONES =============================
// OPERACIÓN ARITMÉTICA
PikGenerator.operacion = block => {
    const a = PikGenerator.valueToCode(block, 'A', ORDER_NONE) || '0'
    const b = PikGenerator.valueToCode(block, 'B', ORDER_NONE) || '0'
    const key = block.getFieldValue('OPERADOR') as OperadorKey
    return [`${a} ${operadores[key]} ${b}`, ORDER_NONE]
}
PikGenerator.forBlock['operacion'] = PikGenerator.operacion
// COMPARACIÓN
PikGenerator.comparacion = block => {
    const a = PikGenerator.valueToCode(block, 'A', ORDER_NONE) || '0'
    const b = PikGenerator.valueToCode(block, 'B', ORDER_NONE) || '0'
    const key = block.getFieldValue('OPERADOR') as ComparadorKey
    return [`${a} ${comparadores[key]} ${b}`, ORDER_NONE]
}
PikGenerator.forBlock['comparacion'] = PikGenerator.comparacion

// ============================= OPERADORES LÓGICOS =============================
// Y
PikGenerator.y = block => {
    const a = PikGenerator.valueToCode(block, "A", ORDER_NONE) || "falso"
    const b = PikGenerator.valueToCode(block, "B", ORDER_NONE) || "falso"
    return [`${a} y ${b}`, ORDER_NONE]
}
PikGenerator.forBlock["y"] = PikGenerator.y
// O
PikGenerator.o = block => {
    const a = PikGenerator.valueToCode(block, "A", ORDER_NONE) || "falso"
    const b = PikGenerator.valueToCode(block, "B", ORDER_NONE) || "falso"
    return [`${a} o ${b}`, ORDER_NONE]
}
PikGenerator.forBlock["o"] = PikGenerator.o
// NO
PikGenerator.no = block => {
    const a = PikGenerator.valueToCode(block, "A", ORDER_NONE) || "falso"
    return [`no ${a}`, ORDER_NONE]
}
PikGenerator.forBlock["no"] = PikGenerator.no

// =================== SI/SINO =============================
PikGenerator.si = block => {
    const cond = PikGenerator.valueToCode(block, 'CONDICION', ORDER_NONE) || 'falso';
    const thenBranch = PikGenerator.statementToCode(block, 'HACER');
    const elseBranch = PikGenerator.statementToCode(block, 'SINO');

    let code = `si ${cond}:\n`;
    code += PikGenerator.prefixLines(thenBranch, INDENT);
    if (elseBranch) {
        code += 'sino:\n';
        code += PikGenerator.prefixLines(elseBranch, INDENT);
    }

    return code + appendNext(block);
}
PikGenerator.forBlock['si'] = PikGenerator.si

// ============================== BUCLE PARA =============================
PikGenerator.para = block => {
    const varName = block.getFieldValue('VAR')!;
    const desde = PikGenerator.valueToCode(block, 'DESDE', ORDER_NONE) || '0';
    const hasta = PikGenerator.valueToCode(block, 'HASTA', ORDER_NONE) || '0';
    const body = PikGenerator.statementToCode(block, 'HACER');

    let code = `para ${varName} desde ${desde} hasta ${hasta}:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code + appendNext(block);
}
PikGenerator.forBlock["para"] = PikGenerator.para

// ============================== BUCLE REPETIR =============================
PikGenerator.repetir = block => {
    const times = PikGenerator.valueToCode(block, 'VECES', ORDER_NONE) || '1';
    const body = PikGenerator.statementToCode(block, 'HACER');

    let code = `repetir ${times} veces:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code + appendNext(block);
}
PikGenerator.forBlock['repetir'] = PikGenerator.repetir

// ============================== BUCLE MIENTRAS =============================
PikGenerator.mientras = block => {
    const cond = PikGenerator.valueToCode(block, "CONDICION", ORDER_NONE) || "falso";
    const body = PikGenerator.statementToCode(block, "HACER");

    let code = `mientras ${cond}:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code + appendNext(block);
}
PikGenerator.forBlock["mientras"] = PikGenerator.mientras

// ============================= SEGUN-CASO-DEFECTO =============================
// SEGUN
PikGenerator.segun = block => {
    const expr = PikGenerator.valueToCode(block, "EXPRESION", ORDER_NONE) || "";
    const casesCode = PikGenerator.statementToCode(block, "CASOS");
    const defaultCode = PikGenerator.statementToCode(block, "DEFECTO");

    let code = `segun ${expr}:\n`;
    code += PikGenerator.prefixLines(casesCode, INDENT);
    if (defaultCode.trim()) {
        code += PikGenerator.prefixLines(`defecto:\n`, INDENT);
        code += PikGenerator.prefixLines(defaultCode, INDENT + INDENT);
    }

    return code + appendNext(block);
}
PikGenerator.forBlock["segun"] = PikGenerator.segun
// CASOS
PikGenerator.caso = block => {
    const val = block.getFieldValue("VALOR")!;
    const body = PikGenerator.statementToCode(block, "CUERPO")
    let code = `caso ${val}:\n`
    code += PikGenerator.prefixLines(body, INDENT)
    return code
}
PikGenerator.forBlock["caso"] = PikGenerator.caso

// ============================= CONVERTIDORES =============================
// ENTERO
PikGenerator.entero = block => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || "0"
    return [`entero(${val})`, ORDER_NONE]
}
PikGenerator.forBlock["entero"] = PikGenerator.entero
// DECIMAL
PikGenerator.decimal = block => {
    const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '0'
    return [`decimal(${val})`, ORDER_NONE]
}
PikGenerator.forBlock['decimal'] = PikGenerator.decimal
// TEXTO
PikGenerator.texto_convertido = block => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || '""'
    return [`texto(${val})`, ORDER_NONE]
}
PikGenerator.forBlock["texto_convertido"] = PikGenerator.texto_convertido
// BOOLEANO
PikGenerator.booleano = block => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || "falso"
    return [`booleano(${val})`, ORDER_NONE]
}
PikGenerator.forBlock["booleano"] = PikGenerator.booleano

// ============================= FUNCIONES =============================
// Definir función
PikGenerator.funcion = block => {
    const name = block.getFieldValue("NOMBRE")!
    const params = block
        .getFieldValue("PARAMS")
        ?.split(",")
        .map((p: string) => p.trim())
        .join(", ") || ""
    const body = PikGenerator.statementToCode(block, "CUERPO")
    let code = `funcion ${name}(${params}):\n`
    code += PikGenerator.prefixLines(body, INDENT)
    return code
}
PikGenerator.forBlock["funcion"] = PikGenerator.funcion
// Retornar valor
PikGenerator.retornar = block => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || "";
    return `retornar ${val}\n` + appendNext(block);
}
PikGenerator.forBlock["retornar"] = PikGenerator.retornar
// Llamar función
PikGenerator.llamar_funcion = block => {
    const name = block.getFieldValue("NOMBRE")!
    const params = block
        .getFieldValue("PARAMS")
        ?.split(",")
        .map((p: string) => p.trim())
        .join(", ") || ""
    return [`${name}(${params})`, ORDER_NONE]
}
PikGenerator.forBlock["llamar_funcion"] = PikGenerator.llamar_funcion

// =============================================================================
// Recorre todos los bloques enlazados en un Statement (p.ej. 'HACER', 'SI', 'SINO')
// y concatena su código. Sin esto, solo el primer bloque se procesa.
// =============================================================================
PikGenerator.statementToCode = function (
    parentBlock: Blockly.Block,
    name: string
): string {
    let code = ''
    let childBlock = parentBlock.getInputTargetBlock(name)

    while (childBlock) {
        let line = this.blockToCode(childBlock)
        if (Array.isArray(line)) {
            line = line[0]
        }
        code += line
        const next = childBlock.nextConnection?.targetBlock()
        childBlock = next || null
    }

    return code
}

// finish
PikGenerator.finish = (code: string) => code

// ✅ Procesa cada bloque individual en secuencias como si/para/hacer
PikGenerator.blockToCode = function (
    block: Blockly.Block | null
): string | [string, number] {
    if (!block) return ''

    const func = this.forBlock?.[block.type]
    if (typeof func !== 'function') {
        console.warn(`No hay generador para el bloque: ${block.type}`)
        return ''
    } 

    const code = func(block, this)
    return Array.isArray(code) ? code : code ?? ''
}