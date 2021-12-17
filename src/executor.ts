import { Block, degToRad, MathOperators, nthroot, Operations, OperationType, opExecute, radToDeg, toFixed, Variables } from "./utils"

export const defaultFunctions: Record<string, (...vals: number[]) => number> = {
    round: Math.round,
    toFixed: toFixed,
    sqrt: Math.sqrt,
    cbrt: Math.cbrt,
    nthrt: nthroot,
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    deg: degToRad,
    rad: radToDeg
}

export const defaultVariables: Record<string, number> = {
    PI: Math.PI,
    SQRT2: Math.SQRT2
}

// Math rules™️
export function prioritize(prev: OperationType, next: OperationType): boolean {
    if (Array.isArray(next)) return true
    if (Array.isArray(prev)) return false

    if (prev.operator === MathOperators.Sum || prev.operator === MathOperators.Sub) {
        return next.operator !== MathOperators.Sum && next.operator !== MathOperators.Sub
    }
    if (
        prev.operator === MathOperators.Multi ||
        prev.operator === MathOperators.Div ||
        prev.operator === MathOperators.Mod
    ) return next.operator === MathOperators.Pow

    return false
}

export function isNumber(number: unknown): number is number {
    return typeof number === "number" && !Number.isNaN(number)
}

export class ExecutorError extends Error {
    constructor(err: string, at?: string) {
        const msg = `${err}${typeof at === "string" ? ` at '${at}'` : ""}`
        super(msg)
        this.name = "ExecutorError"
    }
}

export function forwardError(from: Error, at: string): ExecutorError {
    const msg = `${from.message}${from.name === "ExecutorError" ? "" : ` [${from.name}]`}`
    const error = new ExecutorError(msg, at)

    return error
}

export class ExecutorState {
    index: number
    allowNext: boolean
    hasPrev = false

    private _prev = 0

    constructor(index: number, allowNext: boolean) {
        this.index = index
        this.allowNext = allowNext
    }

    get prev(): number {
        return this._prev
    }

    set prev(prev: number) {
        this.hasPrev = true
        this._prev = prev
    }
}

export function loadBlock(block: Block, variables: Variables, strict: boolean): number {
    if (block.type === 0) return block.value

    const { name } = block
    let variable = variables[name]

    if (block.type === 1) {
        if (Array.isArray(variable)) variable = variable[0]
        if (!isNumber(variable) && strict) throw new ExecutorError(`Variable '${name}' must be a valid number`)

        return isNumber(variable) ? variable : 0
    }

    if (Array.isArray(variable)) variable = variable[1]
    if (typeof variable !== "function" && strict) throw new ExecutorError(`Variable '${name}' must be a function`)

    try {
        const execResults = block.params.map(ops => executeOps(ops, variables, strict, new ExecutorState(0, true)))

        let funcRes = 0
        
        if (typeof variable === "function") {
            if (execResults.length < variable.length) {
                if (strict) throw new ExecutorError(`Function need atleast ${variable.length} params`, name)
                for (let i = execResults.length; i <= variable.length; i++) {
                    execResults.push(0)
                }
            }

            funcRes = variable(...execResults)
        }

        if (!isNumber(funcRes) && strict) throw new ExecutorError(`Function must return a valid number`, name)

        return isNumber(funcRes) ? funcRes : 0
    } catch(err) {
        throw forwardError(err as Error, name)
    }
}

export function initFunctions(variables: Variables): void {
    for (const [funcName, func] of Object.entries(defaultFunctions)) {
        const names = [funcName, funcName.toUpperCase()]

        for (const name of names) {
            const variable = variables[name]

            if (typeof variable === "function") continue
            if (Array.isArray(variable)) continue

            if (!isNumber(variable)) variables[name] = func
            else variables[name] = [variable, func]
        }
    }
}

export function initVariables(variables: Variables): void {
    for (const [name, value] of Object.entries(defaultVariables)) {
        const variable = variables[name]

        if (isNumber(variable)) continue
        if (Array.isArray(variable)) continue

        if (typeof variable === "function") variables[name] = [value, variable]
        else variables[name] = value
    }
}

export function executeOps(ops: Operations, variables: Variables, strict: boolean, state: ExecutorState): number {
    let result = 0

    do {
        let res: number | undefined
        const op = ops[state.index]

        if (state.index === 0 || !state.hasPrev) {
            if (Array.isArray(op)) {
                const parenthesisRes = executeOps(op, variables, strict, new ExecutorState(0, true))
                state.prev = parenthesisRes
            } else {
                const blockRes = loadBlock(op.prev, variables, strict)
                state.prev = blockRes
            }
        }

        while (state.index + 1 < ops.length) {
            const next = ops[state.index + 1]

            if (prioritize(op, next)) {
                state.index++

                if (Array.isArray(next)) {
                    const parenthesisRes = executeOps(next, variables, strict, new ExecutorState(0, true))
                    res = parenthesisRes
                } else {
                    const nextState = new ExecutorState(state.index, false)
    
                    if (res !== undefined) nextState.prev = res
    
                    res = executeOps(ops, variables, strict, nextState)
                    state.index = nextState.index
                }
            } else {
                break
            }
        }

        if (!Array.isArray(op)) {
            if (res === undefined) {
                const blockRes = loadBlock(op.next, variables, strict)
                res = blockRes
            }

            const first = state.prev
            const second = res

            res = opExecute(op.operator, first, second)
            state.prev = res
        } else {
            res = state.prev
        }

        result = res
    } while (state.allowNext && ++state.index < ops.length)

    return result
}
