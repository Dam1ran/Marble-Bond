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
import { BondCreator } from './entities/bondCreator';
import { StateController } from './helpers/stateController';
import { Sound } from './helpers/sound';

// declare global {
//   interface Window {
//       test: () => void;
//   }
// }

document.getElementsByTagName('body')[0].style.backgroundColor = '#fafafa';


const canvasWidth = 600;
const canvasHeight = 700;

const _ctx = getContext();
const _mouse = new Mouse();
const _soundsLib = new SoundsLib();
const _sound = new Sound();

const _marbleContainer = new MarbleContainer(_ctx, _soundsLib, _sound);
const _bondCreator = new BondCreator(_ctx, _marbleContainer, _soundsLib, _sound);

const _stateController = new StateController(_marbleContainer, _sound);
const _stages = new Stages(_marbleContainer);

const _generator = new Generator(canvasWidth, canvasHeight);
const _handlers = new Handlers(_ctx, _mouse, _generator, _marbleContainer, _stateController, _stages, _soundsLib, _sound);
const _domObjects = new DomObjects(_handlers, _sound);

const _background = new Background(_ctx);
const _main = new MainEntry(
  _ctx,
  _marbleContainer,
  _bondCreator,
  _background,
  _mouse,
  _domObjects,
  _stateController,
  _soundsLib,
  _sound,
  _handlers,
  _stages
);


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

