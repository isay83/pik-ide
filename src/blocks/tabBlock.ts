// src/blocks/tabBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["tab"] = {
    init() {
        this.appendDummyInput().appendField("\\t")
        this.setOutput(true, null)
        this.setColour("#34a853")
        this.setTooltip("Valor de tabulación")
    }
}