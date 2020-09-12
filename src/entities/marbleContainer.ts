import { Marble } from '../shapes/marble';
import { Point } from '../shapes/point';
import { BehaviorSubject } from 'rxjs';
import { Mouse } from '../helpers/mouse';
import { BondCreator } from './bondCreator';
import { Sounds } from '../helpers/sounds';
import { Sound } from '../helpers/sound';

export class MarbleContainer extends BondCreator{
  modified$ = new BehaviorSubject(false);

  ordinalMarbleNr = 0;
  isHighlight = false;

  constructor(ctx: CanvasRenderingContext2D){
    super(ctx);
  }

  addMarble(position: Point): void {
    this.collection.push(
      new Marble(this.ctx, { ...position },this.ordinalMarbleNr)
    );
    this.ordinalMarbleNr++;
    this.highlight();
    this.checkWinState();
    this.highlight();
    this.modified$.next(this.collection.length > 0);
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
        Sound.play(Sounds.delete);
      }
    }
    const isNotEmpty = this.collection.length > 0;
    this.modified$.next(isNotEmpty);
    if (!isNotEmpty) {
      this.ordinalMarbleNr = 0;
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
