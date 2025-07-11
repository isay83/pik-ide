// src/blocks/decimalBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["decimal"] = {
    init() {
        this.appendValueInput("VALOR")
            .setCheck(null)
            .appendField("🔣 decimal")

        this.setOutput(true, null)
        this.setColour("#34d399")
        this.setTooltip("Convierte el valor en un número decimal")
        this.setHelpUrl("")
    }
}