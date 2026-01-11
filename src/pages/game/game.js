const ROWS = 10;
const COLS = 10;
const MINES = 10;

let board = [];
let minePositions = new Set();
let gameOver = false;
let flagsPlaced = 0;

const boardElement = document.getElementById('board');
const minesCountElement = document.getElementById('count');
const restartButton = document.getElementById('restart');

function initGame() {
  boardElement.innerHTML = '';
  board = Array(ROWS).fill().map(() => Array(COLS).fill(0));
  minePositions.clear();
  gameOver = false;
  flagsPlaced = 0;
  minesCountElement.textContent = MINES;

  placeMines();
  calculateNumbers();
  renderBoard();
}


function placeMines() {
  let minesPlaced = 0;
  while (minesPlaced < MINES) {
    const row = Math.floor(Math.random() * ROWS);
    const col = Math.floor(Math.random() * COLS);
    const key = `${row},${col}`;
    if (!minePositions.has(key)) {
      minePositions.add(key);
      board[row][col] = -1;
      minesPlaced++;
    }
  }
}

function calculateNumbers() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === -1) continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
            if (board[nr][nc] === -1) count++;
          }
        }
      }
      board[r][c] = count;
    }
  }
}

function renderBoard() {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.addEventListener('click', () => handleCellClick(r, c));
      cell.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        toggleFlag(r, c);
      });

      boardElement.appendChild(cell);
    }
  }
}

function handleCellClick(row, col) {
  if (gameOver) return;
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (cell.classList.contains('flagged') || cell.classList.contains('revealed')) return;

  if (board[row][col] === -1) {
    revealAllMines();
    cell.classList.add('mine', 'revealed');
    alert('💥 Вы проиграли!');
    gameOver = true;
    return;
  }

  revealCell(row, col);

  checkWin();
}


function revealCell(row, col) {
  const key = `${row},${col}`;
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (!cell || cell.classList.contains('revealed') || cell.classList.contains('flagged')) return;

  cell.classList.add('revealed');
  if (board[row][col] > 0) {
    cell.textContent = board[row][col];

    const colors = ['','blue','green','red','purple','maroon','turquoise','black','gray'];
    cell.style.color = colors[board[row][col]];
  } else {

    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          revealCell(nr, nc);
        }
      }
    }
  }
}

function toggleFlag(row, col) {
  if (gameOver) return;
  const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
  if (cell.classList.contains('revealed')) return;

  if (cell.classList.contains('flagged')) {
    cell.classList.remove('flagged');
    flagsPlaced--;
  } else {
    if (flagsPlaced >= MINES) return;
    cell.classList.add('flagged');
    flagsPlaced++;
  }
  minesCountElement.textContent = MINES - flagsPlaced;
  checkWin();
}

function revealAllMines() {
  minePositions.forEach(pos => {
    const [r, c] = pos.split(',').map(Number);
    const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
    if (!cell.classList.contains('flagged')) {
      cell.classList.add('mine', 'revealed');
    }
  });
}

function checkWin() {
  let revealedCount = 0;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
      if (cell.classList.contains('revealed') && !cell.classList.contains('mine')) {
        revealedCount++;
      }
    }
  }
  if (revealedCount === ROWS * COLS - MINES) {
    alert('🎉 Вы выиграли!');
    gameOver = true;
  }
}

restartButton.addEventListener('click', initGame);

initGame();