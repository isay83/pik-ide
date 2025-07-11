// src/blocks/logicoNoBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["no"] = {
    init() {
        this.appendValueInput("A")
            .setCheck(null)
            .appendField("🟥 no")

        this.setOutput(true, null)
        this.setColour("#fb7185")
        this.setTooltip("Niega el valor booleano de una expresión")
        this.setHelpUrl("")
    }
}