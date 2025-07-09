// src/blocks/siBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['si'] = {
    init() {
        this.appendValueInput('CONDICION')
            .setCheck('Boolean')
            .appendField('🤔 si');

        /*this.appendStatementInput('HACER')
            .setCheck(null)
            .appendField('hacer:');*/

        this.appendStatementInput('SINO')
            .setCheck(null)
            .appendField('sino:');

        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour('#f472b6');
        this.setTooltip('Estructura condicional si-sino');
        this.setHelpUrl('');
    }
};