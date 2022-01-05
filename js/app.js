var board = null;
var game = new Chess();
var $status = $("#status");
var $fen = $("#fen");
var $pgn = $("#pgn");
let $history = document.getElementById("history");
var greenSquareColor = "#23cf23";

function onDragStart(source, piece, position, orientation) {
  if (game.game_over()) return false;

  if (
    (game.turn() === "w" && piece.search(/^b/) !== -1) ||
    (game.turn() === "b" && piece.search(/^w/) !== -1)
  ) {
    return false;
  }
}

// Cavalier knight, Fou bishop, rook tour, pawn pion

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

function removeGreenSquares() {
  // $('#chessboard .square-55d63').css('background', '')
  // $('#chessboard .square-55d63').css('opacity', '1')
  $("#chessboard .square-55d63").css("border", "none");
}

function greenSquares(square) {
  var $square = $("#chessboard .square-" + square);

  var background = greenSquareColor;

  // $square.css('background', background)
  // $square.css('opacity', 0.6)
  $square.css("border", "4px solid red");
}

function onDrop(source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: "q", // NOTE: always promote to a queen for example simplicity
  });

  // illegal move
  if (move === null) return "snapback";
}

function onMouseoverSquare(square, piece) {
  // get list of possible moves for this square
  var moves = game.moves({
    square: square,
    verbose: true,
  });

  // exit if there are no moves available for this square
  if (moves.length === 0) return;

  // highlight the square they moused over
  if (!canConfirm) {
    greenSquares(square);

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greenSquares(moves[i].to);
    }
  }
}

function onMouseoutSquare(square, piece) {
  removeGreenSquares();
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd() {
  // board.position(game.fen());
  // canConfirm = true;
}

function updateStatus() {
  var status = "";

  var moveColor = "Blanc";
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

  $status.html(status);
  if (game.history({ verbose: true }).length > 0) {
    const currentTurn = game.history({ verbose: true })[
      game.history({ verbose: true }).length - 1
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
  }
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd,
};
board = Chessboard("chessboard", config);
updateStatus();
