import {
  dialog,
  errorStyle,
  questionStyle,
  inputStyle,
} from './consoleConfig';

const DEBUG = 0;

export default class ConsoleLogger {
  constructor() {
    this.dialog = dialog;
    this.i = 'greeting';
    this.input = '';
  }

  display(userInfo, leaderBoard, entry = false, err = false) {
    if (!DEBUG) console.clear();
    this.displayLeaderBoard(leaderBoard);
    if (!entry) entry = this.dialog[this.i](this.input, userInfo);

    console.log(`%c${entry.text}`, questionStyle);
    if (entry.subtext) console.log(`%c${entry.subtext[0]}`, entry.subtext[1]);

    if (err) console.error(`%c>:^(${entry.error}`, errorStyle);
    else console.log(`%c${this.input}`, inputStyle);
  }

  displayLeaderBoard = (leaderBoard) => {
    console.group('coolest shapes');
    leaderBoard.forEach(({ name, score, c }) => {
      console.log(`%c ${name}: ${score.toFixed(2)} `, `font-size: 10px;color: white; text-shadow: 1px 1px 0 rgb(0,20,20); background: ${c}`);
    });
    console.groupEnd();
  }

  enter(userInfo, leaderBoard) {
    const entry = this.dialog[this.i](this.input, userInfo);
    const { i, doCheck, ...res } = entry.goto;
    this.input = '';
    if (this.i === i) {
      this.display(userInfo, leaderBoard, false, true);
      return { newLogger: this };
    }
    this.i = i;
    const newEntry = this.dialog[this.i](this.input, userInfo.add(res));
    this.display(userInfo, leaderBoard, newEntry);
    return { newLogger: this, doCheck, attrs: res };
  }

  update(key, userInfo, leaderBoard) {
    if (!DEBUG) console.clear();
    if (key === 'Enter') {
      return this.enter(userInfo, leaderBoard);
    }

    this.input = (key.length > 1)
      ? (key === 'Backspace')
        ? this.input.slice(0, -1)
        : this.input
      : this.input + key;

    this.display(userInfo, leaderBoard);
    return { newLogger: this };
  }

  changePos(i) {
    this.i = i;
    return this;
  }
}
