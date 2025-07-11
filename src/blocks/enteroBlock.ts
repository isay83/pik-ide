// src/blocks/enteroBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["entero"] = {
    init() {
        this.appendValueInput("VALOR")
            .setCheck(null)
            .appendField("🔢 entero")

        this.setOutput(true, null)
        this.setColour("#38bdf8")
        this.setTooltip("Convierte el valor en un número entero")
        this.setHelpUrl("")
    }
}