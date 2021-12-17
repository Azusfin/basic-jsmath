const basicMath = require("..")
const assert = require("assert")
const { MathOperators, degToRad } = basicMath.Utils

describe("Basic Math", function() {
    /** @type {basicMath.Utils.Operations} */
    const ops = [{
        prev: {
            type: 0,
            value: 0
        },
        next: {
            type: 0,
            value: 25
        },
        operator: MathOperators.Sum
    }, {
        prev: {
            type: 0,
            value: 25
        },
        next: {
            type: 0,
            value: 30
        },
        operator: MathOperators.Sub
    }]
    const calc = "25 - 30"
    const res = 25 - 30

    /** @type {basicMath.Utils.Operations} */
    const opsVars = [{
        prev: {
            type: 0,
            value: 0
        },
        next: {
            type: 0,
            value: 0
        },
        operator: MathOperators.Sum
    }, [{
        prev: {
            type: 0,
            value: 0
        },
        next: {
            type: 1,
            name: "r"
        },
        operator: MathOperators.Sum
    }, {
        prev: {
            type: 1,
            name: "r"
        },
        next: {
            type: 1,
            name: "s"
        },
        operator: MathOperators.Multi
    }, {
        prev: {
            type: 1,
            name: "s"
        },
        next: {
            type: 1,
            name: "t"
        },
        operator: MathOperators.Div
    }], {
        prev: {
            type: 0,
            value: 0
        },
        next: {
            type: 0,
            value: 3
        },
        operator: MathOperators.Pow
    }]
    const calcVars = "(r * s / t) ^ 3"
    const r = 34
    const s = 97
    const t = 23
    const resVars = (r * s / t) ** 3

    /** @type {basicMath.Utils.Operations} */
    const opsTri = [{
        prev: {
            type: 0,
            value: 0
        },
        next: {
            type: 2,
            name: "sin",
            params: [[{
                prev: {
                    type: 0,
                    value: 0
                },
                next: {
                    type: 2,
                    name: "deg",
                    params: [[{
                        prev: {
                            type: 0,
                            value: 0
                        },
                        next: {
                            type: 0,
                            value: 30
                        },
                        operator: MathOperators.Sum
                    }]]
                },
                operator: MathOperators.Sum
            }]]
        },
        operator: MathOperators.Sum
    }, {
        prev: {
            type: 2,
            name: "sin",
            params: [[{
                prev: {
                    type: 0,
                    value: 0
                },
                next: {
                    type: 2,
                    name: "deg",
                    params: [[{
                        prev: {
                            type: 0,
                            value: 0
                        },
                        next: {
                            type: 0,
                            value: 30
                        },
                        operator: MathOperators.Sum
                    }]]
                },
                operator: MathOperators.Sum
            }]]
        },
        next: {
            type: 2,
            name: "cos",
            params: [[{
                prev: {
                    type: 0,
                    value: 0
                },
                next: {
                    type: 2,
                    name: "deg",
                    params: [[{
                        prev: {
                            type: 0,
                            value: 0
                        },
                        next: {
                            type: 0,
                            value: 30
                        },
                        operator: MathOperators.Sum
                    }]]
                },
                operator: MathOperators.Sum
            }]]
        },
        operator: MathOperators.Sum
    }, {
        prev: {
            type: 2,
            name: "cos",
            params: [[{
                prev: {
                    type: 0,
                    value: 0
                },
                next: {
                    type: 2,
                    name: "deg",
                    params: [[{
                        prev: {
                            type: 0,
                            value: 0
                        },
                        next: {
                            type: 0,
                            value: 30
                        },
                        operator: MathOperators.Sum
                    }]]
                },
                operator: MathOperators.Sum
            }]]
        },
        next: {
            type: 2,
            name: "tan",
            params: [[{
                prev: {
                    type: 0,
                    value: 0
                },
                next: {
                    type: 2,
                    name: "deg",
                    params: [[{
                        prev: {
                            type: 0,
                            value: 0
                        },
                        next: {
                            type: 0,
                            value: 30
                        },
                        operator: MathOperators.Sum
                    }]]
                },
                operator: MathOperators.Sum
            }]]
        },
        operator: MathOperators.Sum
    }]
    const calcTri = "sin(deg(30)) + cos(deg(30)) + tan(deg(30))"
    const resTri = Math.sin(degToRad(30)) + Math.cos(degToRad(30)) + Math.tan(degToRad(30))

    const calcMath = "nthrt((10 + 9 - 8 * 7 / 6 % 5) ^ 5, 5)"
    const resMath = ((10 + 9 - 8 * 7 / 6 % 5) ** 5) ** (1 / 5)

    describe("Parse", function() {
        it(calc, function() {
            assert.deepStrictEqual(basicMath.parse(calc), ops)
        })

        it(calcVars, function() {
            assert.deepStrictEqual(basicMath.parse(calcVars), opsVars)
        })

        it(calcTri, function() {
            assert.deepStrictEqual(basicMath.parse(calcTri), opsTri)
        })
    })

    describe("Execute", function() {
        it(`${calc} == ${res}`, function() {
            assert.strictEqual(basicMath.execute(ops), res)
        })

        it(`${calcVars} where r=${r},s=${s},t=${t} == ${resVars}`, function() {
            assert.strictEqual(basicMath.execute(opsVars, { r, s, t }), resVars)
        })

        it(`${calcTri} == ${resTri}`, function() {
            assert.strictEqual(basicMath.execute(opsTri), resTri)
        })
    })

    describe("Math", function() {
        it(`${calcMath} == ${resMath}`, function() {
            assert.strictEqual(basicMath.math(calcMath), resMath)
        })

        it(`${calcVars} where r=${r},s=${s},t=${t} == ${resVars}`, function() {
            assert.strictEqual(basicMath.math(calcVars, { r, s, t }), resVars)
        })

        it(`${calcTri} == ${resTri}`, function() {
            assert.strictEqual(basicMath.math(calcTri), resTri)
        })
    })
})
