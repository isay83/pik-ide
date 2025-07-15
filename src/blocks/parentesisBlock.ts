// src/blocks/paréntesisBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["parentesis"] = {
    init() {
        this.appendValueInput("EXPR")
            .setCheck(null)
            .appendField("(")
            .appendField(")")
        this.setOutput(true, null)
        this.setColour("#4a4aff")
        this.setTooltip("Envuelve una expresión en paréntesis")
    }
}