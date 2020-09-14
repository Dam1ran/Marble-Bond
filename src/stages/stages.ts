import { MarbleData } from '../helpers/marbleData';

export class Stages {

  private stages = new Array<Array<MarbleData>>();

  getStageBy(stageNumber: number): Array<MarbleData> {
    this.initStages();
    return this.stages[stageNumber - 1];
  }

  private initStages(): void {
    if (this.stages.length === 0) {
      this.stages.push(
        [ // 01
          { pos: { xPos: 300, yPos: 100 }, nr: 0, conn: [1] },
          { pos: { xPos: 300, yPos: 600 }, nr: 1, conn: [ ] },
          { pos: { xPos: 100, yPos: 350 }, nr: 2, conn: [3] },
          { pos: { xPos: 500, yPos: 350 }, nr: 3, conn: [ ] },
        ],
        [ // 02
          { pos: { xPos: 100, yPos: 350 }, nr: 0, conn: [1, 2, 3] },
          { pos: { xPos: 500, yPos: 350 }, nr: 1, conn: [2, 3] },
          { pos: { xPos: 300, yPos: 100 }, nr: 2, conn: [3] },
          { pos: { xPos: 300, yPos: 600 }, nr: 3, conn: [ ] },
        ],
        [ // 03
          { pos: { xPos: 100, yPos: 350 }, nr: 0, conn: [1, 2, 3] },
          { pos: { xPos: 500, yPos: 350 }, nr: 1, conn: [2, 3] },
          { pos: { xPos: 300, yPos: 100 }, nr: 2, conn: [3] },
          { pos: { xPos: 300, yPos: 600 }, nr: 3, conn: [ ] },
          { pos: { xPos: 100, yPos: 150 }, nr: 4, conn: [ ] },
          { pos: { xPos: 500, yPos: 150 }, nr: 5, conn: [4] },
          { pos: { xPos: 100, yPos: 550 }, nr: 6, conn: [5] },
          { pos: { xPos: 500, yPos: 550 }, nr: 7, conn: [4, 6] }
        ],
        [ // 04
          { pos: { xPos: 289, yPos: 79 },  nr: 0, conn: [2, 5, 6] },
          { pos: { xPos: 416, yPos: 280 }, nr: 1, conn: [0, 4] },
          { pos: { xPos: 163, yPos: 276 }, nr: 2, conn: [1] },
          { pos: { xPos: 448, yPos: 332 }, nr: 3, conn: [0, 5, 2] },
          { pos: { xPos: 127, yPos: 333 }, nr: 4, conn: [0] },
          { pos: { xPos: 398, yPos: 494 }, nr: 5, conn: [6] },
          { pos: { xPos: 196, yPos: 493 }, nr: 6, conn: [4] },
          { pos: { xPos: 300, yPos: 620 }, nr: 7, conn: [2, 1, 0] },
        ],
        [ // 05
          { pos: { xPos: 300, yPos: 100 }, nr:  0, conn: [1] },
          { pos: { xPos: 300, yPos: 200 }, nr:  1, conn: [ ] },
          { pos: { xPos: 100, yPos: 350 }, nr:  2, conn: [3] },
          { pos: { xPos: 500, yPos: 350 }, nr:  3, conn: [ ] },
        ],
      );
    }

  }

}
