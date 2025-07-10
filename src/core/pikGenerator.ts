// src/core/pikGenerator.ts

import * as Blockly from 'blockly'
// cSpell:ignore operadores comparadores

// Definimos nuestras propias precedencias y sangría
const ORDER_NONE = 0
const ORDER_ATOMIC = 1
const INDENT = '  '  // dos espacios para sangrar bloques anidados

// Interfaz con la firma exacta de cada método
interface PikBlockGenerator {
    mostrar(block: Blockly.Block): string
    guardar(block: Blockly.Block): string
    si(block: Blockly.Block): string
    repetir(block: Blockly.Block): string
    preguntar(block: Blockly.Block): string

    numero(block: Blockly.Block): [string, number]
    texto(block: Blockly.Block): [string, number]
    operacion(block: Blockly.Block): [string, number]
    comparacion(block: Blockly.Block): [string, number]
}

// Creamos la instancia y la casteamos a nuestra interfaz
export const PikGenerator =
    new Blockly.Generator('Pik') as Blockly.Generator & PikBlockGenerator

// — Bloques de sentencia —

// mostrar
PikGenerator.mostrar = block => {
    const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '""'
    return `mostrar ${val}\n`
}

// guardar
PikGenerator.guardar = block => {
    const val = PikGenerator.valueToCode(block, 'VALOR', ORDER_NONE) || '0'
    const name = block.getFieldValue('NOMBRE')!
    return `guardar ${val} en ${name}\n`
}

// si / sino
PikGenerator.si = block => {
    const cond = PikGenerator.valueToCode(block, 'CONDICION', ORDER_NONE) || 'falso'
    const thenBranch = PikGenerator.statementToCode(block, 'HACER')
    const elseBranch = PikGenerator.statementToCode(block, 'SINO')

    let code = `si ${cond}:\n`
    code += PikGenerator.prefixLines(thenBranch, INDENT)

    if (elseBranch) {
        code += 'sino:\n'
        code += PikGenerator.prefixLines(elseBranch, INDENT)
    }
    return code
}

// repetir
PikGenerator.repetir = block => {
    const times = PikGenerator.valueToCode(block, 'VECES', ORDER_NONE) || '1'
    const body = PikGenerator.statementToCode(block, 'HACER')

    let code = `repetir ${times} veces:\n`
    code += PikGenerator.prefixLines(body, INDENT)
    return code
}

// preguntar
PikGenerator.preguntar = block => {
    const question = PikGenerator.valueToCode(block, 'PREGUNTA', ORDER_NONE) || '""'
    const variable = block.getFieldValue('VARIABLE')!
    return `preguntar ${question} guardar en ${variable}\n`
}

// — Bloques de valor —

// número
PikGenerator.numero = block => {
    const n = block.getFieldValue('NUM') || '0'
    return [n, ORDER_ATOMIC]
}

// texto
PikGenerator.texto = block => {
    const t = block.getFieldValue('TEXT') || ''
    return [`"${t}"`, ORDER_ATOMIC]
}

// operación aritmética
const operadores = {
    SUMA: '+',
    RESTA: '-',
    MULTIPLICACION: '*',
    DIVISION: '/',
} as const
type OperadorKey = keyof typeof operadores

PikGenerator.operacion = block => {
    const a = PikGenerator.valueToCode(block, 'A', ORDER_NONE) || '0'
    const b = PikGenerator.valueToCode(block, 'B', ORDER_NONE) || '0'
    const key = block.getFieldValue('OPERADOR') as OperadorKey
    return [`${a} ${operadores[key]} ${b}`, ORDER_ATOMIC]
}

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

PikGenerator.comparacion = block => {
    const a = PikGenerator.valueToCode(block, 'A', ORDER_NONE) || '0'
    const b = PikGenerator.valueToCode(block, 'B', ORDER_NONE) || '0'
    const key = block.getFieldValue('OPERADOR') as ComparadorKey
    return [`${a} ${comparadores[key]} ${b}`, ORDER_ATOMIC]
}

PikGenerator.forBlock['mostrar'] = PikGenerator.mostrar;
PikGenerator.forBlock['guardar'] = PikGenerator.guardar;
PikGenerator.forBlock['si'] = PikGenerator.si;
PikGenerator.forBlock['repetir'] = PikGenerator.repetir;
PikGenerator.forBlock['preguntar'] = PikGenerator.preguntar;

PikGenerator.forBlock['numero'] = PikGenerator.numero;
PikGenerator.forBlock['texto'] = PikGenerator.texto;
PikGenerator.forBlock['operacion'] = PikGenerator.operacion;
PikGenerator.forBlock['comparacion'] = PikGenerator.comparacion;


// finish
PikGenerator.finish = (code: string) => code