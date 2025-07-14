// src/blocks/paraBlock.ts
import * as Blockly from 'blockly'

Blockly.Blocks['para'] = {
    init() {
        this.appendDummyInput()
            .appendField('🔁 para')
            .appendField(
                new Blockly.FieldTextInput('i', function (this: Blockly.FieldTextInput, newName: string): string {
                    const block = this.getSourceBlock()
                    const ws = block?.workspace

                    if (ws) {
                        const map = ws.getVariableMap()
                        if (!map.getVariable(newName)) {
                            map.createVariable(newName)
                        }
                    }

                    return newName
                }),
                'VAR'
            )

        this.appendValueInput('DESDE').setCheck(null).appendField('desde')
        this.appendValueInput('HASTA').setCheck(null).appendField('hasta')
        this.appendStatementInput('HACER').setCheck(null)

        this.setPreviousStatement(true)
        this.setNextStatement(true)
        this.setColour('#60a5fa')
        this.setTooltip('Ejecuta un bloque desde un valor inicial hasta uno final')
    }
}