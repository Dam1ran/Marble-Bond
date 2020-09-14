import './index.scss';
import MainEntry from './main';
import { SoundsLib } from './helpers/sounds-lib';
import { Generator } from './helpers/generator';
import { Mouse } from './helpers/mouse';
import { Handlers } from './helpers/handlers';
import { MarbleContainer } from './entities/marbleContainer';
import { Background } from './shapes/background';
import { DomObjects } from './helpers/domObjects';
import { Stages } from './stages/stages';
import { StageManager } from './helpers/stageManager';
import { BondCreator } from './entities/bondCreator';

// declare global {
//   interface Window {
//       test: () => void;
//   }
// }

document.getElementsByTagName('body')[0].style.backgroundColor = '#fafafa';


const canvasWidth = 600;
const canvasHeight = 700;

SoundsLib.init();
const _ctx = getContext();
const _mouse = new Mouse();

const _marbleContainer = new MarbleContainer(_ctx);
const _bondCreator = new BondCreator(_ctx, _marbleContainer);

const _stages = new Stages();
const _stageManager = new StageManager(_marbleContainer, _stages);

const _generator = new Generator(canvasWidth, canvasHeight);
const _handlers = new Handlers(_ctx, _mouse, _generator, _bondCreator, _marbleContainer, _stageManager);
const _domObjects = new DomObjects(_handlers);

const _background = new Background(_ctx);
const _main = new MainEntry(_ctx, _marbleContainer, _bondCreator, _background, _mouse, _domObjects);


function getContext (): CanvasRenderingContext2D {
  const canvas = document.querySelector('canvas');
  if (canvas != null) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx != null) {
      return ctx;
    }
    console.warn('Cannot Find Context');
  }
  console.warn('Cannot Find Canvas');
}

