export interface Stmt {
  accept<R>(visitor: Visitor<R>): R;
  isEqualTo(stmt: Stmt): boolean;
}

export class Step implements Stmt {
  draw: boolean;
  length: number;

  constructor(draw: boolean, length: number = 1) {
    this.draw = draw;
    this.length = length
  }

  isEqualTo(stmt: Stmt): boolean {
    if (stmt instanceof Step) {
      // Only draw matters.
      return this.draw === stmt.draw// && this.length === stmt.length;
    }

    return false;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitStepStmt(this);
  }
}

export class Turn implements Stmt {
  ccw: boolean;

  constructor(ccw: boolean) {
    this.ccw = ccw;
  }

  isEqualTo(stmt: Stmt): boolean {
    if (stmt instanceof Turn) {
      return this.ccw === stmt.ccw;
    }

    return false;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitTurnStatement(this);
  }
}

export class Noop implements Stmt {
  name: string;
  parameters: ReadonlyArray<number>

  constructor(name: string, parameters: ReadonlyArray<number> = []) {
    this.name = name;
    this.parameters = parameters;
  }

  isEqualTo(stmt: Stmt): boolean {
    if (stmt instanceof Noop) {
      if (this.name !== stmt.name) return false;
      if (this.parameters.length !== stmt.parameters.length) return false;

      // Only number of paratemers matter.
      // for (let i = 0; i < this.parameters.length; i++) {
      //   if (this.parameters[i] !== stmt.parameters[i]) return false;
      // }

      return true;
    }

    return false
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitNoopStatement(this);
  }
}

export class Block implements Stmt {
  statements: ReadonlyArray<Stmt>;

  constructor(statements: ReadonlyArray<Stmt>) {
    this.statements = statements;
  }

  isEqualTo(stmt: Stmt): boolean {
    if (stmt instanceof Block) {
      if (this.statements.length !== stmt.statements.length) return false;

      for (let i = 0; i < this.statements.length; i++) {
        if (!this.statements[i].isEqualTo(stmt.statements[i])) return false;
      }

      return true;
    }

    return false;
  }

  accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBlockStmt(this);
  }
}

export interface Visitor<R> {
  visitNoopStatement(stmt: Noop): R;
  visitTurnStatement(stmt: Turn): R;
  visitBlockStmt(stmt: Block): R;
  visitStepStmt(stmt: Step): R;
}
