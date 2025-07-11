// src/blocks/guardarBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["guardar"] = {
    init() {
        this.appendValueInput("VALOR")
            .setCheck(null)
            .appendField("💾 guardar")
        this.appendDummyInput()
            .appendField("en")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour("#f59e0b")
        this.setTooltip("Asigna un valor a una variable")
    }
}