import './index.scss';
import MainEntry from './main';
import { SoundsLib } from './helpers/sounds-lib';

// declare global {
//   interface Window {
//       test: () => void;
//   }
// }

document.getElementsByTagName('body')[0].style.backgroundColor = '#fafafa';

const _main = new MainEntry();
SoundsLib.init();

_main.start();

