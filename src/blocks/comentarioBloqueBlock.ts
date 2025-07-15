// src/blocks/comentarioBloqueBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["comentario_bloque"] = {
    init() {
        // apertura
        this.appendDummyInput()
            .appendField("/*")

        // espacio para insertar comentarios de línea
        this.appendStatementInput("LINEAS")
            .setCheck(null)
            .appendField("líneas")

        // cierre alineado a la derecha
        this.appendDummyInput()
            .appendField("*/")

        this.setPreviousStatement(true, null)
        this.setNextStatement(true, null)
        this.setColour("#757575")
        this.setTooltip("Comentario de bloque multilínea")
        this.setHelpUrl("")
    }
}