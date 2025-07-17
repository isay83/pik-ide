// src/languages/pikLanguage.ts
import { StreamLanguage } from '@codemirror/language';

// lista de palabras reservadas (case-insensitive)
const keywords = [
    'mostrar', 'preguntar', 'guardar', 'en', 'repetir', 'veces',
    'si', 'sino', 'colorear', 'mover', 'esperar',
    'funcion', 'retornar', 'limpiar',
    'mientras', 'para', 'desde', 'hasta',
    'segun', 'caso', 'defecto', 'y', 'o', 'no'
];

// single regex para keywords (i), booleans y constantes (i)
const keywordRE = new RegExp(`\\b(${keywords.join('|')})\\b`, 'i');
const booleanRE = /\b(verdadero|falso)\b/i;
const constantRE = /\b(pi|e)\b/i;

export const pikLanguage = StreamLanguage.define<null>({
    startState: () => null,
    token(stream) {
        // Bloque /* ... */
        if (stream.match('/*')) {
            while (!stream.eol() && !stream.match('*/', false)) stream.next();
            stream.match('*/');
            return 'comment';
        }
        // Línea //
        if (stream.match('//')) {
            stream.skipToEnd();
            return 'comment';
        }
        // Cadena
        if (stream.match(/"([^"\\]|\\.)*"/)) return 'string';
        // Número: decimal o entero
        if (stream.match(/\d+\.\d+/) || stream.match(/\d+/)) return 'number';
        // Booleanos
        if (stream.match(booleanRE)) return 'atom';
        // Keywords
        if (stream.match(keywordRE)) return 'keyword';
        // Constantes predefinidas
        if (stream.match(constantRE)) return 'atom';
        // Operadores
        if (stream.match(/==|!=|<=|>=|[+\-*/<>=:]/)) return 'operator';
        // Identificadores
        if (stream.match(/[a-zA-Z_áéíóúÁÉÍÓÚñÑ][\wáéíóúÁÉÍÓÚñÑ]*/)) {
            return 'variableName';
        }
        // Avanza un carácter si no hay match
        stream.next();
        return null;
    }
});