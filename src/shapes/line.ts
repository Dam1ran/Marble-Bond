import { Point } from './point';
import { Colors } from '../helpers/colors';
import { Variables } from '../helpers/variables';

export class Line {

  constructor (
    private ctx: CanvasRenderingContext2D,
    public pointStart: Point,
    public pointEnd: Point,
    public color = Colors.line
  ) {
    this.ctx = ctx;
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.moveTo(this.pointStart.xPos, this.pointStart.yPos);
    this.ctx.lineTo(this.pointEnd.xPos, this.pointEnd.yPos);
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = Variables.lineWidth;
    this.ctx.stroke();
  }

  updateStartPos(pointStart: Point): void {
    this.pointStart = pointStart;
  }

  updateEndPos(pointEnd: Point): void {
    this.pointEnd = pointEnd;
  }

  intersects(line: Line): boolean {
    let det: number;
    let gamma: number;
    let lambda: number;

    det = (line.pointEnd.xPos - line.pointStart.xPos) * (this.pointEnd.yPos - this.pointStart.yPos) -
          (this.pointEnd.xPos - this.pointStart.xPos) * (line.pointEnd.yPos - line.pointStart.yPos);

    if (det === 0) {
      return false;
    } else {

      lambda = (
        (this.pointEnd.yPos - this.pointStart.yPos) * (this.pointEnd.xPos - line.pointStart.xPos) +
        (this.pointStart.xPos - this.pointEnd.xPos) * (this.pointEnd.yPos - line.pointStart.yPos)
        ) / det;

      gamma = (
        (line.pointStart.yPos - line.pointEnd.yPos) * (this.pointEnd.xPos - line.pointStart.xPos) +
        (line.pointEnd.xPos - line.pointStart.xPos) * (this.pointEnd.yPos - line.pointStart.yPos)
        ) / det;

      return 0 < lambda && lambda < 1 && 0 < gamma && gamma < 1;
    }
  }

  setIntersect(): void {
    this.color = Colors.lineIntersected;
  }

  setUnIntersect(): void {
    this.color = Colors.line;
  }

  isSamePoints(): boolean {
    return this.pointStart.xPos === this.pointEnd.xPos && this.pointStart.yPos === this.pointEnd.yPos;
  }
}
