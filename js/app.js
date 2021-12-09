var board = null
var game = new Chess()
var $status = $('#status')
var $fen = $('#fen')
var $pgn = $('#pgn')
var greenSquareColor = '#23cf23'

function onDragStart (source, piece, position, orientation) {
  // do not pick up pieces if the game is over
  if (game.game_over()) return false

  // only pick up pieces for the side to move
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false
  }
}

function removeGreenSquares () {
    // $('#chessboard .square-55d63').css('background', '')
    // $('#chessboard .square-55d63').css('opacity', '1')
    $('#chessboard .square-55d63').css('border', 'none')

  }

function greenSquares (square) {
    var $square = $('#chessboard .square-' + square)
  
    var background = greenSquareColor
  
    // $square.css('background', background)
    // $square.css('opacity', 0.6)
    $square.css('border', "4px solid red")
  }

function onDrop (source, target) {
  // see if the move is legal
  var move = game.move({
    from: source,
    to: target,
    promotion: 'q' // NOTE: always promote to a queen for example simplicity
  })

  // illegal move
  if (move === null) return 'snapback'

  updateStatus()
}

function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
      square: square,
      verbose: true
    })
  
    // exit if there are no moves available for this square
    if (moves.length === 0) return
  
    // highlight the square they moused over
    greenSquares(square)
  
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
      greenSquares(moves[i].to)
    }
  }
  
  function onMouseoutSquare (square, piece) {
    removeGreenSquares()
  }

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
  board.position(game.fen())
}

function updateStatus () {
  var status = ''

  var moveColor = 'Blanc'
  if (game.turn() === 'b') {
    moveColor = 'Noir'
  }

  // checkmate?
  if (game.in_checkmate()) {
    status = 'Partie terminée, ' + moveColor + ' est en échec et mat.'
  }

  // draw?
  else if (game.in_draw()) {
    status = 'Partie terminée - Egalité !'
  }

  // game still on
  else {
    status = "Tour du joueur " +moveColor

    // check?
    if (game.in_check()) {
      status += ' - Le joueur ' + moveColor + ' est en échec !'
    }
  }

  $status.html(status)
  $fen.html(game.fen())
  $pgn.html(game.pgn())
}

var config = {
  draggable: true,
  position: "start",
  onDragStart: onDragStart,
  onDrop: onDrop,
  onMouseoutSquare: onMouseoutSquare,
  onMouseoverSquare: onMouseoverSquare,
  onSnapEnd: onSnapEnd
}
board = Chessboard('chessboard', config)

// $('#startNewGame').on('click', board.start)


updateStatus()