import MainEntry from '../main';
import { MarbleData } from './marbleData';
import { Generator } from './generator';
import { Variables } from './variables';

export class Listeners {

  generator: Generator;
  marbleNumberDisplayElement = document.querySelector('.marbleNumberDisplay') as HTMLDivElement;
  bondNumberDisplayElement = document.querySelector('.bondNumberDisplay') as HTMLDivElement;
  bondIntersectedNumberDisplayElement = document.querySelector('.bondIntersectedNumberDisplay') as HTMLDivElement;
  impossibleTextElement = document.querySelector('.impossible') as HTMLDivElement;

  generateEasyBtnElement = document.getElementById('generateEasy') as HTMLButtonElement;
  generateMediumBtnElement = document.getElementById('generateMedium') as HTMLButtonElement;
  generateHardBtnElement = document.getElementById('generateHard') as HTMLButtonElement;
  generateExtremeBtnElement = document.getElementById('generateExtreme') as HTMLButtonElement;

  constructor(private main: MainEntry){
    this.initHtmlListeners();
    this.initFileLoader();
    this.initKeys();
    this.initStageButtons();
    this.initGenerationButtons();
    this.generator = new Generator(main.width, main.height);
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
      this.main.marblesContainer.ordinalMarbleNumber = 0;
      this.main.marblesContainer.highlight();
      this.main.listeners.impossibleTextElement.style.display = 'none';
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
              // fileInput.value = '';
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

        console.log('A');
      }

      if (event.key !== undefined && event.key === 'd') {
        handled = true;

        this.main.marblesContainer.removeMarble(this.main.mouse.point);
        console.log('D');
      }

      if (event.key !== undefined && event.key === 'b') {
        handled = true;
        // let ziu = this.generator.test({...this.main.mouse.point});
        // this.main.loadData(ziu);
        Variables.marbleRadius++;
        Variables.ringWidth++;

        Variables.fontNrSize = (Variables.marbleRadius >= 6) && (Variables.marbleRadius <= 13) ? (Variables.marbleRadius + 2) : 15;
        Variables.lineWidth++;

        console.log('B');
      }

      if (event.key !== undefined && event.key === 'r') {
        handled = true;
        // console.log(this.generator.getEmptyTriangle());
        Variables.marbleRadius--;
        Variables.lineWidth--;
        Variables.ringWidth--;
        Variables.fontNrSize = (Variables.marbleRadius >= 6) && (Variables.marbleRadius <= 13) ? (Variables.marbleRadius + 2) : 15;


        console.log('R');
      }

      if (event.key !== undefined && event.key === 'l') {
        handled = true;

        // if (this.main.marblesContainer.isPointInTriangle({...this.main.mouse.point})) {
        //   console.log('IN');
          
        // } else {
          
        //   console.log('OUT');
        // }
        // StateManager.load(this.marblesContainer);
        // console.log('L');
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

  initStageButtons() {
    const buttons = document.getElementsByClassName('stages')[0].getElementsByTagName('button');
    for(let i = 0; i < buttons.length; i++) {
      buttons.item(i).onclick = (e) => {
        this.main.load(parseInt((e.target as HTMLButtonElement).innerText, 10));
        this.updateContent();
      };
    }
  }

  initGenerationButtons() {
    this.generateEasyBtnElement.onclick = () => {
      const md = this.generator.generateEasy();
      this.main.loadData(md);
      this.updateContent();
    };

    this.generateMediumBtnElement.onclick = () => {
      const md = this.generator.generateMedium();
      this.main.loadData(md);
      this.updateContent();
    };

    this.generateHardBtnElement.onclick = () => {
      const md = this.generator.generateHard();
      this.main.loadData(md);
      this.updateContent();
    };

    this.generateExtremeBtnElement.onclick = () => {
      const md = this.generator.generateExtreme();
      this.main.loadData(md);
      this.updateContent();
    };
  }

  updateContent(): void {
    this.main.marblesContainer.highlight();
    this.main.marblesContainer.checkWinState();
    this.main.marblesContainer.highlight();
  }

}
