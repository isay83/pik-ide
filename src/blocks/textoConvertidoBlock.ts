// src/blocks/textoConvertido.ts
import * as Blockly from "blockly"

Blockly.Blocks["texto_convertido"] = {
    init() {
        this.appendValueInput("VALOR")
            .setCheck(null)
            .appendField("🔤 texto")

        this.setOutput(true, null)
        this.setColour("#f472b6")
        this.setTooltip("Convierte el valor en texto")
        this.setHelpUrl("")
    }
}