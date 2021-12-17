export enum MathOperators {
    Sum = "+",
    Sub = "-",
    Multi = "*",
    Div = "/",
    Mod = "%",
    Pow = "^"
}

export function fromToken(token: string): MathOperators {
    switch (token) {
        case "+":
            return MathOperators.Sum
        case "-":
            return MathOperators.Sub
        case "*":
            return MathOperators.Multi
        case "/":
            return MathOperators.Div
        case "%":
            return MathOperators.Mod
        case "^":
            return MathOperators.Pow
        default:
            throw new Error(`Unexpected Token '${token}', expecting a math operator`)
    }
}

export function opExecute(op: MathOperators, prev: number, next: number): number {
    switch (op) {
        case MathOperators.Sum:
            return prev + next
        case MathOperators.Sub:
            return prev - next
        case MathOperators.Multi:
            return prev * next
        case MathOperators.Div:
            return prev / next
        case MathOperators.Mod:
            return prev % next
        case MathOperators.Pow:
            return prev ** next
    }
}

export interface NumberBlock {
    type: 0
    value: number
}

export interface VariableBlock {
    type: 1
    name: string
}

export interface FunctionBlock {
    type: 2
    name: string
    params: Operations[]
}

export type Block = NumberBlock | VariableBlock | FunctionBlock

export interface Operation {
    prev: Block
    next: Block
    operator: MathOperators
}

export type OperationType = Operation | Operations
export type Operations = OperationType[]

export type Variable = [number, (...values: number[]) => number] | ((...values: number[]) => number) | number
export type Variables = Record<string, Variable>

// Code from https://stackoverflow.com/a/7308672
export function nthroot(x: number, n: number): number {
    const negate = n % 2 == 1 && x < 0
    if (negate) x = -x
    const possible = Math.pow(x, 1 / n)
    n = Math.pow(possible, n)
    return negate ? -possible : possible
}

export function degToRad(deg: number): number {
    return deg * Math.PI / 180
}

export function radToDeg(rad: number): number {
    return rad * 180 / Math.PI
}

export function toFixed(num: number, pos: number): number {
    return parseFloat(Number.prototype.toFixed.call(num, pos))
}
