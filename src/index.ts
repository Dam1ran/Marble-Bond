import './index.scss';
import MainEntry from './main';
import { Sounds } from './helpers/sounds';

// declare global {
//   interface Window {
//       test: () => void;
//   }
// }

document.getElementsByTagName('body')[0].style.backgroundColor = '#fafafa';

const _main = new MainEntry();
Sounds.init();

_main.start();

