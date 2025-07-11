// src/core/pikGenerator.ts

import * as Blockly from 'blockly'
// cSpell:ignore operadores comparadores

// Definimos nuestras propias precedencias y sangría
const ORDER_NONE = 0
const ORDER_ATOMIC = 1
const INDENT = '  '  // dos espacios para sangrar bloques anidados

// Interfaz con la firma exacta de cada método
interface PikBlockGenerator {
    // Acciones de Pik
    mostrar(block: Blockly.Block): string
    guardar(block: Blockly.Block): string
    repetir(block: Blockly.Block): string
    preguntar(block: Blockly.Block): string
    // Tipos de datos
    numero(block: Blockly.Block): [string, number]
    texto(block: Blockly.Block): [string, number]
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
    mientras(block: Blockly.Block): string

    segun(block: Blockly.Block): string
    caso(block: Blockly.Block): string
    defecto(block: Blockly.Block): string
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
    const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '""'
    return `mostrar ${val}\n`
}
PikGenerator.forBlock['mostrar'] = PikGenerator.mostrar;
// GUARDAR
PikGenerator.guardar = block => {
    const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '0'
    const name = block.getFieldValue('NOMBRE')!
    return `guardar ${val} en ${name}\n`
}
PikGenerator.forBlock['guardar'] = PikGenerator.guardar
// PREGUNTAR
PikGenerator.preguntar = block => {
    const question = PikGenerator.valueToCode(block, 'PREGUNTA', ORDER_NONE) || '""'
    const variable = block.getFieldValue('VARIABLE')!
    return `preguntar ${question} guardar en ${variable}\n`
}
PikGenerator.forBlock['preguntar'] = PikGenerator.preguntar

// =================== TIPOS DE DATOS =============================
// número
PikGenerator.numero = block => {
    const n = block.getFieldValue('NUM') || '0'
    return [n, ORDER_ATOMIC]
}
PikGenerator.forBlock['numero'] = PikGenerator.numero
// texto
PikGenerator.texto = block => {
    const t = block.getFieldValue('TEXT') || ''
    return [`"${t}"`, ORDER_ATOMIC]
}
PikGenerator.forBlock['texto'] = PikGenerator.texto

// =================== OPERACIONES ARITMÉTICAS Y COMPARACIONES =============================
// operación aritmética
PikGenerator.operacion = block => {
    const a = PikGenerator.valueToCode(block, 'A', ORDER_NONE) || '0'
    const b = PikGenerator.valueToCode(block, 'B', ORDER_NONE) || '0'
    const key = block.getFieldValue('OPERADOR') as OperadorKey
    return [`${a} ${operadores[key]} ${b}`, ORDER_ATOMIC]
}
PikGenerator.forBlock['operacion'] = PikGenerator.operacion
// comparación
PikGenerator.comparacion = block => {
    const a = PikGenerator.valueToCode(block, 'A', ORDER_NONE) || '0'
    const b = PikGenerator.valueToCode(block, 'B', ORDER_NONE) || '0'
    const key = block.getFieldValue('OPERADOR') as ComparadorKey
    return [`${a} ${comparadores[key]} ${b}`, ORDER_ATOMIC]
}
PikGenerator.forBlock['comparacion'] = PikGenerator.comparacion

// ============================= OPERADORES LÓGICOS =============================
// Y
PikGenerator.y = (block) => {
    const a = PikGenerator.valueToCode(block, "A", ORDER_NONE) || "falso";
    const b = PikGenerator.valueToCode(block, "B", ORDER_NONE) || "falso";
    return [`${a} y ${b}`, ORDER_ATOMIC];
};
PikGenerator.forBlock["y"] = PikGenerator.y;
// O
PikGenerator.o = (block) => {
    const a = PikGenerator.valueToCode(block, "A", ORDER_NONE) || "falso";
    const b = PikGenerator.valueToCode(block, "B", ORDER_NONE) || "falso";
    return [`${a} o ${b}`, ORDER_ATOMIC];
};
PikGenerator.forBlock["o"] = PikGenerator.o;
// NO
PikGenerator.no = (block) => {
    const a = PikGenerator.valueToCode(block, "A", ORDER_NONE) || "falso";
    return [`no ${a}`, ORDER_ATOMIC];
};
PikGenerator.forBlock["no"] = PikGenerator.no;

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
    return code;
};
PikGenerator.forBlock['si'] = PikGenerator.si;

// ============================== BUCLE PARA =============================
PikGenerator.para = (block) => {
    const varName = block.getFieldValue("VAR")!;
    const desde = PikGenerator.valueToCode(block, "DESDE", ORDER_NONE) || "0";
    const hasta = PikGenerator.valueToCode(block, "HASTA", ORDER_NONE) || "0";
    const body = PikGenerator.statementToCode(block, "HACER");
    let code = `para ${varName} desde ${desde} hasta ${hasta}:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code;
};
PikGenerator.forBlock["para"] = PikGenerator.para;

// ============================== BUCLE REPETIR =============================
PikGenerator.repetir = block => {
    const times = PikGenerator.valueToCode(block, 'VECES', ORDER_NONE) || '1'
    const body = PikGenerator.statementToCode(block, 'HACER')

    let code = `repetir ${times} veces:\n`
    code += PikGenerator.prefixLines(body, INDENT)
    return code
}
PikGenerator.forBlock['repetir'] = PikGenerator.repetir

// ============================== BUCLE MIENTRAS =============================
PikGenerator.mientras = (block) => {
    const cond = PikGenerator.valueToCode(block, "CONDICION", ORDER_NONE) || "falso";
    const body = PikGenerator.statementToCode(block, "HACER");
    let code = `mientras ${cond}:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code;
};
PikGenerator.forBlock["mientras"] = PikGenerator.mientras;

// ============================= SEGUN-CASO-DEFECTO =============================
// SEGUN
PikGenerator.segun = (block) => {
    const expr = PikGenerator.valueToCode(block, "EXPRESION", ORDER_NONE) || "";
    const cases = PikGenerator.statementToCode(block, "CASOS");
    let code = `segun ${expr}:\n`;
    code += cases;
    return code;
};
PikGenerator.forBlock["segun"] = PikGenerator.segun;
// CASOS
PikGenerator.caso = (block) => {
    const val = block.getFieldValue("VALOR")!;
    const body = PikGenerator.statementToCode(block, "CUERPO");
    let code = `caso ${val}:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code;
};
PikGenerator.forBlock["caso"] = PikGenerator.caso;
// CASO POR DEFECTO
PikGenerator.defecto = (block) => {
    const body = PikGenerator.statementToCode(block, "CUERPO");
    let code = `defecto:\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code;
};
PikGenerator.forBlock["defecto"] = PikGenerator.defecto;

// ============================= CONVERTIDORES =============================
// ENTERO
PikGenerator.entero = (block) => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || "0";
    return [`entero(${val})`, ORDER_ATOMIC];
};
PikGenerator.forBlock["entero"] = PikGenerator.entero;
// DECIMAL
PikGenerator.decimal = block => {
    const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '0';
    return [`decimal(${val})`, ORDER_ATOMIC];
}
PikGenerator.forBlock['decimal'] = PikGenerator.decimal;
// TEXTO
PikGenerator.texto_convertido = block => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || '""';
    return [`texto(${val})`, ORDER_ATOMIC];
};
PikGenerator.forBlock["convertir_a_texto"] = PikGenerator.texto_convertido;
// BOOLEANO
PikGenerator.booleano = (block) => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || "falso";
    return [`booleano(${val})`, ORDER_ATOMIC];
};
PikGenerator.forBlock["booleano"] = PikGenerator.booleano;

// ============================= FUNCIONES =============================
// Definir función
PikGenerator.funcion = (block) => {
    const name = block.getFieldValue("NOMBRE")!;
    // Si tienes un mutator o lista de inputs PARAMS:
    const params = block
        .getFieldValue("PARAMS")
        ?.split(",")
        .map((p: string) => p.trim())
        .join(", ") || "";
    const body = PikGenerator.statementToCode(block, "CUERPO");
    let code = `funcion ${name}(${params}):\n`;
    code += PikGenerator.prefixLines(body, INDENT);
    return code;
};
PikGenerator.forBlock["funcion"] = PikGenerator.funcion;
// Retornar valor
PikGenerator.retornar = (block) => {
    const val = PikGenerator.valueToCode(block, "VALOR", ORDER_NONE) || "";
    return `retornar ${val}\n`;
};
PikGenerator.forBlock["retornar"] = PikGenerator.retornar;
// Llamar función
PikGenerator.llamar_funcion = (block) => {
    const name = block.getFieldValue("NOMBRE")!;
    const args = block
        .getFieldValue("ARGUMENTOS")
        ?.split(",")
        .map((a: string) => a.trim())
        .join(", ") || "";
    return [`${name}(${args})`, ORDER_ATOMIC];
};
PikGenerator.forBlock["llamar_funcion"] = PikGenerator.llamar_funcion;


// finish
PikGenerator.finish = (code: string) => code