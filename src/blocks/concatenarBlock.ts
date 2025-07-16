// src/blocks/concatenarBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['concatenar'] = {
    init() {
        this.appendValueInput('VALOR0')
            .setCheck(null)
            .appendField('')

        this.appendValueInput('VALOR1')
            .setCheck(null)
            .appendField('+')

        this.appendDummyInput()
            .appendField('')

        this.setOutput(true, 'String')
        this.setColour('#facc15') // color diferente para distinguir
        this.setTooltip('Concatena múltiples valores de cualquier tipo')
    }
}