export type AudioFile = { sound: HTMLAudioElement, played: boolean };

export class Sounds {

  static win: AudioFile;
  static generate: AudioFile;
  static add: AudioFile;
  static clear: AudioFile;
  static pick: AudioFile;
  static drop: AudioFile;
  static draw: AudioFile;
  static remove: AudioFile;
  static connect: AudioFile;
  static delete: AudioFile;
  static intersect: AudioFile;

  public static init(): void {
    this.win = { sound: new Audio('audio/win.mp3'), played: false };
    this.generate = { sound: new Audio('audio/generate.mp3'), played: false };
    this.add = { sound: new Audio('audio/add.mp3'), played: false };
    this.clear = { sound: new Audio('audio/clear.mp3'), played: false };
    this.pick = { sound: new Audio('audio/pick.mp3'), played: false };
    this.drop = { sound: new Audio('audio/drop.mp3'), played: true };
    this.draw = { sound: new Audio('audio/draw.mp3'), played: false };
    this.remove = { sound: new Audio('audio/remove.mp3'), played: false };
    this.connect = { sound: new Audio('audio/connect.mp3'), played: false };
    this.delete = { sound: new Audio('audio/delete.mp3'), played: false };
    this.intersect = { sound: new Audio('audio/intersect.mp3'), played: false };
  }

}
