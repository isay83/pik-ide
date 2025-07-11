// src/blocks/retornarBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["retornar"] = {
    init() {
        this.appendValueInput("VALOR")
            .setCheck(null)
            .appendField("🔙 retornar")

        this.setPreviousStatement(true, null)
        this.setNextStatement(false)
        this.setColour("#fb7185")
        this.setTooltip("Devuelve un valor desde una función")
        this.setHelpUrl("")
    }
}