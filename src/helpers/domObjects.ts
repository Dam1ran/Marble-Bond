import { Handlers } from './handlers';

export class DomObjects {

  saveBtnElement = document.getElementById('saveBtn') as HTMLButtonElement;
  fileInputElement = document.getElementById('fileInput') as HTMLInputElement;

  marbleNrDisplayElement = document.querySelector('.marbleNrDisplay') as HTMLDivElement;
  bondNrDisplayElement = document.querySelector('.bondNrDisplay') as HTMLDivElement;
  bondIntersectedNrDisplayElement = document.querySelector('.bondIntersectedNrDisplay') as HTMLDivElement;
  impossibleTextElement = document.querySelector('.impossible') as HTMLDivElement;

  generateEasyBtnElement = document.getElementById('generateEasy') as HTMLButtonElement;
  generateMediumBtnElement = document.getElementById('generateMedium') as HTMLButtonElement;
  generateHardBtnElement = document.getElementById('generateHard') as HTMLButtonElement;
  generateExtremeBtnElement = document.getElementById('generateExtreme') as HTMLButtonElement;
  clearBtnElement = document.getElementById('clearBtn') as HTMLButtonElement;

  decreaseBtnElement = document.getElementById('decrease') as HTMLButtonElement;
  resetBtnElement = document.getElementById('reset') as HTMLButtonElement;
  increaseBtnElement = document.getElementById('increase') as HTMLButtonElement;

  stagesDivElement = document.getElementById('stages');

  addMarbleButtonElement = document.getElementById('addMarble') as HTMLButtonElement;
  removeMarbleButtonElement = document.getElementById('removeMarble') as HTMLButtonElement;

  constructor (private _handlers: Handlers){
    this.initAllListeners();
    // this.initWinListener();
  }

  initAllListeners(): void {
    this.initMouseListeners();
    this.initFileLoader();
    // this.initKeys();
    this.initStageButtons();
    this.initGenerationButtons();
    this.initSizeButtons();
    this.initCreationButtons();
  }


  disableAllListeners(): void {
    this.disableMouseListeners();
    this.disableFileLoader();
    // this.initKeys();
    this.disableStageButtons();
    this.disableGenerationButtons();
    this.disableSizeButtons();
    this.disableCreationButtons();
  }


  private initMouseListeners(): void {
    window.addEventListener('mousemove', this._handlers.mouseMoveHandler);
    window.addEventListener('mousedown', this._handlers.mouseDownHandler);
    window.addEventListener('mouseup', this._handlers.mouseUpHandler);
  }
  private disableMouseListeners(): void {
    window.removeEventListener('mousemove', this._handlers.mouseMoveHandler);
    window.removeEventListener('mousedown', this._handlers.mouseDownHandler);
    window.removeEventListener('mouseup', this._handlers.mouseUpHandler);
  }

  private initFileLoader(): void {
    this.fileInputElement.value = '';
    this.fileInputElement.onchange = this._handlers.fileInputChangeHandler;

    this.saveBtnElement.onclick = this._handlers.saveBtnHandler;
  }
  private disableFileLoader(): void {
    this.fileInputElement.value = '';
    this.fileInputElement.onchange = null;

    this.saveBtnElement.onclick = null;
  }
/*
  private initKeys(): void {
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      let handled = false;
      if (event.key !== undefined && event.key === 'a') {
        handled = true;


        // this.main.marblesContainer.addMarble(this.main.mouse.point);
        Sound.play(SoundsLib.add);
        console.log('A');
      }

      if (event.key !== undefined && event.key === 'd') {
        handled = true;

        // this.main.marblesContainer.removeMarble(this.main.mouse.point);
        console.log('D');
      }

      if (event.key !== undefined && event.key === 'b') {
        handled = true;
        // this.main.marblesContainer.collection[0].position.xPos = 100;
        console.log('B');
      }

      if (event.key !== undefined && event.key === 'r') {
        handled = true;


        console.log('R');
      }

      if (event.key !== undefined && event.key === 'l') {
        handled = true;


        console.log('L');
      }

      if (event.key !== undefined && event.key === 'k') {
        handled = true;

        console.log('K');
      }

      if (event.key !== undefined && event.key === 's') {
        handled = true;

        console.log('S');
      }

      if (handled) {
        event.preventDefault();
      }
    }, true);
  }
*/

  private initStageButtons(): void {
    this.stagesDivElement.addEventListener('click', this._handlers.stageBtnOnClickHandler);
  }
  private disableStageButtons(): void {
    this.stagesDivElement.removeEventListener('click', this._handlers.stageBtnOnClickHandler);
  }


  private initGenerationButtons(): void {
    this.clearBtnElement.onclick = this._handlers.clearBtnClickHandler;
    this.generateEasyBtnElement.onclick = this._handlers.generateEasyBtnHandler;
    this.generateMediumBtnElement.onclick = this._handlers.generateMediumBtnHandler;
    this.generateHardBtnElement.onclick = this._handlers.generateHardBtnHandler;
    this.generateExtremeBtnElement.onclick = this._handlers.generateExtremeBtnHandler;
  }
  private disableGenerationButtons(): void {
    this.clearBtnElement.onclick = null;
    this.generateEasyBtnElement.onclick = null;
    this.generateMediumBtnElement.onclick = null;
    this.generateHardBtnElement.onclick = null;
    this.generateExtremeBtnElement.onclick = null;
  }


  private initSizeButtons(): void {
    this.decreaseBtnElement.onclick = this._handlers.decreaseBtnHandler;
    this.resetBtnElement.onclick = this._handlers.resetBtnHandler;
    this.increaseBtnElement.onclick = this._handlers.increaseBtnHandler;
  }
  private disableSizeButtons(): void {
    this.decreaseBtnElement.onclick = null;
    this.resetBtnElement.onclick = null;
    this.increaseBtnElement.onclick = null;
  }


  private initCreationButtons(): void {
    this.addMarbleButtonElement.onclick = this._handlers.addMarbleButtonHandler;
    this.removeMarbleButtonElement.onclick = this._handlers.removeMarbleButtonHandler;
  }
  private disableCreationButtons(): void {
    this.addMarbleButtonElement.onclick = null;
    this.removeMarbleButtonElement.onclick = null;

  }

  updatePageInfo(isDrawingObjects: boolean, nrOfMarbles: number, nrOfBonds: number, nrOfIntersectedBonds: number): void {

    if (isDrawingObjects) {

      this.marbleNrDisplayElement.innerText = nrOfMarbles.toString();
      this.bondNrDisplayElement.innerText = nrOfBonds.toString();
      this.bondIntersectedNrDisplayElement.innerText = nrOfIntersectedBonds.toString();

      if (nrOfBonds > ((nrOfMarbles - 2) * 3)) {
        if (nrOfMarbles > 3) {
          this.impossibleTextElement.style.display = 'block';
        }
      } else {
        this.impossibleTextElement.style.display = 'none';
      }
    } else if (this != null) {
      this.marbleNrDisplayElement.innerText = '0';
    }

  }

}
