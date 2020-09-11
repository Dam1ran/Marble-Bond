import { Observable, Subscriber } from 'rxjs';
import {
  debounceTime,
  shareReplay,
  throttleTime,
  filter,
} from 'rxjs/operators';
import { Point } from './point';
import { Bond } from '../entities/bond';
import { Colors } from '../helpers/colors';
import { Variables } from '../helpers/variables';

export class Marble {
  deltaPosition: Point;
  deltaVector: Point;
  isPointInMarble = false;
  selected = false;
  selectedObserver = new Subscriber<void>();
  selected$: Observable<void>;
  bonds = new Array<Bond>();
  ringSelectedAddWidth = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    public position: Point,
    public marbleNr: number,
    public ringColor = Colors.line,
    public isDrawNr = true
  ) {
    this.init();
  }

  init(): void {
    this.selected$ = new Observable<void>((observer) => {
      this.selectedObserver = observer;
    }).pipe(shareReplay());
    this.selected$.pipe(debounceTime(80)).subscribe(() => {
      this.unselect();
    });
    this.selected$
      .pipe(
        throttleTime(500),
        filter(() => !this.selected)
      )
      .subscribe(() => {
        this.select();
      });
  }

  draw(): void {
    this.ctx.beginPath();
    this.ctx.arc(
      this.position.xPos,
      this.position.yPos,
      Variables.marbleRadius,
      0,
      2 * Math.PI,
      false
    );
    this.ctx.fillStyle = Colors.marble;
    this.ctx.fill();
    this.ctx.lineWidth = Variables.ringWidth + this.ringSelectedAddWidth;
    const color = ( this.ringColor === Colors.creation ||
                    this.ringColor === Colors.creationHighlight ||
                    this.ringColor === Colors.selectedRing)

                  ? this.ringColor : Colors.line;

    this.ctx.strokeStyle = color;
    this.ctx.stroke();
    if (this.selected) {
      this.drawSelected();
    }
    if (this.isDrawNr) {
      this.drawNumber();
    }
  }

  drawNumber(): void {
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
    this.position.xPos = point.xPos - this.deltaVector.xPos;
    this.position.yPos = point.yPos - this.deltaVector.yPos;

    this.selectedObserver.next();
  }

  drawSelected(): void {
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

  select(): void {
    this.ringColor = Colors.selectedRing;
    this.ringSelectedAddWidth = 1;

    this.selected = true;
  }

  unselect(): void {
    this.ringColor = Colors.line;
    this.ringSelectedAddWidth = 0;

    this.selected = false;
  }

  pointInMarble(point: Point): boolean {
    this.deltaPosition = {
      xPos: Math.abs(point.xPos - this.position.xPos),
      yPos: Math.abs(point.yPos - this.position.yPos),
    };
    this.deltaVector = {
      xPos: point.xPos - this.position.xPos,
      yPos: point.yPos - this.position.yPos,
    };

    if (this.deltaPosition.xPos > Variables.marbleRadius) {
      this.isPointInMarble = false;
      return false;
    }

    if (this.deltaPosition.yPos > Variables.marbleRadius) {
      this.isPointInMarble = false;
      return false;
    }

    if (this.deltaPosition.xPos + this.deltaPosition.yPos <= Variables.marbleRadius) {
      this.isPointInMarble = true;
      return true;
    }

    if (Math.pow(this.deltaPosition.xPos, 2) + Math.pow(this.deltaPosition.yPos, 2) <= Math.pow(Variables.marbleRadius, 2)) {
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
