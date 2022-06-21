import { Stmt } from "./statements.ts";

export const rad2deg = 180 / Math.PI
export const deg2rad = Math.PI / 180

export type Point = readonly [number, number]
export type Line = readonly [Point, Point]
export type Lines = ReadonlyArray<Line>

// export type Rule = readonly [Stmt, ReadonlyArray<Stmt>]

export interface Production {
    predecessor: (stmt: Stmt) => boolean,
    successor: (stmt: Stmt) => ReadonlyArray<Stmt>
}
