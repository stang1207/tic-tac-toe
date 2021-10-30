'use strict';
const game = (function () {
  let gameBoard = [
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
    '&nbsp;',
  ];
  //Monitor is the game ongoing
  let isGameOn = true;
  //determine winner / winning conditions
  const findWinner = (currentPlayer) => {
    switch (true) {
      //diagonal rows
      case game.gameBoard[0] === currentPlayer.mark &&
        game.gameBoard[4] === currentPlayer.mark &&
        game.gameBoard[8] === currentPlayer.mark:
        game.isGameOn = false;
        break;
      case game.gameBoard[2] === currentPlayer.mark &&
        game.gameBoard[4] === currentPlayer.mark &&
        game.gameBoard[6] === currentPlayer.mark:
        game.isGameOn = false;
        break;
      //horizontal rows
      case game.gameBoard[0] === currentPlayer.mark &&
        game.gameBoard[1] === currentPlayer.mark &&
        game.gameBoard[2] === currentPlayer.mark:
        game.isGameOn = false;
        break;
      case game.gameBoard[3] === currentPlayer.mark &&
        game.gameBoard[4] === currentPlayer.mark &&
        game.gameBoard[5] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      case game.gameBoard[6] === currentPlayer.mark &&
        game.gameBoard[7] === currentPlayer.mark &&
        game.gameBoard[8] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      //vertical rows
      case game.gameBoard[0] === currentPlayer.mark &&
        game.gameBoard[3] === currentPlayer.mark &&
        game.gameBoard[6] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      case game.gameBoard[1] === currentPlayer.mark &&
        game.gameBoard[4] === currentPlayer.mark &&
        game.gameBoard[7] === currentPlayer.mark:
        game.isGameOn = false;
        break;

      case game.gameBoard[2] === currentPlayer.mark &&
        game.gameBoard[5] === currentPlayer.mark &&
        game.gameBoard[8] === currentPlayer.mark:
        game.isGameOn = false;
        break;
    }
  };

  return { gameBoard, findWinner, isGameOn };
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
    return player.player1.isPlayerTurn ? player.player1 : player.player2;
  };

  const getWaitingPlayer = () => {
    return player.player1.isPlayerTurn ? player.player2 : player.player1;
  };

  return {
    player1,
    player2,
    getCurrentPlayer,
    getWaitingPlayer,
  };
})();

//Controller
const displayController = (function () {
  const reset = document.querySelector('.reset');
  const container = document.querySelector('.container');
  const message = document.querySelector('.message');

  //Render 9 equal squares
  const renderCells = (arr) => {
    container.innerHTML = '';
    arr.forEach((cell, index) => {
      const html = `<div class="cell cell-${
        index + 1
      }" data-key="${index}">${cell}</div>`;
      container.insertAdjacentHTML('beforeend', html);
    });
  };
  //Add event listeners to the squares
  const cellHandler = () => {
    const allCells = document.querySelectorAll('.cell');
    allCells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        //Return immediately if the game is not running || clear the display message if the game is on
        const currentPlayer = player.getCurrentPlayer();
        if (!game.isGameOn) return;
        displayMessage('');

        //Return immediately if there is already something in the square
        if (
          e.target.firstChild.textContent === 'O' ||
          e.target.firstChild.textContent === 'X'
        ) {
          return;
        }

        //Update the gameboard array if player made a move
        if (
          currentPlayer === player.player1 ||
          currentPlayer === player.player2
        ) {
          updateArray(e, currentPlayer);
        }

        //check if there is a winner
        game.findWinner(currentPlayer);
        displayMessage();

        //Update the UI when player made a move
        updateUI(e, currentPlayer);
        switchPlayer();
      });
    });
  };

  const updateArray = (e, player) => {
    const index = e.target.closest('.cell').getAttribute('data-key');
    game.gameBoard[index] = player.mark;
  };

  const updateUI = (e, currentPlayer) => {
    e.target.innerHTML = '';
    const newSpan = document.createElement('span');
    newSpan.textContent = currentPlayer.mark;
    e.target.appendChild(newSpan);
    e.target.classList.add(
      `player${currentPlayer.name === 'Player 1' ? '1' : '2'}__color`
    );
  };

  const switchPlayer = () => {
    let temp = player.getWaitingPlayer();
    player.getCurrentPlayer().isPlayerTurn =
      !player.getCurrentPlayer().isPlayerTurn;
    temp.isPlayerTurn = !temp.isPlayerTurn;
  };

  const displayMessage = (text) => {
    const isGameBoardFull =
      game.gameBoard.filter((square) => square === 'X' || square === 'O')
        .length === 9;

    //if the game result in a draw
    if (game.isGameOn && isGameBoardFull) {
      text = `It's a tie!`;
    }
    //if sonemone won and the game is switch to off
    if (!game.isGameOn && isGameBoardFull.length !== 0) {
      message.classList.add('winner');
      text = `${player.getCurrentPlayer().name} won the game!`;
    }

    return (message.textContent = text);
  };

  const initGame = () => {
    renderCells(game.gameBoard);
    cellHandler();
    displayMessage('Click one of the squares to start the game');
    reset.addEventListener('click', resetGame);
  };

  //reset the game
  const resetGame = () => {
    game.gameBoard = game.gameBoard.map((square) => {
      return (square = '&nbsp;');
    });

    //reset game status
    game.isGameOn = true;

    //reset player info
    player.player1.isPlayerTurn = true;
    player.player2.isPlayerTurn = false;

    //rerender squares, add event handlers to them, and display message
    renderCells(game.gameBoard);
    cellHandler();
    displayMessage('Click one of the squares to start the game');
    message.classList.remove('winner');
  };

  initGame();
})();
