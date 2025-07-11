// src/blocks/booleanoLiteralBlock.ts
import * as Blockly from "blockly"

Blockly.Blocks["booleano_valor"] = {
    init() {
        this.appendDummyInput()
            .appendField("🔘")
            .appendField(new Blockly.FieldDropdown([
                ["verdadero", "verdadero"],
                ["falso", "falso"]
            ]), "BOOL")
        this.setOutput(true, null)
        this.setColour("#047857")
        this.setTooltip("Booleano literal")
    }
}