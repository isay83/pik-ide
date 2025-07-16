// src/blocks/saltoLineaBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["salto_linea"] = {
    init() {
        this.appendValueInput("NEXT")
            .setCheck(null)
            .appendField("\\n")
        this.setOutput(true, "String")
        this.setColour("#34a853")
        this.setTooltip("Salto de línea (se puede encadenar)")
    }
}