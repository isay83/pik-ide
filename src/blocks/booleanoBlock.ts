// src/blocks/booleanoBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["booleano"] = {
    init() {
        this.appendValueInput("VALOR")
            .setCheck(null)
            .appendField("🔄 convertir a booleano")

        this.setOutput(true, null)
        this.setColour("#34d399")
        this.setTooltip("Convierte texto o número en verdadero/falso")
        this.setHelpUrl("")
    },
}