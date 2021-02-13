export type AudioFile = { sound: HTMLAudioElement, played: boolean };

export class SoundsLib {

  constructor () {
    this.init();
  }

  win: AudioFile;
  generate: AudioFile;
  add: AudioFile;
  clear: AudioFile;
  pick: AudioFile;
  drop: AudioFile;
  draw: AudioFile;
  remove: AudioFile;
  connect: AudioFile;
  delete: AudioFile;
  intersect: AudioFile;
  stageClick: AudioFile;

  private init(): void {
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
    this.stageClick = { sound: new Audio('audio/stageClick.mp3'), played: false };
  }

}
