// src/blocks/segunBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["segun"] = {
    init() {
        this.appendValueInput("EXPRESION")
            .setCheck(null)
            .appendField("🎛️ según")

        this.appendStatementInput("CASOS")
            .setCheck(null)
            .appendField("casos")

        this.appendStatementInput("DEFECTO")
            .setCheck(null)
            .appendField("defecto")


        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour("#60a5fa")
        this.setTooltip("Selecciona entre múltiples casos según una expresión")
        this.setHelpUrl("")
    }
}