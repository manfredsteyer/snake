import { Component } from '@angular/core';
import { BestScoreManager } from './app.storage.service';
import { CONTROLS, COLORS, BOARD_SIZE, GAME_MODES } from './app.constants';
import { Strategy } from './strategy/strategy';

@Component({
  selector: 'ngx-snake',
  template: `
<div class="game-container">
  <div class="game-header">
    <h3 class="logo">ngx-Snake</h3>
    <div class="score-block">
      <h3 class="score" [ngClass]="{'new-best-score': newBestScore}">Score: {{score}}</h3>
      <h3 class="best-score" [ngClass]="{'new-best-score': newBestScore}">Best Score: {{best_score}}</h3>
    </div>
  </div>
  <div class="row" *ngFor="let column of board; let i = index;">
    <div class="column" [ngStyle]="{'background-color': setColors(i, j)}" *ngFor="let row of column; let j = index"></div>
  </div>
  <div class="start-button" [ngClass]="{'disable-clicks': gameStarted}" (click)="showMenu()">Start Game</div>
  <div class="new-game-menu" *ngIf="showMenuChecker">
    <span class="new-game-menu-label">Select Mode</span>
    <div class="start-button new-game-button" (click)="newGame(mode)" *ngFor="let mode of getKeys(all_modes)">{{all_modes[mode]}}</div>
  </div>
</div>
  `,
  styles: [`
  .game-header {
    color: #fff;
    padding: 5px 15px 5px 0px;
    position: relative;
  }
  
  .game-header>.score-block {
    display: inline-block;
  }
  
  .score-block>.score {
    position: absolute;
    right: 8px;
    top: -5px;
  }
  
  .score-block>.best-score {
    position: absolute;
    right: 8px;
    margin-top: 5px;
    font-size: 12px;
  }
  
  .game-header>.logo {
    display: inline-block;
    padding-left: 15px;
  }
  
  .game-container {
    width: 468px;
    position: relative;
    display: block;
    margin: auto;
    background-color: #47565A;
    box-shadow: 0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
  }
  
  .row {
    height: 26px;
  }
  
  .column {
    border: 1px solid rgba(97, 131, 138, .1);
    width: 24px;
    height: 24px;
    display: inline-block;
  }
  
  .start-button {
    padding: 15px;
    text-align: center;
    background-color: #47565A;
    color: white;
    border-radius: 5px;
  }
  
  .start-button:hover {
    opacity: 0.65;
    cursor: pointer;
  }
  
  .start-button.new-game-button {
    margin: 0 105px 4px 105px;
  }
  
  .disable-clicks {
    pointer-events: none;
  }
  
  .new-game-menu {
    position: absolute;
    top: 0;
    width: 100%;
    bottom: 0;
    padding: 40% 0;
    text-align: center;
    background: rgba(0, 0, 0, 0.15);
  }
  
  .new-game-menu-label {
    font-size: 1.17em;
    margin-bottom: 13px;
    display: block;
    color: #fff;
  }
  
  .new-best-score {
    animation: glow .5s infinite alternate;
  }
  
  @keyframes glow {
    to {
      text-shadow: 0 0 15px #ffff00;
    }
  }
  
  @media screen and (max-width: 480px) {
    .game-container {
      width: 100%;
    }
    .column {
      width: 5.55%;
      height: 0;
      padding-bottom: 5.06%;
      box-sizing: border-box;
    }
    .row {
      display: -webkit-box;
      display: -moz-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      height: 0;
      padding-bottom: 5.5%;
    }
    .new-game-menu {
      width: 100%;
      top: 8px;
      padding-top: 30%;
      font-size: 80%;
    }
    .start-button.new-game-button {
      margin: 0 15% 1% 15%;
    }
    @-moz-document url-prefix() {
      .column {
        min-height: 5.5vw;
      }
    }
  }
  `],
  host: {
    '(document:keydown)': 'handleKeyboardEvents($event)'
  }
})
export class AppComponent {
  private interval: number;
  private tempDirection: number;
  private default_mode = 'classic';
  private isGameOver = false;

  public all_modes = GAME_MODES;
  public getKeys = Object.keys;
  public board = [];
  public obstacles = [];
  public score = 0;
  public showMenuChecker = false;
  public gameStarted = false;
  public newBestScore = false;
  public best_score = this.bestScoreService.retrieve();

  private snake = {
    direction: CONTROLS.LEFT,
    parts: [
      {
        x: -1,
        y: -1
      }
    ]
  };

  private fruit = {
    x: -1,
    y: -1
  };

  private strategy: Strategy = null;

  constructor(
    private bestScoreService: BestScoreManager,
  ) {
    this.setBoard();

    // import('./strategy/custom.strategy')
    import('strategy/Strategy')
      .then(m => {
        this.strategy = new m.CustomStrategy();
      })
      .catch(err => {
        console.error('error loading strategy', err);
      });
  }

  handleKeyboardEvents(e: KeyboardEvent) {

    if (this.strategy) {
      return;
    }

    if (e.keyCode === CONTROLS.LEFT && this.snake.direction !== CONTROLS.RIGHT) {
      this.tempDirection = CONTROLS.LEFT;
    } else if (e.keyCode === CONTROLS.UP && this.snake.direction !== CONTROLS.DOWN) {
      this.tempDirection = CONTROLS.UP;
    } else if (e.keyCode === CONTROLS.RIGHT && this.snake.direction !== CONTROLS.LEFT) {
      this.tempDirection = CONTROLS.RIGHT;
    } else if (e.keyCode === CONTROLS.DOWN && this.snake.direction !== CONTROLS.UP) {
      this.tempDirection = CONTROLS.DOWN;
    }
  }

  setColors(col: number, row: number): string {
    if (this.isGameOver) {
      return COLORS.GAME_OVER;
    } else if (this.fruit.x === row && this.fruit.y === col) {
      return COLORS.FRUIT;
    } else if (this.snake.parts[0].x === row && this.snake.parts[0].y === col) {
      return COLORS.HEAD;
    } else if (this.board[col][row] === true) {
      return COLORS.BODY;
    } else if (this.default_mode === 'obstacles' && this.checkObstacles(row, col)) {
      return COLORS.OBSTACLE;
    }

    return COLORS.BOARD;
  };

  updatePositions(): void {

    if (this.strategy) {
      this.tempDirection = this.strategy.step({
        fruit: this.fruit,
        obstacles: this.obstacles,
        snake: this.snake
      });
    }

    let newHead = this.repositionHead();
    let me = this;

    if (this.default_mode === 'classic' && this.boardCollision(newHead)) {
      return this.gameOver();
    } else if (this.default_mode === 'no_walls') {
      this.noWallsTransition(newHead);
    } else if (this.default_mode === 'obstacles') {
      this.noWallsTransition(newHead);
      if (this.obstacleCollision(newHead)) {
        return this.gameOver();
      }
    }

    if (this.selfCollision(newHead)) {
      return this.gameOver();
    } else if (this.fruitCollision(newHead)) {
      this.eatFruit();
    }

    let oldTail = this.snake.parts.pop();
    this.board[oldTail.y][oldTail.x] = false;

    this.snake.parts.unshift(newHead);
    this.board[newHead.y][newHead.x] = true;

    this.snake.direction = this.tempDirection;

    setTimeout(() => {
      me.updatePositions();
    }, this.interval);
  }

  repositionHead(): any {
    let newHead = Object.assign({}, this.snake.parts[0]);

    if (this.tempDirection === CONTROLS.LEFT) {
      newHead.x -= 1;
    } else if (this.tempDirection === CONTROLS.RIGHT) {
      newHead.x += 1;
    } else if (this.tempDirection === CONTROLS.UP) {
      newHead.y -= 1;
    } else if (this.tempDirection === CONTROLS.DOWN) {
      newHead.y += 1;
    }

    return newHead;
  }

  noWallsTransition(part: any): void {
    if (part.x === BOARD_SIZE) {
      part.x = 0;
    } else if (part.x === -1) {
      part.x = BOARD_SIZE - 1;
    }

    if (part.y === BOARD_SIZE) {
      part.y = 0;
    } else if (part.y === -1) {
      part.y = BOARD_SIZE - 1;
    }
  }

  addObstacles(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || y === 8) {
      return this.addObstacles();
    }

    this.obstacles.push({
      x: x,
      y: y
    });
  }

  checkObstacles(x, y): boolean {
    let res = false;

    this.obstacles.forEach((val) => {
      if (val.x === x && val.y === y) {
        res = true;
      }
    });

    return res;
  }

  obstacleCollision(part: any): boolean {
    return this.checkObstacles(part.x, part.y);
  }

  boardCollision(part: any): boolean {
    return part.x === BOARD_SIZE || part.x === -1 || part.y === BOARD_SIZE || part.y === -1;
  }

  selfCollision(part: any): boolean {
    return this.board[part.y][part.x] === true;
  }

  fruitCollision(part: any): boolean {
    return part.x === this.fruit.x && part.y === this.fruit.y;
  }

  resetFruit(): void {
    let x = this.randomNumber();
    let y = this.randomNumber();

    if (this.board[y][x] === true || this.checkObstacles(x, y)) {
      return this.resetFruit();
    }

    this.fruit = {
      x: x,
      y: y
    };
  }

  eatFruit(): void {
    this.score++;

    let tail = Object.assign({}, this.snake.parts[this.snake.parts.length - 1]);

    this.snake.parts.push(tail);
    this.resetFruit();

    if (this.score % 5 === 0) {
      this.interval -= 15;
    }
  }

  gameOver(): void {
    this.isGameOver = true;
    this.gameStarted = false;
    let me = this;

    if (this.score > this.best_score) {
      this.bestScoreService.store(this.score);
      this.best_score = this.score;
      this.newBestScore = true;
    }

    setTimeout(() => {
      me.isGameOver = false;
    }, 500);

    this.setBoard();
  }

  randomNumber(): any {
    return Math.floor(Math.random() * BOARD_SIZE);
  }

  setBoard(): void {
    this.board = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = false;
      }
    }
  }

  showMenu(): void {
    this.showMenuChecker = !this.showMenuChecker;
  }

  newGame(mode: string): void {
    this.default_mode = mode || 'classic';
    this.showMenuChecker = false;
    this.newBestScore = false;
    this.gameStarted = true;
    this.score = 0;
    this.tempDirection = CONTROLS.LEFT;
    this.isGameOver = false;
    this.interval = 150;
    this.snake = {
      direction: CONTROLS.LEFT,
      parts: []
    };

    for (let i = 0; i < 3; i++) {
      this.snake.parts.push({ x: 8 + i, y: 8 });
    }

    if (mode === 'obstacles') {
      this.obstacles = [];
      let j = 1;
      do {
        this.addObstacles();
      } while (j++ < 9);
    }

    this.resetFruit();
    this.updatePositions();
  }
}
