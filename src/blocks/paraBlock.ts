// src/blocks/paraBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['para'] = {
    init() {
        this.appendDummyInput()
            .appendField('🔁 para')
            .appendField(new Blockly.FieldTextInput('i'), 'VAR')

        this.appendValueInput('DESDE')
            .setCheck(null)
            .appendField('desde')

        this.appendValueInput('HASTA')
            .setCheck(null)
            .appendField('hasta')

        this.appendStatementInput('HACER')
            .setCheck(null)

        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour('#60a5fa')
        this.setTooltip('Ejecuta un bloque desde un valor inicial hasta uno final')
        this.setHelpUrl('')
    }
}