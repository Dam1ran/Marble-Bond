import { Point } from '../shapes/point';

export class MarbleData {
  constructor (
    public pos: Point,
    public nr: number,
    public conn: number[]
  ) {}
}
