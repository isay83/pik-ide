// src/blocks/mientrasBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['mientras'] = {
    init() {
        this.appendValueInput('CONDICION')
            .setCheck(null)
            .appendField('mientras')
        this.appendStatementInput('HACER')
            .setCheck(null)

        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour('#60a5fa')
        this.setTooltip('Repite mientras la condición sea verdadera')
    }
}