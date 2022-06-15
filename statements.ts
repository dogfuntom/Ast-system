export interface Stmt {
  accept<R>(visitor: Visitor<R>): R;
}

export class Step implements Stmt {
    draw: boolean

    constructor (draw: boolean) {
        this.draw = draw
    }

    accept<R> (visitor: Visitor<R>): R {
        return visitor.visitDrawStmt(this)
    }
}

export class Turn implements Stmt {
    ccw: boolean

    constructor (ccw: boolean) {
        this.ccw = ccw
    }

    accept<R> (visitor: Visitor<R>): R {
        return visitor.visitTurnStatement(this)
    }
}

export class Noop implements Stmt {
    accept<R> (visitor: Visitor<R>): R {
        return visitor.visitNoopStatement(this)
    }
}

export class Block implements Stmt {
    statements: ReadonlyArray<Stmt>

    constructor (statements: ReadonlyArray<Stmt>) {
        this.statements = statements
    }

    accept<R>(visitor: Visitor<R>): R {
        return visitor.visitBlockStmt(this)
    }
}

export interface Visitor<R> {
    visitNoopStatement(stmt: Noop): R;
    visitTurnStatement(stmt: Turn): R;
    visitBlockStmt(stmt: Block): R
    visitDrawStmt(stmt: Step): R
}
