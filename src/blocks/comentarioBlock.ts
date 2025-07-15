// src/blocks/comentarioBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["comentario"] = {
    init() {
        this.appendDummyInput()
            .appendField("//")
            .appendField(new Blockly.FieldTextInput("comentario"), "TEXTO")
        this.setPreviousStatement(true)
        this.setNextStatement(true)
        this.setColour("#757575")
        this.setTooltip("Comentario de una sola línea")
    }
}