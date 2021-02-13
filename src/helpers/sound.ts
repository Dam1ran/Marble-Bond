import { AudioFile } from './sounds-lib';

export class Sound {

  soundOff = false;

  public play(arg: AudioFile): void {
    arg.sound.currentTime = 0;
    if (!this.soundOff) {
      arg.sound.play();
    }
  }

  public playOnce(arg: AudioFile): void {
    if (!arg.played) {
      arg.sound.currentTime = 0;
      if (!this.soundOff) {
        arg.sound.play();
      }
      arg.played = true;
    }
  }

  public reset(arg: AudioFile): void {
    arg.played = false;
  }
}
