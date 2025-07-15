// src/blocks/saltoLineaBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["salto_linea"] = {
    init() {
        this.appendDummyInput().appendField("\\n")
        this.setOutput(true, null)
        this.setColour("#34a853")
        this.setTooltip("Valor de salto de línea")
    }
}