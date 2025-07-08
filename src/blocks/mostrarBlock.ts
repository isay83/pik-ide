// src/blocks/mostrarBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['mostrar'] = {
    init() {
        this.appendValueInput('VALOR')
            .setCheck(null)
            .appendField('🗣️ mostrar')

        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(180)
        this.setTooltip('Muestra un valor en pantalla')
    }
}
