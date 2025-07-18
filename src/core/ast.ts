// src/core/ast.ts

// Expresiones base
export interface LiteralNode {
    type: "Literal";
    value: number | string | boolean;
}

export interface IdentifierNode {
    type: "Identifier";
    name: string;
}

export interface BinaryOpNode {
    type: "BinaryOp";
    left: ExprNode;
    operator: string;
    right: ExprNode;
}

export interface UnaryOpNode {
    type: "UnaryOp";
    operator: string;
    operand: ExprNode;
}

export interface CallExprNode {
    type: "CallExpr";
    name: string;
    args: ExprNode[];
}

export type ExprNode = LiteralNode | IdentifierNode | BinaryOpNode | UnaryOpNode | CallExprNode;

// Sentencias
export interface CallStmtNode {
    type: "CallStmt" | "Call";
    name: string;
    args: ExprNode[];
}

export interface AssignNode {
    type: "Assign";
    target: string;
    value: ExprNode;
}

export interface IfNode {
    type: "If";
    test: ExprNode;
    consequent: StatementNode[];
    alternate?: StatementNode[];
}

export interface WhileNode {
    type: "While";
    test: ExprNode;
    body: StatementNode[];
}

export interface ForNode {
    type: "For";
    target: string;
    start: ExprNode;
    end: ExprNode;
    body: StatementNode[];
}

export interface RepeatNode {
    type: "Repeat";
    times: ExprNode;
    body: StatementNode[];
}

export interface FunctionDefNode {
    type: "FunctionDef";
    name: string;
    params: string[];
    body: StatementNode[];
}

export interface ReturnNode {
    type: "Return";
    value?: ExprNode;
}

export interface InputNode {
    type: "Input";
    prompt: ExprNode;
    target: string;
}

export type StatementNode =
    | CallStmtNode
    | AssignNode
    | IfNode
    | WhileNode
    | ForNode
    | RepeatNode
    | FunctionDefNode
    | ReturnNode
    | InputNode;

export interface PikAst {
    body: StatementNode[];
}

// Funciones de utilidad para verificar tipos
export function isCallStmt(node: StatementNode): node is CallStmtNode {
    return node.type === "CallStmt" || node.type === "Call";
}

export function isAssign(node: StatementNode): node is AssignNode {
    return node.type === "Assign";
}

export function isIf(node: StatementNode): node is IfNode {
    return node.type === "If";
}

export function isWhile(node: StatementNode): node is WhileNode {
    return node.type === "While";
}

export function isLiteral(node: ExprNode): node is LiteralNode {
    return node.type === "Literal";
}

export function isIdentifier(node: ExprNode): node is IdentifierNode {
    return node.type === "Identifier";
}