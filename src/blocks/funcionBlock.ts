// src/blocks/funcionBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["funcion"] = {
    init() {
        this.appendDummyInput()
            .appendField("🧩 funcion")
            .appendField(new Blockly.FieldTextInput("saludar"), "NOMBRE")
            .appendField("(")
            .appendField(new Blockly.FieldTextInput("nombre"), "PARAMS")
            .appendField(")")

        this.appendStatementInput("CUERPO")
            .setCheck(null)

        this.setPreviousStatement(false)
        this.setNextStatement(true)
        this.setColour("#c084fc")
        this.setTooltip("Define una función con parámetros y cuerpo")
        this.setHelpUrl("")
    }
}