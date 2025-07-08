// src/blocks/numeroBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['numero'] = {
    init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), 'NUM')
        this.setOutput(true, null) // Esto hace que pueda conectarse como valor
        this.setColour(120)
        this.setTooltip('Número')
    }
}