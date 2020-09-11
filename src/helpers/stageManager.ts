import { StageLoader } from '../stages/stageLoader';
import { MarbleContainer } from '../entities/marbleContainer';
import { MarbleData } from './marbleData';
import { Point } from '../shapes/point';
import { Marble } from '../shapes/marble';

export class StageManager {

  public ctx: CanvasRenderingContext2D;
  stageLoader = new StageLoader();

  marblesContainer: MarbleContainer;


  load(stageNumber: number): void {
    const marbleData = this.stageLoader.load(stageNumber);
    this.loadData(marbleData);
    this.marblesContainer.highlight();
    this.marblesContainer.checkWinState();
    this.marblesContainer.highlight();
  }

  public save(marblesContainer: MarbleContainer, fileName: string): void {
    this.marblesContainer = marblesContainer;

    const marblesData: MarbleData[] = [];

    marblesContainer.collection.forEach((cMarble) => {
      const conn: number[] = [];
      cMarble.bonds.forEach((bond)=> {
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
    return this.marblesContainer.collection.find(m => m.position === position);
  }

  loadData(marbleData: MarbleData[]): void {
    this.marblesContainer.collection = [];
    this.marblesContainer.ordinalMarbleNr = 0;
    this.marblesContainer.prevNrOfIntersectedBonds = 9999;

    marbleData.forEach(md => {
      this.marblesContainer.addMarble(md.pos);
    });

    marbleData.forEach(md => {
      md.conn.forEach((nr) => {
        this.marblesContainer.addBond(md.nr,nr);
      });
    });
  }

}
