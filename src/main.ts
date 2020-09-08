import { Observable, Subscriber } from 'rxjs';
import { shareReplay, throttleTime } from 'rxjs/operators';
import { Background } from './shapes/background';
import { Mouse } from './helpers/mouse';
import { MarbleContainer } from './entities/marbleContainer';
import { StageManager } from './helpers/stageManager';
import { Listeners } from './helpers/listeners';

export default class MainEntry extends StageManager {
  canvas: HTMLCanvasElement | null;

  mouse = new Mouse();

  bg: Background;

  isDrawingObjects = false;

  animationObserver = new Subscriber<void>();
  animate$: Observable<void>;
  listeners: Listeners;

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

  initListeners(): void {

    this.animate$ = new Observable<void>((observer) => {
      this.animationObserver = observer;
    }).pipe(shareReplay());

    this.animate$.pipe(throttleTime(15)).subscribe(() => {
      this.setBackground();
      if (this.isDrawingObjects) {
        this.drawObjects();
      } else {
        this.marblesContainer.isHighlight = false;
      }
    });

    this.animate$.pipe(throttleTime(100)).subscribe(() => {
      this.updatePageInfo();
    });

    this.marblesContainer.modified$.subscribe((val) => {
      this.isDrawingObjects = val;
    });

    this.animate$.pipe(throttleTime(80))
    .subscribe(
      () => {
        if (this.marblesContainer.isHighlight) {
          document.body.style.cursor = 'pointer';
        } else {
          document.body.style.cursor = 'default';
        }
      }
    );

  }

  updatePageInfo() {

    if (this.isDrawingObjects) {

      const nrOfMarbles = this.marblesContainer.numberOfMarbles;
      const nrOfBonds = this.marblesContainer.numberOfBonds;
      const nrOfInterBonds = this.marblesContainer.numberOfIntersectedBonds;

      this.listeners.marbleNumberDisplayElement.innerText = nrOfMarbles.toString();
      this.listeners.bondNumberDisplayElement.innerText = nrOfBonds.toString();
      this.listeners.bondIntersectedNumberDisplayElement.innerText = nrOfInterBonds.toString();

      if (nrOfBonds > ((nrOfMarbles - 2) * 3)) {
        if (nrOfMarbles > 3) {
          this.listeners.impossibleTextElement.style.display = 'block';
        }
      } else {
        this.listeners.impossibleTextElement.style.display = 'none';
      }
    } else if (this.listeners != null) {
      this.listeners.marbleNumberDisplayElement.innerText = '0';
    }
  }

  setBackground(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.bg.draw();
  }

  initAnimation(): void {
    this.animationObserver.next();
    requestAnimationFrame(() => this.initAnimation());
  }

  drawObjects(): void {
    this.marblesContainer.draw();
    this.marblesContainer.update(this.mouse);
  }

  test(): void {
    console.log('test');
  }

}
