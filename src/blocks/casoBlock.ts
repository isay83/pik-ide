// src/blocks/casoBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["caso"] = {
    init() {
        this.appendDummyInput()
            .appendField("🟦 caso")
            .appendField(new Blockly.FieldTextInput("1"), "VALOR")

        this.appendStatementInput("CUERPO")
            .setCheck(null)
            .appendField("hacer")

        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour("#60a5fa")
        this.setTooltip("Ejecuta instrucciones si la opción coincide con el valor")
        this.setHelpUrl("")
    }
}