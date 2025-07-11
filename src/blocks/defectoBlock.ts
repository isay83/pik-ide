// src/blocks/defectoBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["defecto"] = {
    init() {
        this.appendStatementInput("CUERPO")
            .setCheck(null)
            .appendField("🟥 defecto")

        this.setPreviousStatement(true, null)
        this.setNextStatement(false)
        this.setColour("#60a5fa")
        this.setTooltip("Ejecuta instrucciones si ningún caso coincide")
        this.setHelpUrl("")
    }
}