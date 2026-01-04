const BOARD_SIZE = 10
const MINES_COUNT = 10

let board = []
let GameOver = false
let FirstClick = true

const game_board = document.querySelector('.board')

function initGame() {
    game_board.innerHTML = '';
        board = Array(BOARD_SIZE).fill().map(() => 
            Array(BOARD_SIZE).fill().map(() => ({
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            }))
        );
      
      GameOver = false;
      FirstClick = true;
      flagsPlaced = 0;

      CreateBoard();
    }

function CreateBoard () {
    for (let x = 0; x < BOARD_SIZE; x += 1) {
        for (let y = 0; y < BOARD_SIZE; y += 1) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
          
            cell.addEventListener('click', () => handleLeftClick(x, y));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                handleRightClick(x, y);
            });
          
            game_board.appendChild(cell);
        }
    }
}

initGame()