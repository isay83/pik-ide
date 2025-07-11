// src/blocks/comparacionBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["comparacion"] = {
    init() {
        this.appendValueInput("A").setCheck(null)
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["==", "IGUAL"],
                ["!=", "DIFERENTE"],
                [">", "MAYOR"],
                ["<", "MENOR"],
                [">=", "MAYOR_IGUAL"],
                ["<=", "MENOR_IGUAL"],
            ]), "OPERADOR")
        this.appendValueInput("B").setCheck(null)

        this.setOutput(true, null)
        this.setColour("#f472b6")
        this.setTooltip("Compara dos valores y devuelve verdadero o falso")
        this.setHelpUrl("")
    }
}