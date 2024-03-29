import { Mouse } from '../helpers/mouse';
import { Line } from '../shapes/line';
import { Bond } from './bond';
import { Colors } from '../helpers/colors';
import { SoundsLib } from '../helpers/sounds-lib';
import { Sound } from '../helpers/sound';
import { MarbleContainer } from './marbleContainer';

export class BondCreator {

  creationBondLine: Line;
  private isBondLineDone = false;
  private _startMarbleNrForCreation = -1;
  private _endMarbleNrForCreation = -1;

  constructor (
    private readonly ctx: CanvasRenderingContext2D,
    private _marbleContainer: MarbleContainer,
    private _soundsLib: SoundsLib,
    private _sound: Sound,
  ) { }

  createBond(mouse: Mouse): void {

    if (this._marbleContainer.isCreationMode) {
      if (mouse.middleClicked) {

        if (!mouse.middleHold && this._marbleContainer.selectedMarble != null) {

          this.initDrawBondStart(mouse);

        } else if (mouse.middleHold && this.creationBondLine != null) {

          this._marbleContainer.setMaxSelectedMarble(mouse.point);
          if (this._marbleContainer.selectedMarble != null) {
            this.snapBondEndToMarble();
            this.isBondLineDone = true;

          } else {
            this.stickBondEndToMousePos(mouse);
            this.isBondLineDone = false;

          }
        }

      } else if (this.creationBondLine != null) {
        this.finalizeBondCreation();
        this.resetWorkedItems();
      }
    }

  }

  private initDrawBondStart(mouse: Mouse): void {
    mouse.middleHold = true;
    this._startMarbleNrForCreation = this._marbleContainer.selectedMarble.marbleNr;

    this._marbleContainer.selectedMarble.ringColor = Colors.creation;
    this._sound.playOnce(this._soundsLib.draw);
    this.creationBondLine = new Line(this.ctx, {...this._marbleContainer.selectedMarble.position}, mouse.point, Colors.creation);
  }

  private snapBondEndToMarble(): void {

    this.creationBondLine.pointEnd = {...this._marbleContainer.selectedMarble.position};
    this._endMarbleNrForCreation = this._marbleContainer.selectedMarble.marbleNr;

    this.creationBondLine.color = Colors.creationHighlight;
    if (this._startMarbleNrForCreation !== this._endMarbleNrForCreation) {
      this._marbleContainer.getMarbleBy(this._startMarbleNrForCreation).ringColor = Colors.creationHighlight;
      this._marbleContainer.getMarbleBy(this._endMarbleNrForCreation).ringColor = Colors.creationHighlight;
    }

  }

  private stickBondEndToMousePos(mouse: Mouse): void {
    this.creationBondLine.pointEnd = mouse.point;

    this.creationBondLine.color = Colors.creation;
    this._marbleContainer.getMarbleBy(this._startMarbleNrForCreation).ringColor = Colors.creation;
    if (this._startMarbleNrForCreation !== this._endMarbleNrForCreation) {
      this._marbleContainer.getMarbleBy(this._endMarbleNrForCreation).ringColor = Colors.line;
    }
  }

  private finalizeBondCreation(): void {

    if (this.isBondLineDone && !this.creationBondLine.isSamePoints()) {
      this.isBondLineDone = false;

      const forwardBondToRemove = this.getBondBy(this._startMarbleNrForCreation, this._endMarbleNrForCreation);
      const backwardBondToRemove = this.getBondBy(this._endMarbleNrForCreation, this._startMarbleNrForCreation);

      if (forwardBondToRemove != null || backwardBondToRemove != null) {
        this.removeBond(this._startMarbleNrForCreation, this._endMarbleNrForCreation);
        this.removeBond(this._endMarbleNrForCreation, this._startMarbleNrForCreation);
        this._sound.play(this._soundsLib.remove);
      } else {
        this._marbleContainer.addBond(this._startMarbleNrForCreation, this._endMarbleNrForCreation);
        this._sound.play(this._soundsLib.connect);
      }
    }
  }

  private resetWorkedItems(): void {
    this._marbleContainer.getMarbleBy(this._startMarbleNrForCreation).ringColor = Colors.line;
    this._marbleContainer.getMarbleBy(this._endMarbleNrForCreation).ringColor = Colors.line;
    this.creationBondLine = null;
    this._marbleContainer.updateContent();
    this._sound.reset(this._soundsLib.draw);
  }

  private getBondBy(startMarbleNr: number, endMarbleNr: number): Bond {
    const firstMarble = this._marbleContainer.collection.find(m => m.marbleNr === startMarbleNr);
    const lastMarble = this._marbleContainer.collection.find(m => m.marbleNr === endMarbleNr);
    return firstMarble.getBondBy(lastMarble);
  }

  private removeBond(startMarbleNr: number, endMarbleNr: number): void {
    const firstMarble = this._marbleContainer.collection.find(m => m.marbleNr === startMarbleNr);
    const lastMarble = this._marbleContainer.collection.find(m => m.marbleNr === endMarbleNr);
    firstMarble.removeBond(lastMarble);
  }

}
