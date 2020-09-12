import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { Background } from './shapes/background';
import { Mouse } from './helpers/mouse';
import { MarbleContainer } from './entities/marbleContainer';
import { StageManager } from './helpers/stageManager';
import { Listeners } from './helpers/listeners';
import { Sounds } from './helpers/sounds';
import { Sound } from './helpers/sound';

export default class MainEntry extends StageManager {
  canvas: HTMLCanvasElement | null;
  bg: Background;

  mouse = new Mouse();

  listeners: Listeners;

  private _isDrawingObjects = false;
  private _animation$ = new Subject();

  constructor(public width = 600, public height = 700) {
    super();
  }

  start(): void {
    this.canvas = document.querySelector('canvas');
    if (this.canvas != null) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      const ctx = this.canvas.getContext('2d');
      if (ctx != null) {
        this.ctx = ctx;
        this.bg = new Background(this.ctx);
        this.marblesContainer = new MarbleContainer(this.ctx);
        this.initListeners();
        this.initAnimation();
        this.listeners = new Listeners(this);
      }
    }

  }

  private initListeners(): void {

    this._animation$.pipe(throttleTime(15)).subscribe(() => {
      this.setBackground();
      if (this._isDrawingObjects) {
        this.drawObjects();
      } else {
        this.marblesContainer.isHighlight = false;
      }
    });

    this._animation$.pipe(throttleTime(100)).subscribe(() => {
      this.updatePageInfo();
    });

    this._animation$.pipe(throttleTime(80)).subscribe(() => {
      if (this.marblesContainer.isHighlight) {
        document.body.style.cursor = 'pointer';
        Sound.playOnce(Sounds.pick);
        Sound.reset(Sounds.drop);
      } else {
        document.body.style.cursor = 'default';
        Sound.reset(Sounds.pick);
        Sound.playOnce(Sounds.drop);
      }
    });

    this.marblesContainer.modified$.subscribe((val) => {
      this._isDrawingObjects = val;
    });

  }

  private updatePageInfo() {

    if (this._isDrawingObjects) {
      const nrOfMarbles = this.marblesContainer.nrOfMarbles;
      const nrOfBonds = this.marblesContainer.nrOfBonds;
      const nrOfInterBonds = this.marblesContainer.nrOfIntersectedBonds;

      this.listeners.marbleNrDisplayElement.innerText = nrOfMarbles.toString();
      this.listeners.bondNrDisplayElement.innerText = nrOfBonds.toString();
      this.listeners.bondIntersectedNrDisplayElement.innerText = nrOfInterBonds.toString();

      if (nrOfBonds > ((nrOfMarbles - 2) * 3)) {
        if (nrOfMarbles > 3) {
          this.listeners.impossibleTextElement.style.display = 'block';
        }
      } else {
        this.listeners.impossibleTextElement.style.display = 'none';
      }
    } else if (this.listeners != null) {
      this.listeners.marbleNrDisplayElement.innerText = '0';
    }

  }

  private setBackground(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.bg.draw();
  }

  private initAnimation(): void {
    this._animation$.next();
    requestAnimationFrame(() => this.initAnimation());
  }

  private drawObjects(): void {
    this.marblesContainer.draw();
    this.marblesContainer.update(this.mouse);
  }

  test(): void {
    // console.log('test');
    // const ziu = new Sounds();

    // ziu.add.play();
  }

}

