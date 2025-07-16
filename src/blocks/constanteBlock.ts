// src/blocks/constantesBlock.ts
import * as Blockly from 'blockly'

// Lista de constantes disponibles
export const LISTA_CONSTANTES: Array<[string, string]> = [
    ['π', 'pi'],
    ['e', 'e'],
]

// Bloque constante
Blockly.Blocks['constante'] = {
    init() {
        this.appendDummyInput()
            .appendField('constante')
            .appendField(new Blockly.FieldDropdown(LISTA_CONSTANTES), 'NOMBRE')
        this.setOutput(true, 'Number')
        this.setColour(230)
        this.setTooltip('Usa una constante predefinida')
    }
}
