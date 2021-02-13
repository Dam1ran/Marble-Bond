import { Handlers } from './handlers';
import { Sound } from './sound';

export class DomObjects {

  saveFileNameInput = document.getElementById('saveFileName') as HTMLInputElement;
  saveBtnElement = document.getElementById('saveBtn') as HTMLButtonElement;
  fileInputElement = document.getElementById('fileInput') as HTMLInputElement;
  saveDivElement = document.getElementById('saving') as HTMLElement;
  saveStaticImg = document.getElementById('saving').children[0] as HTMLImageElement;
  saveGif = document.getElementById('saving').children[1] as HTMLImageElement;

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
  soundTogglerElement = document.getElementById('soundToggler') as HTMLElement;
  soundOff = false;

  stagesDivElement = document.getElementById('stages');

  creationModeBtnElement = document.getElementById('creationModeBtn') as HTMLButtonElement;
  addMarbleButtonElement = document.getElementById('addMarble') as HTMLButtonElement;
  removeMarbleButtonElement = document.getElementById('removeMarble') as HTMLButtonElement;

  constructor (
    private _handlers: Handlers,
    private _sound: Sound
  ){
    this.initAllListeners();
    this.saveGif.style.display = 'none';

    // this.initKeys();
  }

  private initSavingImgElements(): void {
    const qSave = () => {
      this.showSavingInProgress();
      return this._handlers.quickSaveHandler();
    };
    this.saveDivElement.onclick = qSave;
  }
  private disableSavingImgElements(): void {
    this.saveDivElement.onclick = null;
  }

  initAllListeners(): void {
    this.initMouseListeners();
    this.initFileLoader();
    // this.initKeys();
    this.initStageButtons();
    this.initGenerationButtons();
    this.initSizeButtons();
    this.initCreationButtons();
    this.initSavingImgElements();
  }


  disableAllListeners(): void {
    this.disableMouseListeners();
    this.disableFileLoader();
    // this.initKeys();
    this.disableStageButtons();
    this.disableGenerationButtons();
    this.disableSizeButtons();
    this.disableCreationButtons();
    this.disableSavingImgElements();
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

    this.saveBtnElement.onclick = () => this._handlers.saveBtnHandler(this.saveFileNameInput);
  }
  private disableFileLoader(): void {
    this.fileInputElement.value = '';
    this.fileInputElement.onchange = null;

    this.saveBtnElement.onclick = null;
  }

  private initKeys(): void {
    window.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        return;
      }

      let handled = false;
      if (event.key !== undefined && event.key === 'a') {
        handled = true;


        console.log('A');
      }

      if (event.key !== undefined && event.key === 'd') {
        handled = true;

        this.disableAllListeners();

        console.log('D');
      }

      if (event.key !== undefined && event.key === 'b') {
        handled = true;
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

      if (event.key !== undefined && event.key === 'i') {
        handled = true;

        this.initAllListeners();

        console.log('I');
      }

      if (handled) {
        event.preventDefault();
      }
    }, true);
  }


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
    this.creationModeBtnElement.onclick = this._handlers.enableCreationModeHandler;
    this.addMarbleButtonElement.onclick = this._handlers.addMarbleButtonHandler;
    this.removeMarbleButtonElement.onclick = this._handlers.removeMarbleButtonHandler;
  }
  private disableCreationButtons(): void {
    this.creationModeBtnElement.onclick = null;
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

  showSavingInProgress(): void {
    this.saveStaticImg.style.display = 'none';
    this.saveGif.style.display = 'inline';
    setTimeout(() => {
      this.saveStaticImg.style.display = 'inline';
      this.saveGif.style.display = 'none';
    }, 2100);
  }

  initTogglers(): void {
    this.toggleSound();
    this.initSoundToggler();
  }

  private initSoundToggler(): void {
    const soundToggler = () => {
      this._sound.soundOff = !this._sound.soundOff;
      this.toggleSound();
      this.showSavingInProgress();
      this._handlers.quickSaveHandler();
    };
    this.soundTogglerElement.onclick = soundToggler;
  }

  private toggleSound(): void {
    if (this._sound.soundOff) {
      this.soundTogglerElement.style.backgroundColor = 'rgba(200,50,50,0.4)';
      this.soundTogglerElement.style.boxShadow = 'inset 0 0 6px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 0, 0, 0.5)';
    } else {
      this.soundTogglerElement.style.boxShadow = 'inset 0 0 3px rgba(0, 0, 0, 0.0), 0 0 2px rgba(0, 0, 0, 0.5)';
      this.soundTogglerElement.style.backgroundColor = 'rgba(80,80,130,0.5)';
    }
  }

}
