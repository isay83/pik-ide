// src/blocks/logicoOBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["o"] = {
    init() {
        this.appendValueInput("A").setCheck(null)
        this.appendDummyInput().appendField("🟨 o")
        this.appendValueInput("B").setCheck(null)

        this.setOutput(true, null)
        this.setColour("#facc15")
        this.setTooltip("Devuelve verdadero si alguno de los valores es verdadero")
        this.setHelpUrl("")
    }
}