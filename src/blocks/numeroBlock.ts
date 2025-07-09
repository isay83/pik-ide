// src/blocks/numeroBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['numero'] = {
    init() {
        this.appendDummyInput()
            .appendField('🔢')
            .appendField(new Blockly.FieldNumber(0), 'NUM');

        this.setOutput(true, 'Number');
        this.setColour('#facc15');
        this.setTooltip('Número');
        this.setHelpUrl('');
    }
};