// src/blocks/textoBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['texto'] = {
    init() {
        this.appendDummyInput()
            .appendField('📝')
            .appendField(new Blockly.FieldTextInput('Hola'), 'TEXT');

        this.setOutput(true, 'String');
        this.setColour('#c084fc');
        this.setTooltip('Texto');
        this.setHelpUrl('');
    }
};