import { BondCreator } from '../entities/bondCreator';
import { MarbleContainer } from '../entities/marbleContainer';
import { Generator } from './generator';
import { MarbleData } from './marbleData';
import { Mouse } from './mouse';
import { Sound } from './sound';
import { SoundsLib } from './sounds-lib';
import { StageManager } from './stageManager';

export class Handlers {

  constructor (
    private _ctx: CanvasRenderingContext2D,
    private _mouse: Mouse,
    private _generator: Generator,
    private _bondCreator: BondCreator,
    private _marblesContainer: MarbleContainer,
    private _stageManager: StageManager
  ) { }

  mouseMoveHandler = (event: MouseEvent) => {
    const mouseX = event.clientX - this._ctx.canvas.offsetLeft;
    const mouseY = event.clientY - this._ctx.canvas.offsetTop;

    if (mouseX >= 0 && mouseX <= this._ctx.canvas.width) {
      this._mouse.point.xPos = mouseX;
    }
    if (mouseY >= 0 && mouseY <= this._ctx.canvas.height) {
      this._mouse.point.yPos = mouseY;
    }
  }

  mouseDownHandler = (event: MouseEvent) => {
    if (event.button === 0) {
      this._mouse.clicked = true;
      this._marblesContainer.setMaxSelectedMarble(this._mouse.point);
    }
    if (event.button === 1) {
      this._mouse.middleClicked = true;
      this._marblesContainer.setMaxSelectedMarble(this._mouse.point);
    }
  }

  mouseUpHandler = (event: MouseEvent) => {
    if (event.button === 0) {
      this._mouse.clicked = false;
    }
    if (event.button === 1) {
      this._mouse.middleClicked = false;
      this._mouse.middleHold = false;
    }
  }

  saveBtnHandler = () => {
    if (this._marblesContainer.collection.length > 0) {
      const saveFileNameInput = document.getElementById('saveFileName') as HTMLInputElement;
      const inputValue = saveFileNameInput.value.trim();
      if (inputValue != null && inputValue !== '') {
        saveFileNameInput.value = '';
        this._stageManager.save(inputValue);
      }
    }
  }

  fileInputChangeHandler = (e?: any) => {
    const file: File = e.target.files[0];
    if (file.name.endsWith('.json')) {

      file.text().then(text => {
        try {
          const marbleData = JSON.parse(text) as MarbleData[];
          e.target.value = '';
          this._marblesContainer.writeToMarbleContainerAndUpdate(marbleData);
        } catch (e) {
          console.warn('Load File Error!');
          console.warn(e);
        }
      });

    }
  }

  stageBtnOnClickHandler = (e: MouseEvent) => {
    const target = e.target;
    if (target instanceof HTMLButtonElement) {
      this._stageManager.loadStage(parseInt(target.innerText, 10));
      Sound.play(SoundsLib.stageClick);
    }
  }

  clearBtnClickHandler = () => this._marblesContainer.clearBoard();

  generateEasyBtnHandler = () => {
    const md = this._generator.generateEasy();
    this._marblesContainer.writeToMarbleContainerAndUpdate(md);
  }

  generateMediumBtnHandler = () => {
    const md = this._generator.generateMedium();
    this._marblesContainer.writeToMarbleContainerAndUpdate(md);
  }

  generateHardBtnHandler = () => {
    const md = this._generator.generateHard();
    this._marblesContainer.writeToMarbleContainerAndUpdate(md);
  }

  generateExtremeBtnHandler = () => {
    const md = this._generator.generateExtreme();
    this._marblesContainer.writeToMarbleContainerAndUpdate(md);
  }

  decreaseBtnHandler = () => this._marblesContainer.decreaseSizes();

  resetBtnHandler = () => this._marblesContainer.resetSizes();

  increaseBtnHandler = () => this._marblesContainer.increaseSizes();

  addMarbleButtonHandler = () => {
    // window.addEventListener('mousemove', this.mouseMoveHandler);
  }

  removeMarbleButtonHandler = () => {
    // window.removeEventListener('mousemove', this.mouseMoveHandler);
  }

}
