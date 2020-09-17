import { Subject } from 'rxjs';
import { delay, filter, throttleTime } from 'rxjs/operators';
import { Background } from './shapes/background';
import { Mouse } from './helpers/mouse';
import { MarbleContainer } from './entities/marbleContainer';
import { DomObjects } from './helpers/domObjects';
import { SoundsLib } from './helpers/sounds-lib';
import { Sound } from './helpers/sound';
import { BondCreator } from './entities/bondCreator';
import { StateController } from './helpers/stateController';

export default class MainEntry {

  private _isDrawingObjects = false;
  private _animation$ = new Subject();

  constructor (
    private _ctx: CanvasRenderingContext2D,
    private _marblesContainer: MarbleContainer,
    private _bondCreator: BondCreator,
    private _background: Background,
    private _mouse: Mouse,
    private _domObjects: DomObjects,
    private _stateController: StateController,
    private _soundsLib: SoundsLib,
    private _sound: Sound
  ) {
    this.initListeners();
    this.initAnimation();
    this.initWinListener();
    this._stateController.loadState();
    this._domObjects.initTogglers();
    this.initAutoSave();
  }

  private initListeners(): void {

    this._animation$.pipe(throttleTime(15)).subscribe(() => {
      this.setBackground();
      if (this._isDrawingObjects) {
        this.drawObjects();
      } else {
        this._marblesContainer.isHighlight = false;
      }
    });

    this._animation$.pipe(throttleTime(100)).subscribe(() => {
      this._domObjects.updatePageInfo(
        this._isDrawingObjects,
        this._marblesContainer.nrOfMarbles,
        this._marblesContainer.nrOfBonds,
        this._marblesContainer.nrOfIntersectedBonds
      );
    });

    this._animation$.pipe(throttleTime(80)).subscribe(() => {
      if (this._marblesContainer.isHighlight) {
        document.body.style.cursor = 'pointer';
        this._sound.playOnce(this._soundsLib.pick);
        this._sound.reset(this._soundsLib.drop);
      } else {
        document.body.style.cursor = 'default';
        this._sound.reset(this._soundsLib.pick);
        this._sound.playOnce(this._soundsLib.drop);
      }
    });

    this._marblesContainer.modified$.subscribe((val) => {
      this._isDrawingObjects = val;
    });

  }

  private initAnimation(): void {
    this._animation$.next();
    requestAnimationFrame(() => this.initAnimation());
  }

  private drawObjects(): void {
    this._bondCreator.creationBondLine?.draw();
    this._marblesContainer.draw();
    this._bondCreator.createBond(this._mouse);
    this._marblesContainer.update(this._mouse);
  }

  private initWinListener(): void {

    let disabled = false;
    this._marblesContainer.winState$.pipe(filter(v => v), delay(30)).subscribe(
      () => {
        if (!this._mouse.clicked && !this._mouse.middleClicked) {
          if (!disabled) {
            setTimeout(() => {
              this._domObjects.disableAllListeners();
              this._marblesContainer.animateWin();
              console.log('disabling hard');
            }, 300);
            setTimeout(() => {
              this._domObjects.initAllListeners();
              this._marblesContainer.clearBoard();
              this._marblesContainer.updateContent();
              disabled = false;
              console.log('enabling hard');
            }, 5000);
          }
          disabled = true;
        }
      }
    );

  }

  private setBackground(): void {
    this._ctx.clearRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    this._background.draw();
  }

  private initAutoSave(): void {
    setInterval(() => {
      if (!this._marblesContainer.isCreationMode) {
        this._stateController.saveState();
        this._domObjects.showSavingInProgress();
      }
    }, 60000);
  }

}
