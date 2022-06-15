import { Block, Noop, Step, Stmt, Turn } from "./statements.ts";
import { LineInterpreter } from "./LineInterpreter.ts"
import { Lines, Point } from "./globals.ts";
import { ReplaceByRulesTransformer } from "./ReplaceByRulesTransformer.ts";

const Fl = new Step(true)
const Fr = new Step(true)
const F = new Step(true)
const f = new Step(false)
const m = new Turn(false)
const p = new Turn(true)
const L = new Noop()
const R = new Noop()
const X = new Noop()

const n = 5
const d = 22.5

const initial = [X]
const rules : ReadonlyArray<readonly [Stmt, ReadonlyArray<Stmt>]> = [
    [X, [
        F, m,
        new Block([
            new Block([X]), p, X
        ]),
        p, F,
        new Block([
            p, F, X
        ]),
        m, X
    ]],
    [F, [F, F]]
]

const transformer = new ReplaceByRulesTransformer(rules)

let current: Array<Stmt> = [...initial]
for (let i = 0; i < n; i++) {
    const next: Array<Stmt> = []
    next.push(...transformer.transform(current))
    current = [...next]
}

const interpreter = new LineInterpreter(d)
const lines = interpreter.interpret(current)
Deno.writeTextFileSync("abop.svg", lines2svg(lines));

function lines2svg (lines : Lines) : string {
    const bounds = lines.reduce<readonly [Point, Point]>(
        (prev, curr) => {
            const minX = Math.min(curr[0][0], curr[1][0])
            const minY = Math.min(curr[0][1], curr[1][1])
            const maxX = Math.max(curr[0][0], curr[1][0])
            const maxY = Math.max(curr[0][1], curr[1][1])

            return [
                [Math.min(prev[0][0], minX), Math.min(prev[0][1], minY)],
                [Math.max(prev[1][0], maxX), Math.max(prev[1][1], maxY)]
            ]
        },
        [[Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]]
    )
    const viewBox = [
        Math.floor(bounds[0][0]), Math.floor(bounds[0][1]),
        Math.floor(bounds[1][0] - bounds[0][0] + 1), Math.floor(bounds[1][1] - bounds[0][1] + 1)
    ]

    const result: Array<string> = []
    result.push('<?xml version="1.0"?>')
    result.push(`<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" viewBox="${viewBox.join(' ')}">`)
    result.push('  <desc>Turtle L-system SVG file</desc>')

    for (const line of lines) {
        result.push(`  <line x1="${line[0][0]}" y1="${line[0][1]}" x2="${line[1][0]}" y2="${line[1][1]}" stroke="black" stroke-width="0.5%" />`)
    }

    result.push('</svg>')
    return result.join('\r\n')
}