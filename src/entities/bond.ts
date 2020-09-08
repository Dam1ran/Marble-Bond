import { Point } from '../shapes/point';
import { Line } from '../shapes/line';

export class Bond {

  line: Line;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public pointStart: Point,
    public pointEnd: Point
  ) {
    this.line = new Line(this.ctx, this.pointStart, this.pointEnd);
  }

  draw(): void {
    this.line.draw();
  }

  intersects(bond: Bond): void {
    if (
      (bond.line.pointStart.xPos === this.line.pointStart.xPos &&
        bond.line.pointStart.yPos === this.line.pointStart.yPos) ||
      (bond.line.pointEnd.xPos === this.line.pointEnd.xPos &&
        bond.line.pointEnd.yPos === this.line.pointEnd.yPos)
    ) {
      return;
    }
    if (this.line.intersects(bond.line)) {
      this.line.setIntersect();
    }
  }

  setUnIntersect(): void {
    this.line.setUnIntersect();
  }
}
