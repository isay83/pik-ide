// src/blocks/repetirBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['repetir'] = {
    init() {
        this.appendValueInput('VECES')
            .setCheck('Number')
            .appendField('🔄 repetir');

        this.appendStatementInput('HACER')
            .setCheck(null)
            .appendField('veces:');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#60a5fa');
        this.setTooltip('Repite un bloque de código');
        this.setHelpUrl('');
    }
};