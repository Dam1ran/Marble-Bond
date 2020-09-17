import { MarbleContainer } from '../entities/marbleContainer';
import { Marble } from '../shapes/marble';
import { Point } from '../shapes/point';
import { MarbleData } from './marbleData';
import { Sound } from './sound';

export class StateController {

  constructor (
    private _marblesContainer: MarbleContainer,
    private _sound: Sound
  ) { }

  public save(fileName: string): void {

    const marblesData = this.marblesToMarblesData();

    this.toConsole(marblesData);

    const blob = new Blob([JSON.stringify(marblesData, null, 2)], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const elem = document.createElement('a');
    elem.href = url;
    elem.download = `${fileName}.json`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);

  }

  // temp
  private toConsole(marblesData: MarbleData[]): void {

    let mdString = '[';
    marblesData.forEach(m => {
      mdString += '\n';
      mdString += `  { pos: { xPos: ${m.pos.xPos}, yPos: ${m.pos.yPos} }, nr: ${m.nr}, conn: [${m.conn}] },`;
    });
    mdString += '\n]';

    console.log(mdString);

  }

  private marblesToMarblesData(): MarbleData[] {

    const marblesData: MarbleData[] = [];
    this._marblesContainer.collection.forEach((cMarble) => {
      const conn: number[] = [];
      cMarble.bonds.forEach((bond) => {
        const marble = this.getMarbleByPosition(bond.pointEnd);
        if (marble != null) {
          conn.push(marble.marbleNr);
        }
      });

      marblesData.push(
        new MarbleData(cMarble.position, cMarble.marbleNr, conn)
      );
    });

    return marblesData;

  }

  private getMarbleByPosition(position: Point): Marble {
    return this._marblesContainer.collection.find(m => m.position === position);
  }

  saveState(): void {
    if (!this._marblesContainer.isCreationMode) {
      const marblesData = this.marblesToMarblesData();
      if (marblesData.length > 0) {
        localStorage.removeItem('marblesData');
        localStorage.setItem('marblesData', JSON.stringify(marblesData));
      }
    }

    localStorage.removeItem('soundOff');
    localStorage.setItem('soundOff', this._sound.soundOff ? 'true' : 'false');
  }

  loadState(): void {
    const marblesData = JSON.parse(localStorage.getItem('marblesData')) as MarbleData[];
    if (marblesData?.length > 0) {
      this._marblesContainer.writeToMarbleContainerAndUpdate(marblesData);
    }

    const soundOff = localStorage.getItem('soundOff');
    this._sound.soundOff = soundOff === 'true' ? true : false;
  }

}
