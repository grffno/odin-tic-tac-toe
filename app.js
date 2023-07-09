const playerFactory = (mark) => {
    return { mark };
}

const gameBoard = (() => {

    // Create an array representing the game board
    const board = Array(9).fill('');

    const getBoard = () => board;

    // Create a function that takes a cell number and player name
    // and places a mark in the chosen cell
    const addMark = (cell, mark) => {
        board[cell] = mark;
    };


    return { addMark, getBoard }
})();

const gameController = (() => {

    // Define an array with all possible winning combinations
    const winCombos = [
        // Row combinations
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Column combinations
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonal combinations
        [0, 4, 8],
        [2, 4, 6]
    ];

    let winner = null;

    const playerX = playerFactory('X');
    const playerO = playerFactory('O');

    let activePlayer = playerX;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerX ? playerO : playerX;
    }

    const getActivePlayer = () => activePlayer;


    const playRound = (n) => {

        // Check if cell has a mark before adding the mark
        if (gameBoard.getBoard()[n] === '') {
            gameBoard.addMark(n, getActivePlayer().mark);

            checkWin();

            switchPlayerTurn();
        }
    }

    const checkWin = () => {
        const board = gameBoard.getBoard();

        // Map the gameboard to the possible winning combinations
        // Check if any of the new mapped arrays are all the same

        if (board.every(value => value !== '')) {
            winner = 'Draw';
        }

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

    return { playRound, getActivePlayer, getWinner }

})();

const displayController = (() => {
    const playerTurnDiv = document.querySelector('.turn');
    const boardDiv = document.querySelector('.board');

    const updateScreen = () => {
        // Clear the board
        boardDiv.textContent = '';

        const board = gameBoard.getBoard();
        const activePlayer = gameController.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.mark}'s turn`;

        // Create buttons for each cell of the board;
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
                playerTurnDiv.textContent = 'It\'s a draw!' :
                playerTurnDiv.textContent = `${winner.mark} wins!`;
        }
    }

    boardDiv.addEventListener('click', clickHandler);

    return { updateScreen }
})();

displayController.updateScreen();