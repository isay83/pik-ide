// src/blocks/guardarBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['guardar'] = {
    init() {
        this.appendDummyInput()
            .appendField('📦 guardar')
            .appendField(new Blockly.FieldTextInput('valor'), 'VALOR')
            .appendField('en')
            .appendField(new Blockly.FieldTextInput('nombre'), 'NOMBRE')

        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour(220)
        this.setTooltip('Guarda un valor en una variable')
    }
}