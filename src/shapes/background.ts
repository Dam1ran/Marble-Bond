import { Colors } from '../helpers/colors';

export class Background {
  constructor(public ctx: CanvasRenderingContext2D) {
  }

  draw(): void {
    const grd = this.ctx.createLinearGradient(
      this.ctx.canvas.width / 2,
      0,
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height
    );
    grd.addColorStop(0, Colors.backgroundEdge);
    grd.addColorStop(0.5, Colors.backgroundCenter);
    grd.addColorStop(1, Colors.backgroundEdge);
    this.ctx.fillStyle = grd;
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }
}
