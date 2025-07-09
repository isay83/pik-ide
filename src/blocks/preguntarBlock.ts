// src/blocks/preguntarBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['preguntar'] = {
    init() {
        this.appendValueInput('PREGUNTA')
            .setCheck('String')
            .appendField('❓ preguntar');

        this.appendDummyInput()
            .appendField('guardar en')
            .appendField(new Blockly.FieldTextInput('respuesta'), 'VARIABLE');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#a78bfa');
        this.setTooltip('Pregunta al usuario y guarda la respuesta');
        this.setHelpUrl('');
    }
};