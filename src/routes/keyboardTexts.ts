export const portfolioQuote = `I am a developer by profession,
a physics student by compassion.` as const
export const myName = '- Subham Bhattacharjee' as const
export const bigNavButtonTransition = "calc(var(--width) / 2 + 3ch)" as const

export type AllTexts = typeof portfolioQuote | typeof myName | "none" | typeof bigNavButtonTransition
