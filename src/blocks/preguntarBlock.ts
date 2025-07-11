// src/blocks/preguntarBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["preguntar"] = {
    init() {
        this.appendValueInput("PREGUNTA")
            .setCheck("String")
            .appendField("❓ preguntar")
        this.appendDummyInput()
            .appendField("guardar en")
            .appendField(new Blockly.FieldVariable("item"), "VAR")
        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour("#10b981")
        this.setTooltip("Pide un valor al usuario y lo asigna a una variable")
    }
}