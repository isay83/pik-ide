// src/core/pikGenerator.ts
import * as Blockly from 'blockly'

interface PikBlockGenerator {
    mostrar?: (block: Blockly.Block) => string
    guardar?: (block: Blockly.Block) => string
    numero?: (block: Blockly.Block) => string
    // Pronto puedes añadir más:
    // si?: (block: Blockly.Block) => string
    // repetir?: (block: Blockly.Block) => string
}

export const PikGenerator: Blockly.Generator & PikBlockGenerator = new Blockly.Generator('Pik')

PikGenerator['mostrar'] = (block: Blockly.Block) => {
    const val = PikGenerator.valueToCode(block, 'VALOR', Blockly.JavaScript.ORDER_NONE)
    return `mostrar ${val}\n`
}

PikGenerator['guardar'] = (block: Blockly.Block) => {
    const valor = block.getFieldValue('VALOR')
    const nombre = block.getFieldValue('NOMBRE')
    return `guardar ${valor} en ${nombre}\n`
}

PikGenerator['numero'] = (block: Blockly.Block) => {
    const num = block.getFieldValue('NUM')
    return num
}

PikGenerator.finish = (code: string) => code