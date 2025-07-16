// src/blocks/comparacionBlock.ts
import * as Blockly from "blockly"

// Lista de operadores de comparación
export const LISTA_OPERADORES_COMPARACION: Array<[string, string]> = [
    ["==", "IGUAL"],
    ["!=", "DIFERENTE"],
    [">", "MAYOR"],
    ["<", "MENOR"],
    [">=", "MAYOR_IGUAL"],
    ["<=", "MENOR_IGUAL"]
]

Blockly.Blocks["comparacion"] = {
    init() {
        this.appendValueInput("A").setCheck(null)
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown(LISTA_OPERADORES_COMPARACION), "OPERADOR")
        this.appendValueInput("B").setCheck(null)

        this.setOutput(true, null)
        this.setColour("#f472b6")
        this.setTooltip("Compara dos valores y devuelve verdadero o falso")
        this.setHelpUrl("")
    }
}