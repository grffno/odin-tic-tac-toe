const gameBoard = (() => {
    const board = Array(9).fill('');

    const getBoard = () => board;

    const addMark = (cell, mark) => board[cell] = mark;

    const newBoard = () => board.fill('');

    return {
        addMark,
        getBoard,
        newBoard
    }
})();

const gameController = (() => {
    const playerFactory = (mark) => {
        return { mark };
    }

    const playerX = playerFactory('X');
    const playerO = playerFactory('O');
    const board = gameBoard.getBoard();
    const winCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    let winner;
    let activePlayer;

    const newGame = () => {
        winner = null;
        activePlayer = playerX;
    }

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerX ? playerO : playerX;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (n) => {
        // Check if cell has a mark before adding the mark
        if (board[n] === '') {
            gameBoard.addMark(n, getActivePlayer().mark);
            checkWin();
            switchPlayerTurn();
        }
    }

    const checkWin = () => {
        // If all cells are full, set winner to draw
        // (there is probably a more elegant way to do this)
        if (board.every(value => value !== '')) {
            winner = 'Draw';
        }

        // Map the gameboard to the possible winning combinations
        // Check if any of the new mapped arrays contain only X's or O's
        for (let i = 0; i < winCombos.length; i++) {
            let checkWinArr = winCombos[i].map(index => board[index]);
            if (checkWinArr.every(value => value === 'X')) {
                winner = playerX;
            } else if (checkWinArr.every(value => value === 'O')) {
                winner = playerO;
            }
        }
    }

    const getWinner = () => winner;

    return {
        playRound,
        getActivePlayer,
        getWinner,
        newGame
    }
})();

const displayController = (() => {
    const messageDiv = document.querySelector('.message');
    const boardDiv = document.querySelector('.board');
    const newGameBtn = document.querySelector('.new-game');

    const updateScreen = () => {
        boardDiv.textContent = '';
        const board = gameBoard.getBoard();
        const activePlayer = gameController.getActivePlayer();
        messageDiv.textContent = `${activePlayer.mark}'s turn`;

        // Create buttons for each cell of the board
        // Assign each button a data item with a unique index
        let indexCounter = 0;
        board.forEach(cell => {
            const btn = document.createElement('button');
            btn.classList.add('cell');
            btn.dataset.index = indexCounter;
            btn.textContent = cell;
            boardDiv.appendChild(btn);
            indexCounter++;
        });
    }

    const clickHandler = (e) => {
        const selectedCell = e.target;
        gameController.playRound(selectedCell.dataset.index);
        selectedCell.textContent = gameController.getActivePlayer().mark;
        updateScreen();

        const winner = gameController.getWinner();

        if (winner) {
            winner === 'Draw' ?
                messageDiv.textContent = 'It\'s a draw!' :
                messageDiv.textContent = `${winner.mark} wins!`;
            boardDiv.removeEventListener('click', clickHandler);
        }
    }

    const newGame = () => {
        newGameBtn.classList.add('clicked');
        setTimeout(() => { newGameBtn.classList.remove('clicked') }, 100);

        // this.style.boxShadow = '0px 0px 5px #666666';
        // setTimeout(() => { this.style.boxShadow = '' }, 100);

        gameBoard.newBoard();
        gameController.newGame();
        boardDiv.addEventListener('click', clickHandler);
        updateScreen();
    }

    newGameBtn.addEventListener('click', newGame);

    return { newGame }
})();

displayController.newGame();