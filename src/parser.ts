import { Operations, MathOperators, OperationType, fromToken, Block, NumberBlock, VariableBlock, FunctionBlock } from "./utils"

const alphabets = /[A-Za-z]/

export class ParserError extends Error {
    constructor(err: string, column?: number, unexpected?: string) {
        const msg = `${
            unexpected ? `Unexpected ${unexpected}, ` : ""
        }${err}${
            column !== undefined ? ` at column ${column + 1}` : ""
        }`

        super(msg)
        this.name = "ParserError"
    }
}

export interface Parenthesis {
    prevOp: MathOperators
    func?: FunctionBlock
}

export enum ParserStates {
    NeedNumber,
    Neutral,
    NeedOp
}

export class ParserState {
    str: string
    column = 0
    prev: Block = { type: 0, value: 0 }
    op = MathOperators.Sum
    state: ParserStates = ParserStates.NeedNumber
    ops: Operations = []
    parenthesis: Parenthesis[] = []
    isNumber = true

    startBlock?: number

    constructor(str: string) {
        this.str = str
    }
}

export function isNum(token: string): boolean {
    return !isNaN(parseInt(token, 10))
}

export function resetState(state: ParserState, op: MathOperators): void {
    delete state.startBlock
    state.state = ParserStates.NeedNumber
    state.op = op
}

export function accessOps(depth: number, operations: Operations): Operations {
    let ops = operations

    for (let i = depth; i > 0; i--) {
        const last = ops[ops.length - 1]

        if (Array.isArray(last)) ops = last
        else throw new ParserError("expecting parenthesis block", undefined, "operation block")
    }

    return ops
}

export function pushOperation(depth: number, operations: Operations, op: OperationType): void {
    const ops = accessOps(depth, operations)
    ops.push(op)
}

export function parseNum(state: ParserState, sub: number): void {
    let currentNum = 0

    if (state.startBlock !== undefined) {
        const nums = state.str.slice(state.startBlock, state.column - sub)
        currentNum = parseFloat(nums)

        if (isNaN(currentNum)) throw new ParserError("Error parsing number", state.column - sub)
    }

    const numBlock: NumberBlock = {
        type: 0,
        value: currentNum
    }

    pushOperation(state.parenthesis.length, state.ops, {
        prev: state.prev,
        next: numBlock,
        operator: state.op
    })

    state.prev = numBlock
    state.state = ParserStates.NeedOp
}

export function parseBlock(state: ParserState, sub: number): void {
    if (state.isNumber) parseNum(state, sub)
    else {
        const varBlock: VariableBlock = {
            type: 1,
            name: state.str.slice(state.startBlock, state.column - sub)
        }

        pushOperation(state.parenthesis.length, state.ops, {
            prev: state.prev,
            next: varBlock,
            operator: state.op
        })

        state.prev = varBlock
        state.state = ParserStates.NeedOp
    }
}

export function parseSyn(state: ParserState): void {
    while (state.column < state.str.length) {
        const char = state.str[state.column++]
        const isAlphabet = alphabets.test(char)

        if (
            isNum(char) ||
            (
                (
                    state.state === ParserStates.NeedNumber &&
                    char === "-"
                ) ||
                (
                    isAlphabet &&
                    (
                        state.state === ParserStates.NeedNumber ||
                        (
                            state.state === ParserStates.Neutral &&
                            !state.isNumber
                        )
                    )
                )
            )
        ) {
            if (state.state === ParserStates.NeedOp) throw new ParserError("expecting an operator", state.column - 1, "number")
            else if (state.state === ParserStates.NeedNumber) {
                state.state = ParserStates.Neutral
                state.startBlock = state.column - 1
                state.isNumber = !isAlphabet
            }
        } else if (
            state.state === ParserStates.NeedNumber &&
            char !== " " && char !== "("
        ) {
            throw new ParserError("Expecting number", state.column - 1)
        } else {
            if (state.state === ParserStates.Neutral && char !== ".") parseBlock(state, 1)
            
            if (char === "." || char === " ") {
                // Reserved
            } else if (char === "(") {
                let isFunc = false

                if (state.state === ParserStates.NeedOp) {
                    if (state.prev.type !== 1) throw new ParserError("expecting a math operator", state.column - 1, "parenthesis")

                    isFunc = true

                    const block = state.prev
                    const funcBlock: FunctionBlock = {
                        type: 2,
                        name: block.name,
                        params: []
                    }

                    Object.assign(block, funcBlock)
                }

                if (!isFunc) {
                    pushOperation(state.parenthesis.length, state.ops, {
                        prev: state.prev,
                        next: { type: 0, value: 0 },
                        operator: state.op
                    })
                }

                pushOperation(state.parenthesis.length, state.ops, [])

                state.parenthesis.push({
                    prevOp: state.op,
                    func: isFunc ? state.prev as FunctionBlock : undefined
                })

                delete state.startBlock
                state.prev = { type: 0, value: 0 }
                state.op = MathOperators.Sum
                state.state = ParserStates.NeedNumber
            } else if (char === ")") {
                if (state.parenthesis.length === 0) {
                    throw new ParserError("too many end parenthesis", state.column - 1, "depth")
                }

                delete state.startBlock
                state.state = ParserStates.NeedOp
                state.prev = { type: 0, value: 0 }

                const parenthesis = state.parenthesis.pop()!
                const func = parenthesis.func

                if (func !== undefined) {
                    const ops = accessOps(state.parenthesis.length, state.ops).pop()!

                    if (!Array.isArray(ops)) throw new ParserError("while parsing function param", state.column - 1, "non-parenthesis block")
                    if (ops.length < 1) throw new ParserError("while parsing function param", state.column - 1, "empty param")

                    func.params.push(ops)
                    state.prev = func
                }

                state.op = parenthesis.prevOp
            } else if (char === ",") {
                delete state.startBlock
                state.op = MathOperators.Sum
                state.state = ParserStates.NeedNumber
                state.prev = { type: 0, value: 0 }

                const parenthesis = state.parenthesis[state.parenthesis.length - 1]
                const func = parenthesis?.func
                
                if (func === undefined) throw new ParserError("in non-function block", state.column - 1, "comma")

                const ops = accessOps(state.parenthesis.length - 1, state.ops).pop()!

                if (!Array.isArray(ops)) throw new ParserError("while parsing function param", state.column - 1, "non-parenthesis block")
                if (ops.length < 1) throw new ParserError("while parsing function param", state.column - 1, "empty param")

                func.params.push(ops)

                pushOperation(state.parenthesis.length - 1, state.ops, [])
            } else {
                try {
                    const op = fromToken(char)
                    resetState(state, op)
                } catch (err) {
                    throw new ParserError((err as Error).message, state.column - 1)
                }
            }
        }
    }

    if (state.state === ParserStates.Neutral) parseBlock(state, 0)

    if (state.parenthesis.length > 0) throw new ParserError("missing end parenthesis", undefined, "depth")
    else if (state.ops.length < 1) throw new ParserError("expecting atleast a number", undefined, "operations")
}
