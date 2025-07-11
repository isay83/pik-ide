// src/blocks/variableBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["variable"] = {
    init() {
        this.appendDummyInput()
            .appendField("🔖")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
        this.setOutput(true, null)
        this.setColour("#f59e0b")
        this.setTooltip("Obtiene el valor de una variable")
    }
}