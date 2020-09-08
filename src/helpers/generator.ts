import { MarbleData } from './marbleData';
import { Point } from '../shapes/point';

export class Generator {

  private clamp = new Point(100,100);
  private marblesData: Array<MarbleData>;

  constructor(private width: number,private height: number) {
  }

  generateEasy(): MarbleData[] {

    const marbleNr = this.generateNumberInRange(10,6);
    const minNrOfBonds = (marbleNr - 1);
    const maxNrOfBonds = (marbleNr - 2) * 3;
    const nrOfBonds = this.generateNumberInRange(maxNrOfBonds - 2, minNrOfBonds);
    return this.generate(marbleNr, nrOfBonds);

  }

  generateMedium(): MarbleData[] {

    const marbleNr = this.generateNumberInRange(15,10);
    const minNrOfBonds = (marbleNr - 1) + 10;
    const maxNrOfBonds = (marbleNr - 2) * 3;
    const nrOfBonds = this.generateNumberInRange(maxNrOfBonds, minNrOfBonds);
    return this.generate(marbleNr, nrOfBonds);

  }

  generateHard(): MarbleData[] {

    const marbleNr = this.generateNumberInRange(20,15);
    const minNrOfBonds = (marbleNr - 1) + 15;
    const maxNrOfBonds = (marbleNr - 2) * 3;
    const nrOfBonds = this.generateNumberInRange(maxNrOfBonds, minNrOfBonds);
    return this.generate(marbleNr, nrOfBonds);

  }

  generateExtreme(): MarbleData[] {

    const marbleNr = this.generateNumberInRange(30,25);
    const minNrOfBonds = (marbleNr - 1) + 25;
    const maxNrOfBonds = (marbleNr - 2) * 3;
    const nrOfBonds = this.generateNumberInRange(maxNrOfBonds, minNrOfBonds);
    return this.generate(marbleNr, nrOfBonds);

  }

  private generate(marbleNr: number, nrOfBonds: number): MarbleData[] {

    this.initFirstTriangle();

    for (let i = 0; i < marbleNr - 3; i++) {

      const allTriangles = this.getAllTriangles(this.marblesData);
      const emptyTriangles = this.getEmptyTriangles(allTriangles, this.marblesData);
      const biggestTriangle = this.getBiggestAriaTriangle(emptyTriangles, this.marblesData);

      const first = this.marblesData.find(m => m.nr === biggestTriangle[0]);
      const second = this.marblesData.find(m => m.nr === biggestTriangle[1]);
      const third = this.marblesData.find(m => m.nr === biggestTriangle[2]);

      const triCenter = this.getTriangleCenter([first,second,third]);

      this.marblesData.push(
        new MarbleData({...triCenter}, this.marblesData.length ,[first.nr, second.nr, third.nr])
      );

    }

    const nrOfBondsToDelete = ((marbleNr - 2) * 3) - nrOfBonds;

    for (let i = 0; i < nrOfBondsToDelete; i++) {
      const mi = i % marbleNr;
      if (this.marblesData[mi].conn.length > 1) {
        this.marblesData[mi].conn.pop();
      } else {
        const mdNr = this.getMarbleNrWithNotEmptyConnLength(this.marblesData);
        if (mdNr >= 0) {
          this.marblesData.find(md => md.nr === mdNr).conn.pop();
        }
      }
    }

    this.shuffleMdPos();

    return this.marblesData;

  }

  private getMarbleNrWithNotEmptyConnLength(mds: MarbleData[]): number {
    let nr = -1;
    const indexesLong: number[] = [];
    for (let i = 0; i < mds.length; i++) {
      if (mds[i].conn.length >= 2) {
        indexesLong.push(i);
      }
    }

    if (indexesLong.length > 0) {
      const index = this.generateNumberInRange(indexesLong.length - 1);
      nr = indexesLong[index];
    }

    const indexesShort: number[] = [];
    if (nr === -1) {
      for (let i = mds.length - 1; i >= 0; i--) {
        if (mds[i].conn.length >= 1) {
          if (this.getConnectedMdFor(mds[i], mds).length > 1) {
            indexesShort.push(i);
          }
        }
      }
    }

    if (nr === -1 && indexesShort.length > 0) {
      const index = this.generateNumberInRange(indexesShort.length - 1);
      nr = indexesShort[index];
    }

    return nr;

  }

  private initFirstTriangle() {
    this.marblesData = new Array<MarbleData>();

    this.marblesData.push(
      new MarbleData(new Point(300, 20), 0, [1]),
      new MarbleData(new Point(20, 680), 1, [2]),
      new MarbleData(new Point(580, 680), 2, [0])
    );
  }

  private shuffleMdPos(): void {
    this.marblesData.forEach(m => {
      m.pos.xPos = this.generateNumberInRange(this.width - this.clamp.xPos, 0 + this.clamp.xPos);
      m.pos.yPos = this.generateNumberInRange(this.height - this.clamp.yPos, 0 + this.clamp.yPos);
    });
  }

  private getAllTriangles(mds: MarbleData[]): [number,number,number][] {

    const triangles = new Array<[number,number,number]>();
    mds.forEach(md => {
      const conns = this.getConnectedMdFor(md, mds);
      if (conns.length === 0) {
        return null;
      }

      conns.forEach((cs) => {
        const connForNext = this.getConnectedMdFor(cs,conns);
        connForNext.forEach((cn) => {
          const sorted = [md.nr,cs.nr,cn.nr].sort();
          let already = false;
          triangles.forEach(t => {
            if (t[0] === sorted[0] && t[1] === sorted[1] && t[2] === sorted[2]) {
              already = true;
            }
          });

          if (!already) {
            triangles.push([sorted[0], sorted[1], sorted[2]]);
          }
        });
      });
    });

    return triangles;

  }

  private getEmptyTriangles(triangles: [number,number,number][], mds: MarbleData[]): [number,number,number][] {

    const _triangles = new Array<[number,number,number]>();

    triangles.forEach(t => {
      const first = mds.find(m => m.nr === t[0]);
      const second = mds.find(m => m.nr === t[1]);
      const third = mds.find(m => m.nr === t[2]);

      let isEmpty = true;
      mds.forEach(md => {
        if (first.nr !== md.nr && second.nr !== md.nr && third.nr !== md.nr) {
          if (this.isPointInTriangle(md, [first, second, third])) {
            isEmpty = false;
          }
        }
      });

      if (isEmpty) {
        _triangles.push(t);
      }
    });

    return _triangles;

  }

  private getBiggestAriaTriangle(triangles: [number,number,number][], mds: MarbleData[]): [number,number,number]{

    const arias = new Array<number>();

    triangles.forEach(t => {
      const first = mds.find(m => m.nr === t[0]);
      const second = mds.find(m => m.nr === t[1]);
      const third = mds.find(m => m.nr === t[2]);

      const a = Math.sqrt(this.getSquareDistanceFrom(first, second));
      const b = Math.sqrt(this.getSquareDistanceFrom(first, third));
      const c = Math.sqrt(this.getSquareDistanceFrom(third, second));

      const s = (a + b + c) / 2;

      const aria = Math.sqrt(s * (s - a) * (s - b) * (s - c));

      arias.push(Math.round(aria));
    });

    let ar = 0;
    arias.forEach((a,i) => {
      if (ar <= arias[i]) {
        ar = arias[i];
      }
    });

    const index = arias.indexOf(ar);

    return triangles[index];

  }

  private getConnectedMdFor(marbleData: MarbleData, connections: MarbleData[]): MarbleData[] {

    const connectedMarbles = new Array<MarbleData>();
    connections.forEach(md => {
      if (md.nr !== marbleData.nr && !this.isConnectable(md,marbleData)) {
        connectedMarbles.push(md);
      }
    });

    return connectedMarbles;

  }

  private isConnectable(md1: MarbleData, md2: MarbleData): boolean {

    if (md1.nr !== md2.nr) {

      const md1Conn = md1.conn.concat().sort();
      const md2Conn = md2.conn.concat().sort();

      for (let md1i = 0; md1i < md1Conn.length; md1i++) {
        if (md1Conn[md1i] === md2.nr) {
          return false;
        }
      }

      for (let md2i = 0; md2i < md2Conn.length; md2i++) {
        if (md2Conn[md2i] === md1.nr) {
          return false;
        }
      }

      return true;

    }

    return false;

  }

  private getSquareDistanceFrom(md1: MarbleData, md2: MarbleData): number {
    return (Math.pow((md2.pos.yPos - md1.pos.yPos), 2) + Math.pow((md2.pos.xPos - md1.pos.xPos), 2));
  }

  private isPointInTriangle(pmd: MarbleData, mds: MarbleData[]): boolean {

    const p =  { X: pmd.pos.xPos, Y: pmd.pos.yPos };
    const p0 = { X: mds[0].pos.xPos, Y: mds[0].pos.yPos };
    const p1 = { X: mds[1].pos.xPos, Y: mds[1].pos.yPos };
    const p2 = { X: mds[2].pos.xPos, Y: mds[2].pos.yPos };

    const s = p0.Y * p2.X - p0.X * p2.Y + (p2.Y - p0.Y) * p.X + (p0.X - p2.X) * p.Y;
    const t = p0.X * p1.Y - p0.Y * p1.X + (p0.Y - p1.Y) * p.X + (p1.X - p0.X) * p.Y;

    if ((s < 0) !== (t < 0)) {
      return false;
    }

    const A = -p1.Y * p2.X + p0.Y * (p2.X - p1.X) + p0.X * (p1.Y - p2.Y) + p1.X * p2.Y;

    return A < 0 ? (s <= 0 && s + t >= A) : (s >= 0 && s + t <= A);

  }

  private getTriangleCenter(mds: MarbleData[]): Point {
    const triCenter = new Point();
    triCenter.xPos = Math.floor((mds[0].pos.xPos + mds[1].pos.xPos + mds[2].pos.xPos) / 3);
    triCenter.yPos = Math.floor((mds[0].pos.yPos + mds[1].pos.yPos + mds[2].pos.yPos) / 3);
    return triCenter;
  }

  generateNumberInRange(maxNr: number, minNr: number = 0): number {
    return Math.floor(Math.random() * (maxNr - minNr + 1) + minNr);
  }

}
