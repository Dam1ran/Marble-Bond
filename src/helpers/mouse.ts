import { Point } from '../shapes/point';

export class Mouse {
  constructor (
    public point = new Point(),
    public clicked = false,
    public hold = false,
    public selected = false,
    public middleClicked = false,
    public middleHold = false
  ) {}
}
