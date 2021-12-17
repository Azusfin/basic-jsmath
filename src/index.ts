import { ExecutorState, executeOps, initFunctions, initVariables } from "./executor"
import { ParserState, parseSyn } from "./parser"
import { Operations, Variables } from "./utils"

export * as Utils from "./utils"
export * as Parser from "./parser"
export * as Executor from "./executor"

export function parse(calculation: string): Operations {
    const state = new ParserState(calculation)
    parseSyn(state)
    return state.ops
}

export function execute(operations: Operations, variables: Variables = {}, strict = true): number {
    const vars = {...variables}

    initFunctions(vars)
    initVariables(vars)

    const state = new ExecutorState(0, true)
    return executeOps(operations, vars, strict, state)
}

export function math(calculation: string, variables: Variables = {}, strict = true): number {
    const ops = parse(calculation)
    return execute(ops, variables, strict)
}

export function wrap(operations: Operations, varName: string, variables: Variables = {}, strict = true): (val: number) => number {
    return function (val: number): number {
        const vars = {...variables}
        vars[varName] = val
        return execute(operations, vars, strict)
    }
}

export function wrapMath(calculation: string, varName: string, variables: Variables = {}, strict = true): (val: number) => number {
    const ops = parse(calculation)
    return wrap(ops, varName, variables, strict)
}
