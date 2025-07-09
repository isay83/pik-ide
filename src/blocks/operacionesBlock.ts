// src/blocks/operacionesBlock.ts
import * as Blockly from 'blockly';

Blockly.Blocks['operacion'] = {
    init() {
        this.appendValueInput('A')
            .setCheck('Number');

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['+', 'SUMA'],
                ['-', 'RESTA'],
                ['*', 'MULTIPLICACION'],
                ['/', 'DIVISION']
            ]), 'OPERADOR');

        this.appendValueInput('B')
            .setCheck('Number');

        this.setOutput(true, 'Number');
        this.setColour('#facc15');
        this.setTooltip('Operación matemática');
        this.setHelpUrl('');
    }
};

Blockly.Blocks['comparacion'] = {
    init() {
        this.appendValueInput('A')
            .setCheck(null);

        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ['==', 'IGUAL'],
                ['!=', 'DIFERENTE'],
                ['>', 'MAYOR'],
                ['<', 'MENOR'],
                ['>=', 'MAYOR_IGUAL'],
                ['<=', 'MENOR_IGUAL']
            ]), 'OPERADOR');

        this.appendValueInput('B')
            .setCheck(null);

        this.setOutput(true, 'Boolean');
        this.setColour('#f472b6');
        this.setTooltip('Comparación entre valores');
        this.setHelpUrl('');
    }
};