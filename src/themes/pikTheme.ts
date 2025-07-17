// src/themes/pikTheme.ts
import { createTheme } from '@uiw/codemirror-themes';
import { tags as t } from '@lezer/highlight';

export const pikTheme = createTheme({
    theme: 'light',
    settings: {
        background: '#ffffff',
        foreground: '#2d2d2d',
        caret: '#005cc5',
        selection: '#cce8ff',
        lineHighlight: '#faf2cc',
        gutterBackground: '#f5f5f5',
        gutterForeground: '#999999',
    },
    styles: [
        { tag: t.comment, color: '#6a737d', fontStyle: 'italic' },
        { tag: t.keyword, color: '#d73a49' },
        { tag: t.atom, color: '#6f42c1' },
        { tag: t.bool, color: '#6f42c1' },
        { tag: t.number, color: '#005cc5' },
        { tag: t.string, color: '#032f62' },
        { tag: t.variableName, color: '#2d2d2d' },
        { tag: t.operator, color: '#d73a49' },
        { tag: t.definition(t.variableName), color: '#005cc5' },
    ]
});