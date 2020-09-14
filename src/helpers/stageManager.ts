import { Stages } from '../stages/stages';
import { MarbleContainer } from '../entities/marbleContainer';
import { MarbleData } from './marbleData';
import { Point } from '../shapes/point';
import { Marble } from '../shapes/marble';

export class StageManager {

  constructor (
    private _marblesContainer: MarbleContainer,
    private _stages: Stages
  ) { }


  loadStage(stageNumber: number): void {
    const marbleData = this._stages.getStageBy(stageNumber);
    this._marblesContainer.writeToMarbleContainerAndUpdate(marbleData);
  }

  public save(fileName: string): void {

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


    // ---------------------
    let mdString = '[';

    marblesData.forEach(m => {
      mdString += '\n';
      mdString += `  { pos: { xPos: ${m.pos.xPos}, yPos: ${m.pos.yPos} }, nr: ${m.nr}, conn: [${m.conn}] },`;
    });
    mdString += '\n]';

    console.log(mdString);

    // ---------------------


    const blob = new Blob([JSON.stringify(marblesData, null, 2)], {type: 'application/json;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const elem = document.createElement('a');
    elem.href = url;
    elem.download = `${fileName}.json`;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);

  }

  private getMarbleByPosition(position: Point): Marble {
    return this._marblesContainer.collection.find(m => m.position === position);
  }

}
