// src/blocks/guardarBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['guardar'] = {
    init() {
        this.appendValueInput('VALOR')
            .setCheck(null)
            .appendField('📦 guardar');

        this.appendDummyInput()
            .appendField('en')
            .appendField(new Blockly.FieldTextInput('variable'), 'NOMBRE');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#34d399');
        this.setTooltip('Guarda un valor en una variable');
        this.setHelpUrl('');
    }
};