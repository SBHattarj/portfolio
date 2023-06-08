import { describe, it, expect } from "vitest";
import { range } from "./array";

describe('array tests', () => {
    it('range end only', () => {
        expect([...range(10)]).lengthOf(10)
        expect([...range(10)]).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
    })
    it('range start end', () => {
        expect([...range(5, 10)]).lengthOf(5)
        expect([...range(5, 10)]).toEqual([5, 6, 7, 8, 9])
    })
    it('range start end tick', () => {
        expect([...range(5, 10, 2)]).lengthOf(3)
        expect([...range(5, 10, 2)]).toEqual([5, 7, 9])
    })
})