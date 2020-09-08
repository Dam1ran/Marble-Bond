import { Marble } from '../shapes/marble';
import { Point } from '../shapes/point';
import { Observable, Subscriber } from 'rxjs';
import { Mouse } from '../helpers/mouse';
import { BondCreator } from './bondCreator';

export class MarbleContainer extends BondCreator{
  modified$: Observable<boolean>;
  private hasMarblesObserver = new Subscriber<boolean>();

  ordinalMarbleNumber = 0;
  isHighlight = false;

  constructor(ctx: CanvasRenderingContext2D){
    super(ctx);
    this.modified$ = new Observable<boolean>((observer) => {
      this.hasMarblesObserver = observer;
    });
  }

  addMarble(position: Point): void {
    this.collection.push(
      new Marble(this.ctx, { ...position },this.ordinalMarbleNumber)
    );
    this.ordinalMarbleNumber++;
    this.highlight();
    this.checkWinState();
    this.highlight();
    this.hasMarblesObserver.next(this.collection.length > 0);
  }

  removeMarble(position: Point): void {
    if (this.collection.length > 0) {
      this.setMaxSelectedMarble(position);
      if (this.selectedMarble != null) {
        const indexToDelete = this.collection.indexOf(this.selectedMarble);
        this.collection.forEach((marble) => {
          marble.removeBond(this.selectedMarble);
        });
        this.collection.splice(indexToDelete,1);
      }
    }
    const isNotEmpty = this.collection.length > 0;
    this.hasMarblesObserver.next(isNotEmpty);
    if (!isNotEmpty) {
      this.ordinalMarbleNumber = 0;
    }
    this.highlight();
    this.checkWinState();
    this.highlight();
  }

  draw(): void {
    this.creationBondLine?.draw();
    this.drawBonds();
    this.collection.forEach((marble) => {
      marble.draw();
    });
  }

  update(mouse: Mouse): void {
    this.createBond(mouse);
    this.checkWinState();

    if (mouse.clicked && this.selectedMarble != null) {
      this.selectedMarble.updatePos(mouse.point);
      this.highlight();
      this.isHighlight = true;
    } else {
      this.isHighlight = false;
    }

  }

  drawBonds(): void {
    this.collection.forEach((marble) => {
      marble.bonds.forEach(bond => {
        bond.draw();
      });
    });
  }

}
