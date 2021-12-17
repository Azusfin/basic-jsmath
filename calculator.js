const basicMath = require(".")
const readline = require("readline")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

rl.on("line", input => {
    try {
        const result = basicMath.math(input, {}, false)
        console.log(`Result: ${result}`)
    } catch (err) {
        console.error(`Error: ${err.message}`)
    } finally {
        rl.prompt()
    }
})

rl.setPrompt("Calculation: ")
rl.prompt()
