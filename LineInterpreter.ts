import { deg2rad, Line, Lines } from "./globals.ts";
import { Block, Noop, Step, Stmt, Turn, Visitor } from "./statements.ts";
import { Turtle } from "./Turtle.ts";

export class LineInterpreter implements Visitor<Lines> {
  turtle: Turtle;

  stack: Array<Turtle>;

  constructor(degreesStep: number, moveStep = 1) {
    this.stack = [];
    this.turtle = new Turtle(degreesStep * deg2rad, moveStep);
  }

  visitBlockStmt(stmt: Block): Lines {
    this.stack.push(this.turtle);

    this.turtle = this.turtle.clone();

    const lines = this.interpret(stmt.statements);

    const popped = this.stack.pop();
    if (popped) {
      this.turtle = popped;
    } else {
      throw new Error("Tried to pop from empty stack.");
    }

    return lines;
  }

  visitStepStmt(stmt: Step): Lines {
    const from = this.turtle.currentPosition;
    this.turtle.step(stmt.length);
    const to = this.turtle.currentPosition;

    return stmt.draw ? [[from, to]] : [];
  }

  visitTurnStatement(stmt: Turn): Lines {
    if (stmt.ccw) {
      this.turtle.turnCCW();
    } else {
      this.turtle.turnCW();
    }
    return [];
  }

  visitNoopStatement(_stmt: Noop): Lines {
    return [];
  }

  interpret(statements: ReadonlyArray<Stmt>): Lines {
    const result: Array<Line> = [];
    for (const statement of statements) {
      result.push(...this.execute(statement));
    }
    return result;
  }

  execute(stmt: Stmt): Lines {
    return stmt.accept(this);
  }
}
