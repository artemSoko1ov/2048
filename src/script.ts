export class Game {
  selectors = {
    root: '[data-js-game]',
    overlay: '[data-js-game-overlay]',
    buttonRestart: '[data-js-game-button-restart]',
  }

  stateClasses = {
    isActive: 'active',
  }

  rootElement: HTMLElement | null;
  overlayElement: HTMLElement | null;
  buttonRestartElement: HTMLElement | null;
  board: number[][];

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root)
    this.overlayElement = document.querySelector(this.selectors.overlay)
    this.buttonRestartElement = document.querySelector(this.selectors.buttonRestart)
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]

    this.addRandomCell()
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

  transpose(board: number[][]) {
    return board[0].map((_, i) => board.map(row => row[i]));
  }

  moveLeft = () => {
    let moved = false;

    this.board = this.board.map((row) => {
      const original = [...row];

      let filtered = row.filter(v => v !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] = filtered[i] * 2;
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter(v => v !== 0);

      while (filtered.length < 4) filtered.push(0);

      for (let i = 0; i < 4; i++) {
        if (filtered[i] !== original[i]) {
          moved = true;
          break;
        }
      }

      return filtered;
    });

    if (moved) {
      setTimeout(() => {
        this.addRandomCell();
      }, 150);
    }
  }

  moveRight = () => {
    this.board = this.board.map(row => row.reverse());
    this.moveLeft();
    this.board = this.board.map(row => row.reverse());
  }

  moveUp = () => {
    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown = () => {
    this.board = this.transpose(this.board);
    this.moveRight();
    this.board = this.transpose(this.board);
  }

  isGameOver() {
    const hasEmpty = this.board.some(row => row.includes(0));
    if (hasEmpty) return;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return;
        }
      }
    }

    setTimeout(() => this.showModal(), 300);
  }

  showModal() {
    this.overlayElement?.classList.add(this.stateClasses.isActive)
  }

  clearBoard = () => {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]
    this.addRandomCell()
    this.addRandomCell()
    this.overlayElement?.classList.remove(this.stateClasses.isActive)
  }

  render() {
    if (!this.rootElement) return;
    this.rootElement.innerHTML = '';

    this.board.forEach((row) => {
      row.forEach((cell) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('game-element');
        if (cell !== 0) {
          cellDiv.classList.add(`game--${cell}`);
          cellDiv.textContent = cell.toString();
        }
        this.rootElement?.appendChild(cellDiv)
      })
    })
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
    this.buttonRestartElement?.addEventListener('click', this.clearBoard)
  }
}