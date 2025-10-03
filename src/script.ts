export class Game {
  selectors = {
    root: '[data-js-game]',
    number: '[data-js-game-number]',
  }

  rootElement: HTMLElement | null;
  numberElement: HTMLElement | null;
  board: (0 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048)[][];

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    this.numberElement = document.querySelector(this.selectors.number)
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    this.addRandomCell()
    this.bindEvents()
  }

  addRandomCell = () => {
    let emptyCells: [number, number][] = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex])
        }
      })
    })

    if (emptyCells.length === 0) return;

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    this.render()
  }

  moveLeft = () => {
    this.addRandomCell()
  }
  moveRight = () => {
    this.addRandomCell()
  }
  moveUp = () => {
    this.addRandomCell()
  }
  moveDown = () => {
    this.addRandomCell()
  }

  isGameOver() {
  }

  render() {

    this.isGameOver()
  }

  bindEvents() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
      }
    });
  }
}