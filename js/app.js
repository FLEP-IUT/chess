/**
 * MEMO
 * // Cavalier knight
 * Fou bishop
 * rook tour
 * pawn pion
 */

let board = null;
const game = new Chess();
const $status = document.getElementById("status");
let $history = document.getElementById("history");
const colorTable = {
  "w": {
    enemy: "b",
    label: "Blanc",
    color: "White"
  },
  "b": {
    enemy: "w",
    label: "Noir",
    color: "Black"
  }
}

const piecesTable = {
  "p": "un pion",
  "n": "un cavalier",
  "b": "un fou",
  "r": "une tour",
  "q": "une dame",
  "k": "un roi"
}

let moveDone = false;
let changePlayerTurn = false;
let lastPos;
let newPos;
let alreadyPlayed = false;

function onDragStart(source, piece) {
  if (alreadyPlayed) return false;
  if (game.game_over()) return false;

  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }

  const moves = game.moves({
    square: source,
    verbose: true,
  });

  // On return rien si nous n'avons aucun mouvement disponibles
  if (moves.length === 0) return;

  // Ici c'est qu'on a des cases à mettre en surbrillance
  // On met la case ou le pion se trouve en surbrillance
  selectableSquares(source);

  // Et toutes celles ou l'on peut se déplacer
  for (let i = 0; i < moves.length; i++) {
    selectableSquares(moves[i].to);
  }
}

function getLabelFromPieces(pieces) {
  return piecesTable[pieces];
}

function getEnemyFromLetter(letter) {
  return colorTable[letter].enemy
}

function getLabelFromLetter(letter) {
  return colorTable[letter].label;
}

function getColorFromLetter(letter) {
  return colorTable[letter].color;
}

function removeSelectableSquares() {
  const id = document.getElementById("chessboard");
  const squares = id.getElementsByClassName("square-55d63");
  for (let square of squares) {
    square.style.border = "none";
  }
}

function selectableSquares(_square) {
  const square = document.getElementById("chessboard");
  const squares = square.getElementsByClassName("square-" + _square);
  for (let item of squares) {
    item.style.border = "4px solid red";
  }
}

function moveDoneOk(undoB, confirmB) {
  moveDone = false;
  alreadyPlayed = false;
  undoB.style.display = "none";
  confirmB.style.display = "none";
}

window.onload = () => {
  const undoButton = document.getElementById("undoButton");
  const confirmButton = document.getElementById("confirmButton");
  undoButton.addEventListener("click", () => {
    if (newPos && lastPos) {
      board.move(newPos+"-"+lastPos);
      game.undo();
      moveDoneOk(undoButton, confirmButton)
    }
  })

  const newGameButton = document.getElementById("newGame");
  newGameButton.addEventListener("click", () => {
    game.reset();
    board.start();
    changePlayerTurn = false;
    alreadyPlayed = false;
    moveDone = false;
    if (board.orientation() === "black") {
      board.flip();
    }
    newGameButton.style.display = "none";
  });

  confirmButton.addEventListener("click", () => {
    if (game.in_checkmate() || game.in_draw()) {
      const newGameButton = document.getElementById("newGame");
      newGameButton.style.display = "block";
    }

    updateStatus();
    changePlayerTurn = true;
    board.flip();
    moveDoneOk(undoButton, confirmButton)
  })
}

function onDrop(source, target) {
  newPos = target;
  lastPos = source;
  removeSelectableSquares();
  if (!alreadyPlayed) {
    const move = game.move({from: source, to: target, promotion: "q"})
    if (move == null) {
      alreadyPlayed = false;
      return "snapback";
    } else {
      moveDone = true;
    }

    if (moveDone) {
      const undoButton = document.getElementById("undoButton");
      if (move["captured"] === undefined) {
        undoButton.style.display = "block";
      } else {
        console.log(move)
        const pieceCaptured = move.captured;
        const colorCaptured = getEnemyFromLetter(move.color);
        const pieceToAdd = document.createElement("li");
        const takenPiecesList = document.getElementById("takenPiecesList"+getColorFromLetter(move.color));
        pieceToAdd.innerHTML = "<img src='img/chesspieces/wikipedia/"+colorCaptured+pieceCaptured.toUpperCase()+".png' />";
        takenPiecesList.appendChild(pieceToAdd);
        if (takenPiecesList.getElementsByTagName("li").length > 0) {
          document.getElementById("takenPiecesDiv"+getColorFromLetter(move.color)).style.display = "flex";
        }
      }

      const confirmButton = document.getElementById("confirmButton");
      confirmButton.style.display = "block";
    }
  }
}

function updateStatus() {
  let status;

  let moveColor = "Blanc";
  if (game.turn() === "b") {
    moveColor = "Noir";
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = "Partie terminée, " + moveColor + " est en échec et mat.";
  }

  // draw?
  else if (game.in_draw()) {
    status = "Partie terminée - Egalité !";
  }

  // game still on
  else {
    status = "Tour du joueur " + moveColor;

    // check?
    if (game.in_check()) {
      status += "<br>Le joueur " + moveColor + " est en échec !";
    }
  }

  $status.innerHTML = status;
  if (game.history({verbose: true}).length > 0) {
    const currentTurn = game.history({verbose: true})[
    game.history({verbose: true}).length - 1
        ];
    const destinationSquare = currentTurn.to,
        originSquare = currentTurn.from;
    const currentPlayer = getLabelFromLetter(currentTurn.color),
        currentPiece = getLabelFromPieces(currentTurn.piece);
    const dateOfToday = new Date();
    const currentDate =
        "(" +
        dateOfToday.getDate() +
        "/" +
        (dateOfToday.getMonth() + 1) +
        "/" +
        dateOfToday.getFullYear() +
        " - " +
        dateOfToday.getHours() +
        "h" +
        dateOfToday.getMinutes() +
        ")";
    let msgContent;
    if (!currentTurn.captured) {
      msgContent =
          "Le joueur " +
          currentPlayer +
          " a bougé " +
          currentPiece +
          " de la case " +
          originSquare +
          " vers " +
          destinationSquare +
          " - " +
          currentDate;
    } else {
      const currentPieceCaptured = getLabelFromPieces(currentTurn.captured),
          currentEnemy = getLabelFromLetter(
              getEnemyFromLetter(currentTurn.color)
          );
      msgContent =
          "Le joueur " +
          currentPlayer +
          " a pris " +
          currentPieceCaptured +
          " au joueur " +
          currentEnemy +
          " sur la case " +
          destinationSquare;
    }
    let newMsg = document.createElement("li");
    newMsg.appendChild(document.createTextNode(msgContent));
    $history.appendChild(newMsg);
    newMsg.scrollIntoView();
  }
}

const config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
};
board = Chessboard("chessboard", config);
$("#chessboad").on("scoll touchmove touchend touchstart contextmenu", function(e) {
  e.preventDefault();
})

updateStatus();
