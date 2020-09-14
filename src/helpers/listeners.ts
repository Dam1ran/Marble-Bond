import MainEntry from '../main';
import { SoundsLib } from './sounds-lib';
import { Sound } from './sound';
import { Handlers } from './handlers';
import { delay, filter } from 'rxjs/operators';

export class Listeners extends Handlers {

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

  // stageButtonElements = document.getElementsByClassName('stages')[0].getElementsByTagName('button');
  stagesDivElement = document.getElementById('stages');

  addMarbleButtonElement = document.getElementById('addMarble') as HTMLButtonElement;
  removeMarbleButtonElement = document.getElementById('removeMarble') as HTMLButtonElement;

  constructor (_main: MainEntry){
    super(_main);
    this.initAllListeners();
    this.initWinListener();
  }

  private initAllListeners(): void {
    this.initMouseListeners();
    this.initFileLoader();
    this.initKeys();
    this.initStageButtons();
    this.initGenerationButtons();
    this.initSizeButtons();
    this.initCreationButtons();
  }


  private disableAllListeners(): void {
    this.disableMouseListeners();
    this.disableFileLoader();
    // this.initKeys();
    this.disableStageButtons();
    this.disableGenerationButtons();
    this.disableSizeButtons();
    this.disableCreationButtons();
  }


  private initMouseListeners(): void {
    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mousedown', this.mouseDownHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);
  }
  private disableMouseListeners(): void {
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('mousedown', this.mouseDownHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);
  }

  private initFileLoader(): void {
    this.fileInputElement.value = '';
    this.fileInputElement.onchange = this.fileInputChangeHandler;

    this.saveBtnElement.onclick = this.saveBtnHandler;
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


        this.main.marblesContainer.addMarble(this.main.mouse.point);
        Sound.play(SoundsLib.add);
        console.log('A');
      }

      if (event.key !== undefined && event.key === 'd') {
        handled = true;

        this.main.marblesContainer.removeMarble(this.main.mouse.point);
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


  private initStageButtons(): void {
    this.stagesDivElement.addEventListener('click', this.stageBtnOnClickHandler);
  }
  private disableStageButtons(): void {
    this.stagesDivElement.removeEventListener('click', this.stageBtnOnClickHandler);
  }


  private initGenerationButtons(): void {
    this.clearBtnElement.onclick = this.clearBtnClickHandler;
    this.generateEasyBtnElement.onclick = this.generateEasyBtnHandler;
    this.generateMediumBtnElement.onclick = this.generateMediumBtnHandler;
    this.generateHardBtnElement.onclick = this.generateHardBtnHandler;
    this.generateExtremeBtnElement.onclick = this.generateExtremeBtnHandler;
  }
  private disableGenerationButtons(): void {
    this.clearBtnElement.onclick = null;
    this.generateEasyBtnElement.onclick = null;
    this.generateMediumBtnElement.onclick = null;
    this.generateHardBtnElement.onclick = null;
    this.generateExtremeBtnElement.onclick = null;
  }


  private initSizeButtons(): void {
    this.decreaseBtnElement.onclick = this.main.marblesContainer.decreaseSizes;
    this.resetBtnElement.onclick = this.main.marblesContainer.resetSizes;
    this.increaseBtnElement.onclick = this.main.marblesContainer.increaseSizes;
  }
  private disableSizeButtons(): void {
    this.decreaseBtnElement.onclick = null;
    this.resetBtnElement.onclick = null;
    this.increaseBtnElement.onclick = null;
  }


  private initCreationButtons(): void {
    this.addMarbleButtonElement.onclick = this.addMarbleButtonHandler;
    this.removeMarbleButtonElement.onclick = this.removeMarbleButtonHandler;
  }
  private disableCreationButtons(): void {
    this.addMarbleButtonElement.onclick = null;
    this.removeMarbleButtonElement.onclick = null;

  }


  private initWinListener(): void {

    let disabled = false;
    this.main.marblesContainer.winState$.pipe(filter(v => v), delay(30)).subscribe(
      () => {
        if (!this.main.mouse.clicked && !this.main.mouse.middleClicked) {
          if (!disabled) {
            setTimeout(() => {
              this.disableAllListeners();
              this.main.marblesContainer.animateWin();
              console.log('disabling hard');
            }, 300);
            setTimeout(() => {
              this.initAllListeners();
              this.clearBtnClickHandler();
              this.main.updateContent();
              disabled = false;
              console.log('enabling hard');
            }, 5000);
          }
          disabled = true;
        }
      }
    );

  }

}
