export function getRandomCoefficients(max: number, numberOfCoefficients: number, accuracy = 0.1) {
    let remaining = max
    const coefficients: number[] = Array(numberOfCoefficients).fill(0)
    for(let i = 0; i < numberOfCoefficients - 1; i++) {
        coefficients[i] = (2 * Math.random() * remaining - max) * (accuracy ** (numberOfCoefficients - i))

        remaining -= coefficients[i]
        if(remaining === 0) return coefficients
    }
    coefficients[numberOfCoefficients - 1] = remaining
    return coefficients
}

export function getFunctionResult(coefficients: number[], x: number, lastDegree = 0) {
    return [...coefficients].reverse().reduce((result, c, index) => result + c * x ** (index + lastDegree), 0)
}