import { deg2rad, Point, rad2deg } from "./globals.ts";

export class Turtle {
  readonly stepMagnitude: number;
  readonly stepRadians: number;

  currentPosition: Point;
  currentRadians: number;

  constructor(
    stepRadians: number,
    stepMagnitude = 1,
    initialRadians = -90 * deg2rad,
    initialPosition: readonly [number, number] = [0, 0],
  ) {
    this.stepRadians = stepRadians;
    this.stepMagnitude = stepMagnitude;

    this.currentPosition = initialPosition;
    this.currentRadians = initialRadians;
  }

  step(length: number) {
    const [x, y] = this.currentPosition;
    this.currentPosition = [
      x + Math.cos(this.currentRadians) * this.stepMagnitude * length,
      y + Math.sin(this.currentRadians) * this.stepMagnitude * length,
    ];
  }

  turnCCW() {
    this.currentRadians -= this.stepRadians;
  }

  turnCW() {
    this.currentRadians += this.stepRadians;
  }

  clone() {
    return new Turtle(
      this.stepRadians,
      this.stepMagnitude,
      this.currentRadians,
      this.currentPosition,
    );
  }

  toString() {
    return `Turtle(x=${this.currentPosition[0]}, y=${
      this.currentPosition[1]
    }, deg=${this.currentRadians * rad2deg})`;
  }
}
