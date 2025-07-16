// src/blocks/tabBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["tab"] = {
    init() {
        this.appendValueInput("NEXT")
            .setCheck(null)
            .appendField("\\t")
        this.setOutput(true, "String")
        this.setColour("#34a853")
        this.setTooltip("Tabulación (se puede encadenar)")
    }
}