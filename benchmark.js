const timersPromises = require("timers/promises")
const intervalSecs = 5

async function interval(seconds) {
    for (let i = 1; i <= seconds; i++) {
        process.stdout.write(`Interval... ${i}/${seconds}\r`)
        await timersPromises.setTimeout(1000)
    }
}

(async () => {

const basicMath = require(".")
const b = require("benny")

let opsBasic
const calcBasic = "x + y - z"
const varsBasic = {
    x: 100,
    y: 200,
    z: 300
}

let opsAdvance
const calcAdvance = "x * y / z"
const varsAdvance = {
    x: 20,
    y: 10,
    z: 200
}

let opsAdvanced
const calcAdvanced = "sqrt((a + b - c * d / e % f) ^ 2)"
const varsAdvanced = {
    a: 100,
    b: 99,
    c: 98,
    d: 97,
    e: 96,
    f: 95
}

let opsTrigonometry
const calcTrigonometry = "sin(deg(a)) * cos(deg(b)) * tan(deg(c))"
const varsTrigonometry = {
    a: 30,
    b: 60,
    c: 90
}

await interval(intervalSecs)

b.suite(
    "Parse",
    b.add("Basic", () => {
        opsBasic = basicMath.parse(calcBasic)
    }),
    b.add("Advance", () => {
        opsAdvance = basicMath.parse(calcAdvance)
    }),
    b.add("Advanced", () => {
        opsAdvanced = basicMath.parse(calcAdvanced)
    }),
    b.add("Trigonometry", () => {
        opsTrigonometry = basicMath.parse(calcTrigonometry)
    }),
    b.cycle(),
    b.complete()
)

await interval(intervalSecs)

b.suite(
    "Execute",
    b.add("Basic", () => {
        basicMath.execute(opsBasic, varsBasic)
    }),
    b.add("Advance", () => {
        basicMath.execute(opsAdvance, varsAdvance)
    }),
    b.add("Advanced", () => {
        basicMath.execute(opsAdvanced, varsAdvanced)
    }),
    b.add("Trigonometry", () => {
        basicMath.execute(opsTrigonometry, varsTrigonometry)
    }),
    b.cycle(),
    b.complete()
)

await interval(intervalSecs)

b.suite(
    "Full Cycle",
    b.add("Basic", () => {
        basicMath.math(calcBasic, varsBasic)
    }),
    b.add("Advance", () => {
        basicMath.math(calcAdvance, varsAdvance)
    }),
    b.add("Advanced", () => {
        basicMath.math(calcAdvanced, varsAdvanced)
    }),
    b.add("Trigonometry", () => {
        basicMath.math(calcTrigonometry, varsTrigonometry)
    }),
    b.cycle(),
    b.complete()
)

})()
