export const portfolioQuote = `I am a developer by profession,
a physics student by compassion.` as const
export const myName = '- Subham Bhattacharjee' as const
export const bigNavButtonTransition = "calc(max(min(60vw, 50vh, 100vh - 16em), 10rem) / 2 + 3ch)" as const

export type AllTexts = typeof portfolioQuote | typeof myName | "none" | typeof bigNavButtonTransition
