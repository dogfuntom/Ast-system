import { Block, Noop, Step, Stmt, Turn } from "./statements.ts";
import { LineInterpreter } from "./LineInterpreter.ts";
import { Lines, Point, Production } from "./globals.ts";
import { ProductionsTransformer } from "./ReplaceByRulesTransformer.ts";

const Fl = new Step(true);
const Fr = new Step(true);
// const F = new Step(true)
const f = new Step(false);
const m = new Turn(false);
const p = new Turn(true);
const L = new Noop("L");
// const R = new Noop('R')
const X = new Noop("X");

const A = (s: number) => new Noop("A", [s]);
const F = (s: number) => new Step(true, s);

const R = 1.456;
const n = 10;
const d = 85;

const axiom = [A(1)];
// Values don't matter in predecessors, only the number of them.
const productions: ReadonlyArray<Production> = [
  {
    // A(s)
    predecessor: (a: Stmt) => (a instanceof Noop) && a.parameters.length === 1,
    successor: (a: Stmt) => {
      if (a instanceof Noop) {
        const s = a.parameters[0];
        return [F(s), new Block([p, A(s / R)]), new Block([m, A(s / R)])];
      }

      throw new Error('Predecessor and successor contradict each other.');
    },
  },
];

const transformer = new ProductionsTransformer(productions);

let current: Array<Stmt> = [...axiom];
for (let i = 0; i < n; i++) {
  const next: Array<Stmt> = [];
  next.push(...transformer.transform(current));
  current = [...next];
}

const interpreter = new LineInterpreter(d, 64);
const lines = interpreter.interpret(current);
Deno.writeTextFileSync("abop.svg", lines2svg(lines));

function lines2svg(lines: Lines): string {
  const bounds = lines.reduce<readonly [Point, Point]>(
    (prev, curr) => {
      const minX = Math.min(curr[0][0], curr[1][0]);
      const minY = Math.min(curr[0][1], curr[1][1]);
      const maxX = Math.max(curr[0][0], curr[1][0]);
      const maxY = Math.max(curr[0][1], curr[1][1]);

      return [
        [Math.min(prev[0][0], minX), Math.min(prev[0][1], minY)],
        [Math.max(prev[1][0], maxX), Math.max(prev[1][1], maxY)],
      ];
    },
    [[Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER], [
      Number.MIN_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]],
  );
  const viewBox = [
    Math.floor(bounds[0][0]),
    Math.floor(bounds[0][1]),
    Math.floor(bounds[1][0] - bounds[0][0] + 1),
    Math.floor(bounds[1][1] - bounds[0][1] + 1),
  ];

  const result: Array<string> = [];
  result.push('<?xml version="1.0"?>');
  result.push(
    `<svg xmlns="http://www.w3.org/2000/svg" version="1.2" baseProfile="tiny" viewBox="${
      viewBox.join(" ")
    }">`,
  );
  result.push("  <desc>Turtle L-system SVG file</desc>");

  for (const line of lines) {
    result.push(
      `  <line x1="${line[0][0]}" y1="${line[0][1]}" x2="${line[1][0]}" y2="${
        line[1][1]
      }" stroke="black" stroke-width="0.5%" />`,
    );
  }

  result.push("</svg>");
  return result.join("\r\n");
}
