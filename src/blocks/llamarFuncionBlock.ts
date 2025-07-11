// src/blocks/llamarFuncionBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["llamar_funcion"] = {
    init() {
        this.appendDummyInput()
            .appendField("📞 llamar")
            .appendField(new Blockly.FieldTextInput("nombre_funcion"), "NOMBRE")

        this.appendValueInput("ARGUMENTOS")
            .setCheck(null)
            .appendField("con argumentos")

        this.setOutput(true, null)
        this.setColour("#facc15")
        this.setTooltip("Llama a una función y devuelve el resultado")
        this.setHelpUrl("")
    }
}