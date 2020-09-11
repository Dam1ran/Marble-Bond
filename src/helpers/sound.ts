import { AudioFile } from './sounds';

export class Sound {

  public static play(arg: AudioFile): void {
    arg.sound.currentTime = 0;
    arg.sound.play();
  }

  public static playOnce(arg: AudioFile): void {
    if (!arg.played) {
      arg.sound.currentTime = 0;
      arg.sound.play();
      arg.played = true;
    }
  }

  public static reset(arg: AudioFile): void {
    arg.played = false;
  }
}