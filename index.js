const gameBoard = (() => {
  let game = {
    state: "X",
    board: [],
    pause: false,
    moves: 0,
  };

  clearBoard(game);

  const squares = document.querySelectorAll(".square");
  for (let i = 0; i < 9; i++) {
    squares[i].id = i;
  }

  function resetDOMBoard() {
    for (let i = 0; i < 9; i++) squares[i].innerText = "";
  }

  function clearBoardWrapped(game) {
    game.board = new Array(3);
    for (let i = 0; i < 3; i++) {
      game.board[i] = new Array(3);
      for (let j = 0; j < 3; j++) {
        game.board[i][j] = "-";
      }
    }
  }

  function clearBoard() {
    clearBoardWrapped(game);
    game.state = "X";
    game.pause = false;
    game.moves = "0";
  }

  function checkWinner(x, y, game) {
    //semi-hard coded cause I've spent too much time trying to make the perfect algorithm
    const val = game.board[y][x];
    let check = true;
    for (let i = -2; i < 4; i++) {
      if (x + i >= 0 && x + i <= 2) {
        if (val !== game.board[y][x + i]) {
          check = false;
          break;
        }
      }
    }
    if (check) return check;

    check = true;
    for (let i = -2; i < 4; i++) {
      if (y + i >= 0 && y + i <= 2) {
        if (val !== game.board[y + i][x]) {
          check = false;
          break;
        }
      }
    }
    if (check) return check;
    if (
      game.board[0][0] === game.board[1][1] &&
      game.board[1][1] === game.board[2][2] &&
      game.board[0][0] !== "-"
    )
      return true;
    if (
      game.board[0][2] === game.board[1][1] &&
      game.board[2][0] === game.board[1][1] &&
      game.board[1][1] !== "-"
    )
      return true;
  }

  function playMoveWrapped(num, game) {
    num = Number(num);
    const x = Number(num % 3);
    const y = Number((num - x) / 3);
    game.moves++;
    if (game.board[y][x] !== "-") return false;
    game.board[Number(y)][Number(x)] = game.state;
    document.getElementById(`${num}`).innerText = game.state;
    if (checkWinner(x, y, game)) {
      game.pause = true;
      return game.state;
    }
    if (game.state !== "X") game.state = "X";
    else game.state = "O";

    return true;
  }

  function playMove(num) {
    if (game.pause) return;
    return playMoveWrapped(num, game);
  }

  return { game, clearBoard, resetDOMBoard, playMove };
})();

const actionText = (() => {
  const Actiontext = document.getElementById("action-text");

  function anounceWinner(winner) {
    Actiontext.innerText = "The winner is player " + winner;
  }

  function annouceTie() {
    Actiontext.innerText = "It is a tie!";
  }

  function clearText() {
    Actiontext.innerText = "";
  }
  return {
    annouceTie,
    anounceWinner,
    clearText,
  };
})();

document.getElementById("grid").addEventListener("click", (e) => {
  let status = gameBoard.playMove(e.target.id);
  if (status === "O" || status === "X") {
    actionText.anounceWinner(status);
    return;
  }
  if (!gameBoard.game.pause && gameBoard.game.moves === 9)
    actionText.annouceTie();
});

document.getElementById("reset").addEventListener("click", () => {
  gameBoard.resetDOMBoard();
  gameBoard.clearBoard();
  actionText.clearText();
});
