import { Production } from "./globals.ts";
import { Step, Block, Stmt, Turn, Visitor, Noop } from "./statements.ts";

export class ProductionsTransformer implements Visitor<ReadonlyArray<Stmt>> {
  rules: readonly Production[];

  constructor(rules: ReadonlyArray<Production>) {
    this.rules = rules;
  }

  visitNoopStatement(stmt: Noop): ReadonlyArray<Stmt> {
    return this.applyFirstMatchingRuleTo(stmt);
  }

  visitTurnStatement(stmt: Turn): ReadonlyArray<Stmt> {
    return this.applyFirstMatchingRuleTo(stmt);
  }

  visitBlockStmt(stmt: Block): ReadonlyArray<Stmt> {
    return [new Block(
      stmt.statements.flatMap(s => s.accept(this))
    )];
  }

  visitStepStmt(stmt: Step): ReadonlyArray<Stmt> {
    return this.applyFirstMatchingRuleTo(stmt);
  }

  applyFirstMatchingRuleTo(stmt: Stmt): ReadonlyArray<Stmt> {
    const rule = this.rules.filter(r => r.predecessor(stmt))[0];
    return rule ? rule.successor(stmt) : [stmt];
  }

  transform (statements: ReadonlyArray<Stmt>): ReadonlyArray<Stmt> {
    return statements.flatMap(s => s.accept(this))
  }
}
