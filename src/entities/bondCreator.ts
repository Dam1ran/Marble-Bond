import { Mouse } from '../helpers/mouse';
import { Marble } from '../shapes/marble';
import { Line } from '../shapes/line';
import { Point } from '../shapes/point';
import { Bond } from './bond';
import { Colors } from '../helpers/colors';
import { SoundsLib } from '../helpers/sounds-lib';
import { Sound } from '../helpers/sound';
import { BehaviorSubject } from 'rxjs';

export class BondCreator {

  public collection = new Array<Marble>();
  protected selectedMarble: Marble;

  protected creationBondLine: Line;
  protected isBondLineDone = false;
  private _startMarbleNrForCreation = -1;
  private _endMarbleNrForCreation = -1;

  nrOfMarbles = 0;
  nrOfBonds = 0;
  nrOfIntersectedBonds = 0;
  prevNrOfIntersectedBonds = 9999;

  winState$ = new BehaviorSubject(false);

  constructor (protected ctx: CanvasRenderingContext2D) {}

  createBond(mouse: Mouse): void {
    if (mouse.middleClicked) {
      if (!mouse.middleHold && this.selectedMarble != null) {
        mouse.middleHold = true;
        this._startMarbleNrForCreation = this.selectedMarble.marbleNr;

        this.selectedMarble.ringColor = Colors.creation;
        Sound.playOnce(SoundsLib.draw);
        this.creationBondLine = new Line(this.ctx, {...this.selectedMarble.position}, mouse.point, Colors.creation);
      } else
      if (mouse.middleHold && this.creationBondLine != null) {
        this.setMaxSelectedMarble(mouse.point);
        if (this.selectedMarble != null){
          this.creationBondLine.pointEnd = {...this.selectedMarble.position};
          this._endMarbleNrForCreation = this.selectedMarble.marbleNr;

          this.creationBondLine.color = Colors.creationHighlight;
          if (this._startMarbleNrForCreation !== this._endMarbleNrForCreation) {
            this.getMarbleBy(this._startMarbleNrForCreation).ringColor = Colors.creationHighlight;
            this.getMarbleBy(this._endMarbleNrForCreation).ringColor = Colors.creationHighlight;
          }
          this.isBondLineDone = true;
        } else {
          this.creationBondLine.pointEnd = mouse.point;

          this.creationBondLine.color = Colors.creation;
          this.getMarbleBy(this._startMarbleNrForCreation).ringColor = Colors.creation;
          if (this._startMarbleNrForCreation !== this._endMarbleNrForCreation) {
            this.getMarbleBy(this._endMarbleNrForCreation).ringColor = Colors.line;
          }
          this.isBondLineDone = false;
        }
      }
    } else if (this.creationBondLine != null) {
      if (this.isBondLineDone && !this.creationBondLine.isSamePoints()) {
        this.isBondLineDone = false;

        const forwardBondToRemove = this.getBondBy(this._startMarbleNrForCreation, this._endMarbleNrForCreation);
        const backwardBondToRemove = this.getBondBy(this._endMarbleNrForCreation, this._startMarbleNrForCreation);

        if (forwardBondToRemove != null || backwardBondToRemove != null) {
          this.removeBond(this._startMarbleNrForCreation, this._endMarbleNrForCreation);
          this.removeBond(this._endMarbleNrForCreation, this._startMarbleNrForCreation);
          Sound.play(SoundsLib.remove);
        } else {
          this.addBond(this._startMarbleNrForCreation, this._endMarbleNrForCreation);
          Sound.play(SoundsLib.connect);
        }
      }
      this.getMarbleBy(this._startMarbleNrForCreation).ringColor = Colors.line;
      this.getMarbleBy(this._endMarbleNrForCreation).ringColor = Colors.line;
      this.creationBondLine = null;
      this.highlight();
      this.checkWinState();
      this.highlight();
      Sound.reset(SoundsLib.draw);
    }
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
      Sound.play(SoundsLib.intersect);
      this.prevNrOfIntersectedBonds = this.nrOfIntersectedBonds;
    } else {
      this.prevNrOfIntersectedBonds = this.nrOfIntersectedBonds;
    }

  }

  getBondBy(startMarbleNr: number, endMarbleNr: number): Bond {
    const firstMarble = this.collection.find(m => m.marbleNr === startMarbleNr);
    const lastMarble = this.collection.find(m => m.marbleNr === endMarbleNr);
    return firstMarble.getBondBy(lastMarble);
  }

  addBond(startMarbleNr: number, endMarbleNr: number): void {
    const firstMarble = this.collection.find(m => m.marbleNr === startMarbleNr);
    const lastMarble = this.collection.find(m => m.marbleNr === endMarbleNr);
    firstMarble.addBond(lastMarble);
  }

  removeBond(startMarbleNr: number, endMarbleNr: number): void {
    const firstMarble = this.collection.find(m => m.marbleNr === startMarbleNr);
    const lastMarble = this.collection.find(m => m.marbleNr === endMarbleNr);
    firstMarble.removeBond(lastMarble);
  }

  getMarbleBy(marbleNr: number): Marble {
    return this.collection.find(m => m.marbleNr === marbleNr);
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
      Sound.playOnce(SoundsLib.win);
    } else {
      Colors.line = Colors.default;
      Colors.marble = Colors.marbleDefault;
      Colors.number = Colors.numberDefault;
      this.winState$.next(false);
      Sound.reset(SoundsLib.win);
    }
  }

}
