# basic-jsmath

> A lightweight math parsing library to deal with some basic maths

## Table Of Contents
- [Methods](#methods)
    - [Parsing](#parsing)
    - [Calculate](#calculate)
    - [Function](#function)
- [Specifications](#specifications)
    - [Operations](#operations)
        - [Operation](#operation)
    - [Block](#block)
        - [Number Block](#number-block)
        - [Variable Block](#variable-block)
        - [Function Block](#function-block)
    - [Operators](#operators)
    - [Variables](#variables)
        - [Variable](#variable)
- [Helpers](#helpers)
    - [Default Variables](#default-variables)
    - [Default Functions](#default-functions)

## Methods
### Parsing
- parse(calculation: string) -> [Operations](#operations)
    > Parse math syntax into operations, refer to specifications for more info
    
    Examples:
    ```js
    // This will parse to operations which
    // can be used in execute method
    const ops = parse("1 + 2")
    ```
### Calculate
- execute(<br/>
    &nbsp; operations: [Operations](#operations),<br/>
    &nbsp; variables: [Variables](#variables) = {},<br/>
    &nbsp; strict: boolean = true<br/>
    ) -> number
    > Execute math operations and will return the result as number

    Examples:
    ```js
    // Will execute the previously parsed operations and return '3'
    const ops = parse("1 + 2")
    execute(ops)

    // Using variables, will return '3'
    const opsWithVars = parse("a + b")
    execute(opsWithVars, { a: 1, b: 2 })

    // Disable error when failed to load variables, will return '0' because no variables defined
    execute(opsWithVars, {}, false)
    ```
- math(<br/>
    &nbsp; calculation: string,<br/>
    &nbsp; variables: [Variables](#variables) = {},<br/>
    &nbsp; strict: boolean = true<br/>
    ) -> number
    > Parse and execute operations and will return the result as number

    Examples:
    ```js
    // Both works the same

    // The long path
    const ops = parse("1 + 1")
    execute(ops)

    // The short path
    math("1 + 1")
    ```
### Function
- wrap(<br/>
    &nbsp; operations: [Operations](#operations),<br/>
    &nbsp; varName: string,<br/>
    &nbsp; variables: [Variables](#variables) = {},<br/>
    &nbsp; strict: boolean = true<br/>
    ) -> ((val: number) => number)
    > Wrap the operations into a javascript function

    Examples:
    ```js
    // Parse the operations of calculating sinus, we use x as the input variable
    const sinOps = parse("sin(deg(x))")

    // Notice how we use "x" as the varName because our input variable is "x"
    const sin = wrap(sinOps, "x")

    // Will return 1
    sin(90)
    ```
- wrapMath(<br/>
    &nbsp; calculation: string,<br/>
    &nbsp; varName: string,<br/>
    &nbsp; variables: [Variables](#variables) = {},<br/>
    &nbsp; strict: boolean = true<br/>
    ) -> ((val: number) => number)
    > Parse and wrap the operations into a javascript function

    Examples:
    ```js
    // Both works the same

    // The long path
    const sinOps = parse("sin(deg(x))")
    const sin = wrap(sinOps, "x")
    
    // The short path
    const sin = wrapMath("sin(deg(x))", "x")

    // Both will return the same value
    sin(90)
    ```

## Specifications
### Operations
([Operations](#operations) | [Operation](#operation))[]
### Operation
{
    prev: [Block](#block),
    next: [Block](#block),
    operator: [Operators](#operators)
}
### Block
[Number Block](#number-block) | [Variable Block](#variable-block) | [Function Block](#function-block)
### Number Block
{
    type: 0,
    value: number
}
### Variable Block
{
    type: 1,
    name: string
}
### Function Block
{
    type: 2,
    name: string,
    params: [Operations](#operations)[]
}
### Operators
| Operator | Description |
| - | - |
| + | Summation of numbers, 1 + 2 = 3 |
| - | Subtraction of numbers, 3 - 2 = 1 |
| * | Multiplication of numbers, 2 * 2 = 4 |
| / | Division of numbers, 10 / 2 = 5 |
| % | Modulus of numbers, 7 % 2 = 1 |
| ^ | Exponentiation of number, 3 ^ 3 = 27 |
### Variables
Record<string, [Variable](#variable)>
```js
/**
 * Variables name are case-sensitive, X ≠ x
 */

// Variable only
const vars = {
    x: 100
}

// Function only
const vars = {
    x: (x) => x * x / x ** 1 / x
}

// Variable and function
const vars = {
    x: [100, (x) => x * x / x ** 1 / x]
}
```
### Variable
number | ((...values: number[]) -> number) | [number, (...values: number[]) -> number]

## Helpers
### Default Variables
| Variable | Description |
| - | - |
| PI | The ratio of the circumference of a circle to its diameter, 3.141592653589793 |
| SQRT2 | Square root of 2, 1.4142135623730951 |
### Default Functions
| Function | Description |
| - | - |
| round or ROUND | Round the provided number into nearest integer, round(2.99999) = 3 |
| toFIxed or TOFIXED | Round into nearest fixed decimal position, toFixed(8.384444, 2) = 8.38 |
| sqrt or SQRT | Square root of number, sqrt(16) = 4 |
| cbrt or CBRT | Cube root of number, cbrt(125) = 5 |
| nthrt or NTHRT | Nth root of number, nthrt(1296, 4) = 6 |
| sin or SIN | Calculate sinus of number, sin(1.5707963267948966) = 1 |
| cos or COS | Calculate cosinus of number, cos(0) = 1 |
| tan or TAN | Calculate tangent of number, tan(0.7853981633974483) = 1 |
| deg or DEG | Transform degree into radiant, deg(90) = 1.5707963267948966 |
| rad or RAD | Transform radiant into degree, rad(1.5707963267948966) = 90 |
