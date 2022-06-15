import { Rule } from "./globals.ts";
import { Step, Block, Stmt, Turn, Visitor, Noop } from "./statements.ts";

export class ReplaceByRulesTransformer implements Visitor<ReadonlyArray<Stmt>> {
  rules: readonly Rule[];

  constructor(rules: ReadonlyArray<Rule>) {
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

  visitDrawStmt(stmt: Step): ReadonlyArray<Stmt> {
    return this.applyFirstMatchingRuleTo(stmt);
  }

  applyFirstMatchingRuleTo(stmt: Stmt): ReadonlyArray<Stmt> {
    const rule = this.rules.filter(r => r[0] === stmt)[0];
    return rule ? rule[1] : [stmt];
  }

  transform (statements: ReadonlyArray<Stmt>): ReadonlyArray<Stmt> {
    return statements.flatMap(s => s.accept(this))
  }
}
