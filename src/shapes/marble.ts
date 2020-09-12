import { Subject } from 'rxjs';
import { debounceTime, throttleTime, filter } from 'rxjs/operators';
import { Point } from './point';
import { Bond } from '../entities/bond';
import { Colors } from '../helpers/colors';
import { Variables } from '../helpers/variables';

export class Marble {
  private _select$ = new Subject();
  private _deltaPosition: Point;
  private _selected = false;
  private _deltaVector: Point;
  private _ringSelectedAddWidth = 0;

  bonds = new Array<Bond>();
  isPointInMarble = false;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public position: Point,
    public marbleNr: number,
    public ringColor = Colors.line,
    public isDrawNr = true
  ) {
    this.init();
  }

  private init(): void {
    this._select$.pipe(debounceTime(80)).subscribe(() => this.setUnselect());
    this._select$.pipe(throttleTime(400), filter(() => !this._selected)).subscribe(() => this.setSelect());
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.arc(this.position.xPos, this.position.yPos, Variables.marbleRadius, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = Colors.marble;
    this.ctx.fill();
    this.ctx.lineWidth = Variables.ringWidth + this._ringSelectedAddWidth;
    const color = ( this.ringColor === Colors.creation ||
                    this.ringColor === Colors.creationHighlight ||
                    this.ringColor === Colors.selectedRing)
                  ? this.ringColor : Colors.line;

    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    if (this._selected) {
      this.drawSelected();
    }
    if (this.isDrawNr) {
      this.drawNumber();
    }
  }

  private drawNumber(): void {
    this.ctx.font = `${Variables.fontNrSize}px Arial`;
    this.ctx.fillStyle = Colors.number;
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      (this.marbleNr + 0).toString(), // + 1
      this.position.xPos,
      this.position.yPos + 5
    );
  }

  updatePos(point: Point): void {
    this.position.xPos = point.xPos - this._deltaVector.xPos;
    this.position.yPos = point.yPos - this._deltaVector.yPos;

    this._select$.next();
  }

  private drawSelected(): void {
    this.ctx.beginPath();
    this.ctx.arc(
      this.position.xPos,
      this.position.yPos,
      Variables.marbleRadius / 1.33,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = Colors.selectedMarble;
    this.ctx.strokeStyle = this.ringColor;
    this.ctx.fill();
  }

  private setSelect(): void {
    this.ringColor = Colors.selectedRing;
    this._ringSelectedAddWidth = 1;

    this._selected = true;
  }

  private setUnselect(): void {
    this.ringColor = Colors.line;
    this._ringSelectedAddWidth = 0;

    this._selected = false;
  }

  pointInMarble(point: Point): boolean {
    this._deltaPosition = {
      xPos: Math.abs(point.xPos - this.position.xPos),
      yPos: Math.abs(point.yPos - this.position.yPos),
    };
    this._deltaVector = {
      xPos: point.xPos - this.position.xPos,
      yPos: point.yPos - this.position.yPos,
    };

    if (this._deltaPosition.xPos > Variables.marbleRadius) {
      this.isPointInMarble = false;
      return false;
    }

    if (this._deltaPosition.yPos > Variables.marbleRadius) {
      this.isPointInMarble = false;
      return false;
    }

    if (this._deltaPosition.xPos + this._deltaPosition.yPos <= Variables.marbleRadius) {
      this.isPointInMarble = true;
      return true;
    }

    if (Math.pow(this._deltaPosition.xPos, 2) + Math.pow(this._deltaPosition.yPos, 2) <= Math.pow(Variables.marbleRadius, 2)) {
      this.isPointInMarble = true;
      return true;
    } else {
      this.isPointInMarble = false;
      return false;
    }
  }

  addBond(marble: Marble): void {
    const bondToAdd = this.getBondBy(marble);
    if (bondToAdd === undefined) {
      this.bonds.push(
        new Bond(this.ctx, this.position, marble.position)
      );
    }
  }

  removeBond(marble: Marble): void {
    const bondToDelete = this.getBondBy(marble);
    const bondIndexToDelete = this.bonds.indexOf(bondToDelete);
    if (bondIndexToDelete >= 0) {
      this.bonds.splice(bondIndexToDelete,1);
    }
  }

  getBondBy(marble: Marble): Bond {
    return this.bonds.find(b =>
      (b.pointStart.xPos === this.position.xPos && b.pointStart.yPos === this.position.yPos) &&
      (b.pointEnd.xPos === marble.position.xPos && b.pointEnd.yPos === marble.position.yPos)
    );
  }

  deleteAllBonds(): void{
    this.bonds = [];
  }

}
