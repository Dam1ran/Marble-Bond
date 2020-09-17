import { Marble } from '../shapes/marble';
import { Point } from '../shapes/point';
import { BehaviorSubject } from 'rxjs';
import { Mouse } from '../helpers/mouse';
import { SoundsLib } from '../helpers/sounds-lib';
import { Sound } from '../helpers/sound';
import { Variables } from '../helpers/variables';
import { MarbleData } from '../helpers/marbleData';
import { Line } from '../shapes/line';
import { Colors } from '../helpers/colors';

export class MarbleContainer {

  public collection = new Array<Marble>();
  modified$ = new BehaviorSubject(false);
  winState$ = new BehaviorSubject(false);
  isCreationMode = false;

  ordinalMarbleNr = 0;
  isHighlight = false;

  nrOfMarbles = 0;
  nrOfBonds = 0;
  nrOfIntersectedBonds = 0;
  prevNrOfIntersectedBonds = 9999;

  selectedMarble: Marble;
  private initialized = false;

  constructor (
    private _ctx: CanvasRenderingContext2D,
    private _soundsLib: SoundsLib,
    private _sound: Sound
  ) { }

  addMarble(position: Point): void {
    this.collection.push(
      new Marble(this._ctx, { ...position }, this.ordinalMarbleNr)
    );
    this.ordinalMarbleNr++;
    this.updateContent();
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
        this._sound.play(this._soundsLib.delete);
      }
    }
    const isNotEmpty = this.collection.length > 0;
    this.modified$.next(isNotEmpty);
    if (!isNotEmpty) {
      this.ordinalMarbleNr = 0;
    }
    this.updateContent();
  }

  draw(): void {
    this.drawBonds();
    this.collection.forEach((marble) => {
      marble.draw();
    });
  }

  update(mouse: Mouse): void {

    if (mouse.clicked && this.selectedMarble != null) {
      this.selectedMarble.updatePos(mouse.point);
      this.checkWinState();
      this.highlight();
      this.isHighlight = true;
    } else {
      this.isHighlight = false;
    }
    if (mouse.clicked) {
      this.initialized = true;
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

  writeToMarbleContainerAndUpdate(marbleData: MarbleData[]): void {
    this.collection = [];
    this.ordinalMarbleNr = 0;
    this.prevNrOfIntersectedBonds = 9999;
    if (marbleData === undefined) {
      return;
    }
    marbleData.forEach(md => {
      this.addMarble(md.pos);
    });

    marbleData.forEach(md => {
      md.conn.forEach((nr) => {
        this.addBond(md.nr, nr);
      });
    });
    this.updateContent();
    if (this.initialized) {
      this._sound.play(this._soundsLib.generate);
    }
  }

  updateContent(): void {
    this.highlight();
    this.checkWinState();
    this.highlight();
  }

  highlight(): void {
    let lines = new Array<Line>();
    this.collection.forEach((marble) => {
      marble.bonds.forEach(bond => {
        lines.push(
          bond.line
        );
      });
    });

    this.nrOfMarbles = this.collection.length;
    this.nrOfBonds = lines.length;

    let intersectedBonds = 0;
    for (let outerIndex = 0; outerIndex < lines.length; outerIndex++) {
      lines[outerIndex].setUnIntersect();

      for (let innerIndex = 0; innerIndex < lines.length; innerIndex++) {
        if (lines[outerIndex].intersects(lines[innerIndex])) {
          lines[outerIndex].setIntersect();
          intersectedBonds++;
        }
      }
    }
    this.nrOfIntersectedBonds = intersectedBonds / 2;
    lines = [];

    if (this.prevNrOfIntersectedBonds < this.nrOfIntersectedBonds) {
      this.prevNrOfIntersectedBonds = this.nrOfIntersectedBonds;
      if (this.initialized) {
        this._sound.play(this._soundsLib.intersect);
      }
    } else {
      this.prevNrOfIntersectedBonds = this.nrOfIntersectedBonds;
    }

  }

  checkWinState(): void {
    let isAllDistinctPos = true;
    this.collection.forEach(mo => {
      this.collection.forEach(mi => {
        if (mi.marbleNr !== mo.marbleNr && mo.position.xPos === mi.position.xPos && mo.position.yPos === mi.position.yPos) {
          isAllDistinctPos = false;
        }
      });
    });

    if (isAllDistinctPos &&
      this.nrOfIntersectedBonds === 0 &&
      this.nrOfBonds > 1 &&
      this.collection.length > 3 // && (this.collection.length <= this.numberOfBonds)
    ) {
      Colors.line = Colors.win;
      Colors.marble = Colors.marbleWin;
      Colors.number = Colors.numberWin;
      this.winState$.next(true);
      this._sound.playOnce(this._soundsLib.win);
    } else {
      Colors.line = Colors.default;
      Colors.marble = Colors.marbleDefault;
      Colors.number = Colors.numberDefault;
      this.winState$.next(false);
      this._sound.reset(this._soundsLib.win);
    }
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

  addBond(startMarbleNr: number, endMarbleNr: number): void {
    const firstMarble = this.collection.find(m => m.marbleNr === startMarbleNr);
    const lastMarble = this.collection.find(m => m.marbleNr === endMarbleNr);
    firstMarble.addBond(lastMarble);
  }

  clearBoard(): void {
    this.collection = [];
    this.ordinalMarbleNr = 0;
    this.highlight();
    this._sound.play(this._soundsLib.clear);
  }

  setMaxSelectedMarble(point: Point): void {
    let selectedMarbleMaxNr = 0;
    for (const marble of this.collection) {
      if (marble.pointInMarble(point)) {
        if (selectedMarbleMaxNr < marble.marbleNr) {selectedMarbleMaxNr = marble.marbleNr; }
      }
    }
    // point in max number circle
    if (this.getMarbleBy(selectedMarbleMaxNr)?.pointInMarble(point)) {
      let selected = false;

      this.selectedMarble = null;
      this.collection.forEach((innerMarble) => {
        innerMarble.isPointInMarble = selectedMarbleMaxNr === innerMarble.marbleNr;
        if (innerMarble.isPointInMarble && !selected) {
          selected = true;
          this.selectedMarble = innerMarble;
        }
      });
    } else {
      this.selectedMarble = null;
    }

  }

  getMarbleBy(marbleNr: number): Marble {
    return this.collection.find(m => m.marbleNr === marbleNr);
  }

}
