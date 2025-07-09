// src/data/toolbox.ts
export const toolboxXml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <category name="📤 Salida" colour="#fb7185">
    <block type="mostrar">
      <value name="VALOR">
        <block type="texto">
          <field name="TEXT">¡Hola mundo!</field>
        </block>
      </value>
    </block>
  </category>
  
  <category name="📦 Variables" colour="#34d399">
    <block type="guardar">
      <value name="VALOR">
        <block type="numero">
          <field name="NUM">42</field>
        </block>
      </value>
      <field name="NOMBRE">mi_variable</field>
    </block>
  </category>
  
  <category name="🔢 Números" colour="#facc15">
    <block type="numero">
      <field name="NUM">0</field>
    </block>
    <block type="operacion">
      <value name="A">
        <block type="numero">
          <field name="NUM">5</field>
        </block>
      </value>
      <value name="B">
        <block type="numero">
          <field name="NUM">3</field>
        </block>
      </value>
    </block>
  </category>
  
  <category name="📝 Texto" colour="#c084fc">
    <block type="texto">
      <field name="TEXT">Hola</field>
    </block>
  </category>
  
  <category name="🤔 Lógica" colour="#f472b6">
    <block type="si">
      <value name="CONDICION">
        <block type="comparacion">
          <value name="A">
            <block type="numero">
              <field name="NUM">5</field>
            </block>
          </value>
          <value name="B">
            <block type="numero">
              <field name="NUM">3</field>
            </block>
          </value>
        </block>
      </value>
    </block>
    <block type="comparacion">
      <value name="A">
        <block type="numero">
          <field name="NUM">5</field>
        </block>
      </value>
      <value name="B">
        <block type="numero">
          <field name="NUM">3</field>
        </block>
      </value>
    </block>
  </category>
  
  <category name="🔄 Bucles" colour="#60a5fa">
    <block type="repetir">
      <value name="VECES">
        <block type="numero">
          <field name="NUM">5</field>
        </block>
      </value>
    </block>
  </category>
  
  <category name="❓ Entrada" colour="#a78bfa">
    <block type="preguntar">
      <value name="PREGUNTA">
        <block type="texto">
          <field name="TEXT">¿Cómo te llamas?</field>
        </block>
      </value>
      <field name="VARIABLE">nombre</field>
    </block>
  </category>
</xml>
`;