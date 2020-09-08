import { Mouse } from '../helpers/mouse';
import { Marble } from '../shapes/marble';
import { Line } from '../shapes/line';
import { Point } from '../shapes/point';
import { Bond } from './bond';
import { Colors } from '../helpers/colors';

export class BondCreator {

  public collection = new Array<Marble>();
  protected selectedMarble: Marble;

  protected creationBondLine: Line;
  protected isBondLineDone = false;
  private startMarbleNumberForCreation = -1;
  private endMarbleNumberForCreation = -1;

  numberOfMarbles = 0;
  numberOfBonds = 0;
  numberOfIntersectedBonds = 0;

  constructor(protected ctx: CanvasRenderingContext2D) {}

  createBond(mouse: Mouse) {
    if (mouse.middleClicked) {
      if (!mouse.middleHold && this.selectedMarble != null) {
        mouse.middleHold = true;
        this.startMarbleNumberForCreation = this.selectedMarble.marbleNumber;

        this.selectedMarble.ringColor = Colors.creation;

        this.creationBondLine = new Line(this.ctx, {...this.selectedMarble.position}, mouse.point, Colors.creation);
      } else
      if (mouse.middleHold && this.creationBondLine != null) {
        this.setMaxSelectedMarble(mouse.point);
        if (this.selectedMarble != null){
          this.creationBondLine.pointEnd = {...this.selectedMarble.position};
          this.endMarbleNumberForCreation = this.selectedMarble.marbleNumber;

          this.creationBondLine.color = Colors.creationHighlight;
          if (this.startMarbleNumberForCreation !== this.endMarbleNumberForCreation) {
            this.getMarbleByNumber(this.startMarbleNumberForCreation).ringColor = Colors.creationHighlight;
            this.getMarbleByNumber(this.endMarbleNumberForCreation).ringColor = Colors.creationHighlight;
          }
          this.isBondLineDone = true;
        } else {
          this.creationBondLine.pointEnd = mouse.point;

          this.creationBondLine.color = Colors.creation;
          this.getMarbleByNumber(this.startMarbleNumberForCreation).ringColor = Colors.creation;
          if (this.startMarbleNumberForCreation !== this.endMarbleNumberForCreation) {
            this.getMarbleByNumber(this.endMarbleNumberForCreation).ringColor = Colors.line;
          }
          this.isBondLineDone = false;
        }
      }
    } else if (this.creationBondLine != null) {
      if (this.isBondLineDone && !this.creationBondLine.isSamePoints()) {
        this.isBondLineDone = false;

        const forwardBondToRemove = this.getBondBy(this.startMarbleNumberForCreation, this.endMarbleNumberForCreation);
        const backwardBondToRemove = this.getBondBy(this.endMarbleNumberForCreation, this.startMarbleNumberForCreation);

        if (forwardBondToRemove != null || backwardBondToRemove != null) {
          this.removeBond(this.startMarbleNumberForCreation, this.endMarbleNumberForCreation);
          this.removeBond(this.endMarbleNumberForCreation, this.startMarbleNumberForCreation);
        } else {
          this.addBond(this.startMarbleNumberForCreation, this.endMarbleNumberForCreation);
        }
      }
      this.getMarbleByNumber(this.startMarbleNumberForCreation).ringColor = Colors.line;
      this.getMarbleByNumber(this.endMarbleNumberForCreation).ringColor = Colors.line;
      this.creationBondLine = null;
      this.highlight();
      this.checkWinState();
      this.highlight();
    }
  }

  setMaxSelectedMarble(point: Point): void {
    let selectedMarbleMaxNumber = 0;
    for (const marble of this.collection) {
      if (marble.pointInMarble(point)) {
        if (selectedMarbleMaxNumber < marble.marbleNumber) {selectedMarbleMaxNumber = marble.marbleNumber; }
      }
    }

    // point in max number circle
    if (this.getMarbleByNumber(selectedMarbleMaxNumber)?.pointInMarble(point)) {
      let selected = false;

      this.selectedMarble = null;
      this.collection.forEach((innerMarble) => {
        innerMarble.isPointInMarble = selectedMarbleMaxNumber === innerMarble.marbleNumber;
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

    this.numberOfMarbles = this.collection.length;
    this.numberOfBonds = lines.length;

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
    this.numberOfIntersectedBonds = intersectedBonds / 2;

    lines = [];

  }

  getBondBy(startMarbleNumber: number, endMarbleNumber: number): Bond {
    const firstMarble = this.collection.find(m => m.marbleNumber === startMarbleNumber);
    const lastMarble = this.collection.find(m => m.marbleNumber === endMarbleNumber);
    return firstMarble.getBondBy(lastMarble);
  }

  addBond(startMarbleNumber: number, endMarbleNumber: number): void {
    const firstMarble = this.collection.find(m => m.marbleNumber === startMarbleNumber);
    const lastMarble = this.collection.find(m => m.marbleNumber === endMarbleNumber);
    firstMarble.addBond(lastMarble);
  }

  removeBond(startMarbleNumber: number, endMarbleNumber: number): void {
    const firstMarble = this.collection.find(m => m.marbleNumber === startMarbleNumber);
    const lastMarble = this.collection.find(m => m.marbleNumber === endMarbleNumber);
    firstMarble.removeBond(lastMarble);
  }

  getMarbleByNumber(marbleNumber: number): Marble {
    return this.collection.find(m => m.marbleNumber === marbleNumber);
  }

  checkWinState(): void {
    let isAllDistinctPos = true;
    this.collection.forEach(mo => {
      this.collection.forEach(mi => {
        if (mi.marbleNumber !== mo.marbleNumber && mo.position.xPos === mi.position.xPos && mo.position.yPos === mi.position.yPos) {
          isAllDistinctPos = false;
        }
      });
    });

    if (isAllDistinctPos &&
      this.numberOfIntersectedBonds === 0 &&
      this.numberOfBonds > 1 &&
      this.collection.length > 3 // && (this.collection.length <= this.numberOfBonds)
    ) {
      Colors.line = Colors.win;
    } else {
      Colors.line = Colors.default;
    }
  }

}
