import './index.scss';
import MainEntry from './main';

declare global {
  interface Window {
      test: () => void;
  }
}

document.getElementsByTagName('body')[0].style.backgroundColor = '#fafafa';

const _main = new MainEntry();

_main.start();


window.test = () => _main.test();

