import MainEntry from '../main';
import { MarbleData } from './marbleData';
import { Generator } from './generator';
import { Variables } from './variables';
import { Sounds } from './sounds';
import { Sound } from './sound';
export class Listeners {

  generator: Generator;
  marbleNrDisplayElement = document.querySelector('.marbleNrDisplay') as HTMLDivElement;
  bondNrDisplayElement = document.querySelector('.bondNrDisplay') as HTMLDivElement;
  bondIntersectedNrDisplayElement = document.querySelector('.bondIntersectedNrDisplay') as HTMLDivElement;
  impossibleTextElement = document.querySelector('.impossible') as HTMLDivElement;

  generateEasyBtnElement = document.getElementById('generateEasy') as HTMLButtonElement;
  generateMediumBtnElement = document.getElementById('generateMedium') as HTMLButtonElement;
  generateHardBtnElement = document.getElementById('generateHard') as HTMLButtonElement;
  generateExtremeBtnElement = document.getElementById('generateExtreme') as HTMLButtonElement;

  decreaseBtnElement = document.getElementById('decrease') as HTMLButtonElement;
  resetBtnElement = document.getElementById('reset') as HTMLButtonElement;
  increaseBtnElement = document.getElementById('increase') as HTMLButtonElement;



  constructor(private main: MainEntry){
    this.initHtmlListeners();
    this.initFileLoader();
    this.initKeys();
    this.initStageButtons();
    this.initGenerationButtons();
    this.generator = new Generator(main.width, main.height);
    this.initSizeButtons();
  }

  private initHtmlListeners(): void {
    const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
    saveBtn.onclick = () => {
      if (this.main.marblesContainer.collection.length > 0) {
        const saveFileNameInput = document.getElementById('saveFileName') as HTMLInputElement;
        const inputValue = saveFileNameInput.value.trim();
        if (inputValue != null && inputValue !== '') {
          saveFileNameInput.value = '';
          this.main.save(this.main.marblesContainer, inputValue);
        }
      }
    };

    const clearBtn = document.getElementById('clearBtn') as HTMLButtonElement;
    clearBtn.onclick = () => {
      this.main.marblesContainer.collection = [];
      this.main.marblesContainer.ordinalMarbleNr = 0;
      this.main.marblesContainer.highlight();
      this.main.listeners.impossibleTextElement.style.display = 'none';
      Sound.play(Sounds.clear);
    };

    window.addEventListener('mousemove', (event: MouseEvent) => {
      const mouseX = event.clientX - this.main.ctx.canvas.offsetLeft;
      const mouseY = event.clientY - this.main.ctx.canvas.offsetTop;

      if (mouseX >= 0 && mouseX <= this.main.width) {
        this.main.mouse.point.xPos = mouseX;
      }

      if (mouseY >= 0 && mouseY <= this.main.height) {
        this.main.mouse.point.yPos = mouseY;
      }
    });

    window.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button === 0) {
        this.main.mouse.clicked = true;
        this.main.marblesContainer.setMaxSelectedMarble(this.main.mouse.point);
      }
      if (event.button === 1) {
        this.main.mouse.middleClicked = true;
        this.main.marblesContainer.setMaxSelectedMarble(this.main.mouse.point);
      }
    });

    window.addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button === 0) {
        this.main.mouse.clicked = false;
      }
      if (event.button === 1) {
        this.main.mouse.middleClicked = false;
        this.main.mouse.middleHold = false;
      }
    });
  }

  private initFileLoader(): void {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.value = '';
    fileInput.onchange = (e?: any) => {
      const file: File = e.target.files[0];
      if (file.name.endsWith('.json')) {
        file.text().then(
          text => {
            try {
              const marbleData = JSON.parse(text) as MarbleData[];
              fileInput.value = '';
              this.main.loadData(marbleData);
              this.updateContent();
            } catch (e) {
              console.warn('Load File Error!');
              console.warn(e);
            }
          }
        );
      }
    };
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
        Sound.play(Sounds.add);
        console.log('A');
      }

      if (event.key !== undefined && event.key === 'd') {
        handled = true;

        this.main.marblesContainer.removeMarble(this.main.mouse.point);
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

        this.main.load(1);
        // this.main.marblesContainer.highlight();
        console.log('K');
      }

      if (event.key !== undefined && event.key === 's') {
        handled = true;

        // this.main.save(this.main.marblesContainer,'save');
        console.log('S');
      }

      if (handled) {
        event.preventDefault();
      }
    }, true);
  }

  private initStageButtons(): void {
    const buttons = document.getElementsByClassName('stages')[0].getElementsByTagName('button');
    for(let i = 0; i < buttons.length; i++) {
      buttons.item(i).onclick = (e) => {
        this.main.load(parseInt((e.target as HTMLButtonElement).innerText, 10));
        this.updateContent();
      };
    }
  }

  private initGenerationButtons(): void {

    this.generateEasyBtnElement.onclick = () => {
      const md = this.generator.generateEasy();
      this.main.loadData(md);
      this.updateContent();
      Sound.play(Sounds.generate);
    };

    this.generateMediumBtnElement.onclick = () => {
      const md = this.generator.generateMedium();
      this.main.loadData(md);
      this.updateContent();
      Sound.play(Sounds.generate);
    };

    this.generateHardBtnElement.onclick = () => {
      const md = this.generator.generateHard();
      this.main.loadData(md);
      this.updateContent();
      Sound.play(Sounds.generate);
    };

    this.generateExtremeBtnElement.onclick = () => {
      const md = this.generator.generateExtreme();
      this.main.loadData(md);
      this.updateContent();
      Sound.play(Sounds.generate);
    };

  }

  private initSizeButtons(): void {

    this.decreaseBtnElement.onclick = () => {

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
    };

    this.resetBtnElement.onclick = () => {

      Variables.marbleRadius = 13;
      Variables.ringWidth = 2;
      Variables.lineWidth = 2;
      Variables.fontNrSize = 13;

    };

    this.increaseBtnElement.onclick = () => {

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

    };
  }

  private updateContent(): void {
    this.main.marblesContainer.highlight();
    this.main.marblesContainer.checkWinState();
    this.main.marblesContainer.highlight();
  }

}
