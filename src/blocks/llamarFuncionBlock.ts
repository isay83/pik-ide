// src/blocks/llamarFuncionBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["llamar_funcion"] = {
    init() {
        this.appendDummyInput()
            .appendField("📞 llamar")
            .appendField(new Blockly.FieldTextInput("saludar"), "NOMBRE")
            .appendField("(")
            // Aquí tipeas todos tus argumentos separados por comas
            .appendField(new Blockly.FieldTextInput("nombre"), "PARAMS")
            .appendField(")");

        this.setOutput(true, null)
        this.setColour("#facc15")
        this.setTooltip("Llama a una función y devuelve el resultado")
        this.setHelpUrl("")
    }
}