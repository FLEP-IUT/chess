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

function onDragStart(source, piece) {
  if (game.game_over()) return false;

  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

function getLabelFromPieces(pieces) {
  switch (pieces) {
    case "p":
      return "un pion";
    case "n":
      return "un cavalier";
    case "b":
      return "un fou";
    case "r":
      return "une tour";
    case "q":
      return "une reine";
    case "k":
      return "un roi";
  }
}

function getEnemyFromLetter(letter) {
  if (letter === "w") return "b";
  if (letter === "b") return "w";
}

function getColorFromLetter(letter) {
  if (letter === "w") return "Blanc";
  if (letter === "b") return "Noir";

  return "";
}

function removeSelectableSquares() {
  const id = document.getElementById("chessboard");
  const squares = id.getElementsByClassName("square-55d63");
  for (let square of squares) {
    square.style.border = "none";
  }
  // $("#chessboard .square-55d63").css("border", "none");
}

function selectableSquares(_square) {
  const square = document.getElementById("chessboard");
  const squares = square.getElementsByClassName("square-" + _square);
  for (let item of squares) {
    item.style.border = "4px solid red";
  }
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: Tjrs mettre au rang de reine par simplicité ?
  });



  if (game.in_checkmate() || game.in_draw()) {
    const newGameButton = document.getElementById("newGame");
    newGameButton.style.display = "block";
    newGameButton.addEventListener("click", () => {
      board.start();
      newGameButton.style.display = "none";
    });
  }

  // Déplacement impossible
  if (move === null) return "snapback";

  updateStatus();
  board.flip();
}

function onMouseoverSquare(square) {
  // Récupère la liste des différents déplacements possibles
  const moves = game.moves({
    square: square,
    verbose: true,
  });

  // On return rien si nous n'avons aucun mouvement disponibles
  if (moves.length === 0) return;

  // Ici c'est qu'on a des cases à mettre en surbrillance
  // On met la case ou le pion se trouve en surbrillance
  selectableSquares(square);

  // Et toutes celles ou l'on peut se déplacer
  for (let i = 0; i < moves.length; i++) {
    selectableSquares(moves[i].to);
  }
}

function onMouseoutSquare() {
  removeSelectableSquares();
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
    const currentPlayer = getColorFromLetter(currentTurn.color),
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
          currentEnemy = getColorFromLetter(
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
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
};
board = Chessboard("chessboard", config);

updateStatus();
