'use strict';
const game = (function () {
  let gameBoard = ['&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;', '&nbsp;'];
  //Monitor is the game ongoing
  let isGameOn = true;
  //determine winner / winning conditions
  const findWinner = (currentPlayer) => {
    switch (true) {
      //diagonal rows
      case game.gameBoard[0] === currentPlayer.mark && game.gameBoard[4] === currentPlayer.mark && game.gameBoard[8] === currentPlayer.mark:
        game.isGameOn = false;
        break;
      case game.gameBoard[2] === currentPlayer.mark && game.gameBoard[4] === currentPlayer.mark && game.gameBoard[6] === currentPlayer.mark:
        game.isGameOn = false;
        break;
      //horizontal rows
      case game.gameBoard[0] === currentPlayer.mark && game.gameBoard[1] === currentPlayer.mark && game.gameBoard[2] === currentPlayer.mark:
        game.isGameOn = false;
        break;
      case game.gameBoard[3] === currentPlayer.mark && game.gameBoard[4] === currentPlayer.mark && game.gameBoard[5] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      case game.gameBoard[6] === currentPlayer.mark && game.gameBoard[7] === currentPlayer.mark && game.gameBoard[8] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      //vertical rows
      case game.gameBoard[0] === currentPlayer.mark && game.gameBoard[3] === currentPlayer.mark && game.gameBoard[6] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      case game.gameBoard[1] === currentPlayer.mark && game.gameBoard[4] === currentPlayer.mark && game.gameBoard[7] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      case game.gameBoard[2] === currentPlayer.mark && game.gameBoard[5] === currentPlayer.mark && game.gameBoard[8] === currentPlayer.mark:
        game.isGameOn = false;
        break;
    }

    const isGameBoardFull = game.gameBoard.filter((square) => square === 'X' || square === 'O').length === 9;

    //if the game result in a draw
    if (game.isGameOn && isGameBoardFull) {
      return `It's a tie!`;
    }
    //if sonemone won turn off the game
    if (!game.isGameOn && isGameBoardFull.length !== 0) {
      return `${player.getCurrentPlayer().name} is the winner!!`;
    }
  };

  return { gameBoard, isGameOn, findWinner };
})();

//Player information
const player = (function () {
  const player1 = {
    name: 'Player 1',
    mark: 'X',
    isPlayerTurn: true,
  };

  const player2 = {
    name: 'Player 2',
    mark: 'O',
    isPlayerTurn: false,
  };

  const getCurrentPlayer = () => {
    return player1.isPlayerTurn ? player1 : player2;
  };

  const getWaitingPlayer = () => {
    return player1.isPlayerTurn ? player2 : player1;
  };

  return {
    getCurrentPlayer,
    getWaitingPlayer,
  };
})();

//Controller
const displayController = (function () {
  //Render 9 equal squares
  const renderCells = (arr) => {
    const container = document.querySelector('.container');
    container.innerHTML = '';
    arr.forEach((cell, index) => {
      const html = `<div class="cell cell-${index + 1}" data-key="${index}">${cell}</div>`;
      container.insertAdjacentHTML('beforeend', html);
    });
  };
  //Add click event handler to the squares to start the game
  const cellHandler = () => {
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        const currentPlayer = player.getCurrentPlayer();
        //Return immediately if the game is not running || clear the display message if the game is on
        if (!game.isGameOn) return;
        displayMessage('');

        //Return immediately if there is already something in the square
        if (e.target.firstChild.textContent === 'O' || e.target.firstChild.textContent === 'X') return;

        //Update the gameboard array if player made a move
        updateGameBoard(e, currentPlayer);
        //Update the UI when player made a move
        updateUI(e, currentPlayer);
        //check if there is a winner
        displayMessage(game.findWinner(currentPlayer));

        switchPlayer(currentPlayer);
      });
    });
  };

  const updateGameBoard = (e, player) => {
    const index = e.target.closest('.cell').getAttribute('data-key');
    game.gameBoard[index] = player.mark;
  };

  const updateUI = (e, currentPlayer) => {
    e.target.innerHTML = '';
    const newSpan = document.createElement('span');
    newSpan.textContent = currentPlayer.mark;
    e.target.appendChild(newSpan);
    e.target.classList.add(`player${currentPlayer.name === 'Player 1' ? '1' : '2'}__color`);
  };

  const switchPlayer = () => {
    const temp = player.getWaitingPlayer();
    player.getCurrentPlayer().isPlayerTurn = !player.getCurrentPlayer().isPlayerTurn;
    temp.isPlayerTurn = !temp.isPlayerTurn;
  };

  const displayMessage = (text = '') => {
    const message = document.querySelector('.message');
    message.textContent = text;
    return game.isGameOn ? message.classList.remove('winner') : message.classList.add('winner');
  };

  const initGame = () => {
    const reset = document.querySelector('.reset');
    reset.addEventListener('click', resetGame);
    renderCells(game.gameBoard);
    cellHandler();
    displayMessage('Click one of the squares to start the game');
  };

  const resetGame = () => {
    //Update gameboard array
    game.gameBoard = game.gameBoard.map((square) => {
      return (square = '&nbsp;');
    });
    //reset game status
    game.isGameOn = true;

    //Reset Player 1 to be the first player to make move
    if (player.getCurrentPlayer().name === 'Player 2') {
      switchPlayer();
    }

    //rerender squares, add event handlers to them, and display message
    renderCells(game.gameBoard);
    cellHandler();
    displayMessage('Click one of the squares to start the game');
  };

  initGame();
})();
