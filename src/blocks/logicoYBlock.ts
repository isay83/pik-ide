// src/blocks/logicoYBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["y"] = {
    init() {
        this.appendValueInput("A").setCheck(null)
        this.appendDummyInput().appendField("🟩 y")
        this.appendValueInput("B").setCheck(null)

        this.setOutput(true, null)
        this.setColour("#34d399")
        this.setTooltip("Devuelve verdadero si ambos valores son verdaderos")
        this.setHelpUrl("")
    }
}