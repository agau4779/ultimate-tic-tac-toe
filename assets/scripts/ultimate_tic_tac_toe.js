$(document).ready(function(){
  var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  var turnCount=0;

  $('.board.small').find('.tile').click(function(){
    if (!$(this).hasClass('inactive')) {
      var x = $(this).index();
      var y = $(this).parent().index();

      if (turnCount % 2 === 0) {
        $(this).addClass('inactive').addClass('x-class');
        board[x][y] = 2;
      } else {
        $(this).addClass('inactive').addClass('o-class');
        board[x][y] = 1;
      }

      turnCount++;
      if (checkVictory(board)) {
        var player = turnCount % 2 === 0 ? 'X' : 'O';
        $('.tile').addClass('inactive');
        alert("Congratulations! " + player + " won!");
      }
    }
  });

  function checkVictory(board) {
    var row0 = checkLine([board[0][0], board[0][1], board[0][2]]);
    var row1 = checkLine([board[1][0], board[1][1], board[1][2]]);
    var row2 = checkLine([board[2][0], board[2][1], board[2][2]]);

    var col0 = checkLine([board[0][0], board[1][0], board[2][0]]);
    var col1 = checkLine([board[0][1], board[1][1], board[2][1]]);
    var col2 = checkLine([board[0][2], board[1][2], board[2][2]]);

    var diag1 = checkLine([board[0][0], board[1][1], board[2][2]]);
    var diag2 = checkLine([board[2][0], board[1][1], board[0][2]]);
    return (row0 || row1 || row2 || col0 || col1 || col2 || diag1 || diag2);
  };

  function checkLine(arr) {
    first = arr[0];
    if (first === 0) { return false };
    return arr.every(function(el) {
      return el !== 0 && el === first;
    });
  };

  $('#reset-btn').click(function() {
    $('.tile').removeClass('x-class o-class inactive');
    board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  });
});
