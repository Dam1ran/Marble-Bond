import MainEntry from '../main';
import { Generator } from './generator';
import { MarbleData } from './marbleData';
import { Sound } from './sound';
import { SoundsLib } from './sounds-lib';

export class Handlers {

  private _generator: Generator;

  constructor (public main: MainEntry) {
    this._generator = new Generator(main.width, main.height);

  }

  protected mouseMoveHandler = (event: MouseEvent) => {
    const mouseX = event.clientX - this.main.ctx.canvas.offsetLeft;
    const mouseY = event.clientY - this.main.ctx.canvas.offsetTop;

    if (mouseX >= 0 && mouseX <= this.main.width) {
      this.main.mouse.point.xPos = mouseX;
    }
    if (mouseY >= 0 && mouseY <= this.main.height) {
      this.main.mouse.point.yPos = mouseY;
    }
  }

  protected mouseDownHandler = (event: MouseEvent) => {
    if (event.button === 0) {
      this.main.mouse.clicked = true;
      this.main.marblesContainer.setMaxSelectedMarble(this.main.mouse.point);
    }
    if (event.button === 1) {
      this.main.mouse.middleClicked = true;
      this.main.marblesContainer.setMaxSelectedMarble(this.main.mouse.point);
    }
  }

  protected mouseUpHandler = (event: MouseEvent) => {
    if (event.button === 0) {
      this.main.mouse.clicked = false;
    }
    if (event.button === 1) {
      this.main.mouse.middleClicked = false;
      this.main.mouse.middleHold = false;
    }
  }

  protected saveBtnHandler = () => {
    if (this.main.marblesContainer.collection.length > 0) {
      const saveFileNameInput = document.getElementById('saveFileName') as HTMLInputElement;
      const inputValue = saveFileNameInput.value.trim();
      if (inputValue != null && inputValue !== '') {
        saveFileNameInput.value = '';
        this.main.save(this.main.marblesContainer, inputValue);
      }
    }
  }

  protected fileInputChangeHandler = (e?: any) => {
    const file: File = e.target.files[0];
    if (file.name.endsWith('.json')) {

      file.text().then(text => {
        try {
          const marbleData = JSON.parse(text) as MarbleData[];
          e.target.value = '';
          this.main.writeToMarbleContainer(marbleData);
        } catch (e) {
          console.warn('Load File Error!');
          console.warn(e);
        }
      });

    }
  }

  protected stageBtnOnClickHandler = (e: MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
      this.main.loadStage(parseInt(target.innerText, 10));
      Sound.play(SoundsLib.stageClick);
    }
  }

  protected clearBtnClickHandler = () => {
    this.main.marblesContainer.collection = [];
    this.main.marblesContainer.ordinalMarbleNr = 0;
    this.main.marblesContainer.highlight();
    this.main.listeners.impossibleTextElement.style.display = 'none';
    Sound.play(SoundsLib.clear);
  }

  protected generateEasyBtnHandler = () => {
    const md = this._generator.generateEasy();
    this.loadAndUpdate(md);
  }

  protected generateMediumBtnHandler = () => {
    const md = this._generator.generateMedium();
    this.loadAndUpdate(md);
  }

  protected generateHardBtnHandler = () => {
    const md = this._generator.generateHard();
    this.loadAndUpdate(md);
  }

  protected generateExtremeBtnHandler = () => {
    const md = this._generator.generateExtreme();
    this.loadAndUpdate(md);
  }
/*
  protected decreaseBtnHandler = () => {
    Variables.marbleRadius = Variables.marbleRadius > 4 ?
      --Variables.marbleRadius
      : Variables.marbleRadius;

    Variables.ringWidth = Variables.ringWidth > 1 ?
      --Variables.ringWidth
      : Variables.ringWidth;

    Variables.lineWidth = (Variables.lineWidth > 1 && (Variables.marbleRadius < 5 || Variables.marbleRadius > 12)) ?
      --Variables.lineWidth
      : Variables.lineWidth;

    Variables.fontNrSize = (Variables.marbleRadius >= 6) && (Variables.marbleRadius <= 13) ?
      (Variables.marbleRadius + 2)
      : 15;
  }

  protected resetBtnHandler = () => {
    Variables.marbleRadius = 13;
    Variables.ringWidth = 2;
    Variables.lineWidth = 2;
    Variables.fontNrSize = 13;
  }

  protected increaseBtnHandler = () => {
    Variables.marbleRadius = Variables.marbleRadius < Variables.maxMarbleRadius ?
    ++Variables.marbleRadius
    : Variables.marbleRadius;

    Variables.ringWidth = (Variables.ringWidth < Variables.maxRingWidth && Variables.marbleRadius > 12) ?
      ++Variables.ringWidth
      : Variables.ringWidth;

    Variables.lineWidth = ((Variables.lineWidth < Variables.maxLineWidth) && ((Variables.marbleRadius > 12) || (Variables.marbleRadius < 6))) ?
      ++Variables.lineWidth
      : Variables.lineWidth;

    Variables.fontNrSize = (Variables.marbleRadius >= 6) && (Variables.marbleRadius <= 13) ?
      (Variables.marbleRadius + 2)
      : 15;

  }
*/
  protected addMarbleButtonHandler = () => {
    // window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  protected removeMarbleButtonHandler = () => {
    // window.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  private loadAndUpdate(md: MarbleData[]): void {
    this.main.writeToMarbleContainer(md);
    Sound.play(SoundsLib.generate);
  }

}
