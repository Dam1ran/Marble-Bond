import { Point } from '../shapes/point';
import { Line } from '../shapes/line';

export class Bond {

  line: Line;

  constructor (
    private ctx: CanvasRenderingContext2D,
    public pointStart: Point,
    public pointEnd: Point
  ) {
    this.line = new Line(this.ctx, this.pointStart, this.pointEnd);
  }

  draw(): void {
    this.line.draw();
  }

}
