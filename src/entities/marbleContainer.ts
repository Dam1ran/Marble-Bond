import { Marble } from '../shapes/marble';
import { Point } from '../shapes/point';
import { BehaviorSubject } from 'rxjs';
import { Mouse } from '../helpers/mouse';
import { BondCreator } from './bondCreator';
import { SoundsLib } from '../helpers/sounds-lib';
import { Sound } from '../helpers/sound';
import { Variables } from '../helpers/variables';

export class MarbleContainer extends BondCreator {
  modified$ = new BehaviorSubject(false);

  ordinalMarbleNr = 0;
  isHighlight = false;

  constructor (ctx: CanvasRenderingContext2D){
    super(ctx);
  }

  addMarble(position: Point): void {
    this.collection.push(
      new Marble(this.ctx, { ...position }, this.ordinalMarbleNr)
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
        this.collection.splice(indexToDelete, 1);
        Sound.play(SoundsLib.delete);
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

    if (mouse.clicked && this.selectedMarble != null) {
      this.selectedMarble.updatePos(mouse.point);
      this.checkWinState();
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

  decreaseSizes(): void {
    Variables.marbleRadius = Variables.marbleRadius > 4 ?
    --Variables.marbleRadius
    : Variables.marbleRadius;

    Variables.ringWidth = Variables.ringWidth > 1 ?
      --Variables.ringWidth
      : Variables.ringWidth;

    Variables.lineWidth = (Variables.lineWidth > 1 && (Variables.marbleRadius < 5 || Variables.marbleRadius > 12)) ?
      --Variables.lineWidth
      : Variables.lineWidth;

    Variables.fontNrSize = (Variables.marbleRadius >= 6) && (Variables.marbleRadius <= 13) ?
      (Variables.marbleRadius + 2)
      : 15;
  }

  increaseSizes(): void {
    Variables.marbleRadius = Variables.marbleRadius < Variables.maxMarbleRadius ?
    ++Variables.marbleRadius
    : Variables.marbleRadius;

    Variables.ringWidth = (Variables.ringWidth < Variables.maxRingWidth && Variables.marbleRadius > 12) ?
      ++Variables.ringWidth
      : Variables.ringWidth;

    Variables.lineWidth = ((Variables.lineWidth < Variables.maxLineWidth) && ((Variables.marbleRadius > 12) || (Variables.marbleRadius < 6))) ?
      ++Variables.lineWidth
      : Variables.lineWidth;

    Variables.fontNrSize = (Variables.marbleRadius >= 6) && (Variables.marbleRadius <= 13) ?
      (Variables.marbleRadius + 2)
      : 15;
  }

  resetSizes(): void {
    Variables.marbleRadius = 13;
    Variables.ringWidth = 2;
    Variables.lineWidth = 2;
    Variables.fontNrSize = 13;
  }



  animateWin(): void {

    const sizeInterval = setInterval(() => {
      this.increaseSizes();
    }, 80);

    setTimeout(() => {
      clearInterval(sizeInterval);
      this.resetSizes();
    }, 5000);


    this.collection.forEach(m => {

      const length = Math.sqrt(Math.floor((Math.pow((m.position.yPos - 350), 2) + Math.pow((m.position.xPos - 300), 2))));
      const vec = new Point((300 - m.position.xPos ), (350 - m.position.yPos));
      const vecNormalized = new Point(vec.xPos / length, vec.yPos / length);

      const interval = setInterval(() => {
        if (m.position.xPos < 298 || m.position.xPos > 302) {
        m.position.xPos += vecNormalized.xPos * 2;
        } else {
          m.position.xPos = 300;
        }
        if (m.position.yPos < 348 || m.position.yPos > 352) {
          m.position.yPos += vecNormalized.yPos * 2;
        } else {
          m.position.yPos = 350;
        }
      }, 20);

      setTimeout(() => clearInterval(interval), 5000);

    });

  }

}
