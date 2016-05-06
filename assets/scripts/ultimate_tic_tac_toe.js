var player_x = 'x';
var player_o = 'o';

var Tile = function Tile() {
  this.active = true;
  this.player = 0;
};

var Board = function Board() {
  this.tiles = [];
  this.active = true;

  for(var i=0; i<3; i++) {
    var row = [];
    for(var j=0; j<3; j++) {
      row.push(new Tile());
    };
    this.tiles.push(row);
  };
};

Board.prototype = {
  play: function(x, y, current_player) {
    if (this.active) {
      var tile = this.tiles[x][y];
      if (this.tiles[x][y].active) {
        tile.active = false;
        tile.player = current_player;

        if (this.checkVictory()) {
          this.active = false;
          this.player = current_player;
        } else {
          if (this.checkTie()) {
            this.active = false;
          }
        }
      }
      return true;
    }
    return false;
  },

  checkVictory: function() {
    var row0 = this.checkLine([this.tiles[0][0], this.tiles[0][1], this.tiles[0][2]]);
    var row1 = this.checkLine([this.tiles[1][0], this.tiles[1][1], this.tiles[1][2]]);
    var row2 = this.checkLine([this.tiles[2][0], this.tiles[2][1], this.tiles[2][2]]);

    var col0 = this.checkLine([this.tiles[0][0], this.tiles[1][0], this.tiles[2][0]]);
    var col1 = this.checkLine([this.tiles[0][1], this.tiles[1][1], this.tiles[2][1]]);
    var col2 = this.checkLine([this.tiles[0][2], this.tiles[1][2], this.tiles[2][2]]);

    var diag1 = this.checkLine([this.tiles[0][0], this.tiles[1][1], this.tiles[2][2]]);
    var diag2 = this.checkLine([this.tiles[2][0], this.tiles[1][1], this.tiles[0][2]]);
    return (row0 || row1 || row2 || col0 || col1 || col2 || diag1 || diag2);
  },

  checkLine: function(arr) {
    var first = arr[0];
    if (first.active) { return false };
    return arr.every(function(el) {
      return el.player !== 0 && el.player === first.player;
    });
  },

  checkTie: function() {
    return this.tiles.every(function(el) {
      return !el[0].active && !el[1].active && !el[2].active;
    });
  },

  printBoard: function() {
    for(i=0;i<this.tiles.length;i++) {
      var row = this.tiles[i];
      var str = "";
      for(j=0;j<row.length;j++) {
        if (row[j].active) {
          str += ' ';
        } else {
          str += row[j].player;
        }
      }
      console.log(str);
    }
  }
}

var UltimateBoard = function UltimateBoard() {
  this.boards = []
  this.turnCount = 0;
  this.active = true;
  this.last_x = -1;
  this.last_y = -1;

  for(var i=0; i<3; i++) {
    var row = [];
    for(var j=0; j<3; j++) {
      row.push(new Board());
    };
    this.boards.push(row);
  };
};

UltimateBoard.prototype = {
  checkVictory: function() {
    var row0 = this.checkLine([this.boards[0][0], this.boards[0][1], this.boards[0][2]]);
    var row1 = this.checkLine([this.boards[1][0], this.boards[1][1], this.boards[1][2]]);
    var row2 = this.checkLine([this.boards[2][0], this.boards[2][1], this.boards[2][2]]);

    var col0 = this.checkLine([this.boards[0][0], this.boards[1][0], this.boards[2][0]]);
    var col1 = this.checkLine([this.boards[0][1], this.boards[1][1], this.boards[2][1]]);
    var col2 = this.checkLine([this.boards[0][2], this.boards[1][2], this.boards[2][2]]);

    var diag1 = this.checkLine([this.boards[0][0], this.boards[1][1], this.boards[2][2]]);
    var diag2 = this.checkLine([this.boards[2][0], this.boards[1][1], this.boards[0][2]]);
    return (row0 || row1 || row2 || col0 || col1 || col2 || diag1 || diag2);
  },

  checkLine: function(arr) {
    var first = arr[0];
    if (first.active) { return false };
    return arr.every(function(el) {
      return el.player !== 0 && el.player === first.player;
    });
  },

  checkTie: function() {
    return this.boards.every(function(el) {
      return !el[0].active && !el[1].active && !el[2].active;
    });
  },

  current_player: function() {
    if (this.turnCount % 2 === 0) {
      return player_x;
    } else {
      return player_o;
    };
  },

  play: function(x, y, xx, yy) {
    // The board the previous player redirected to has been conquered. Now the current player can place anywhere.
    if (!this.boards[this.last_x][this.last_y].active) {
      this.last_x = -1;
      this.last_y = -1;
    };

    if (this.last_x == -1 || this.last_x == x && this.last_y == y) {
      if (this.boards[x][y].play(xx, yy, this.current_player())) {
        this.last_x = xx;
        this.last_y = yy;
        this.turnCount += 1;
        if (this.boards[x][y].checkVictory()) {
          this.boards[x][y].active = false;
          console.log("Board at " + x + ', ' + y + ' has been won!');
        } else if (this.boards[x][y].checkTie()) {
          this.boards[x][y].active = false;
          console.log("Board at " + x + ', ' + y + ' has been tied.');
        }
        return true;
      } else {
        console.log('That space has been taken!');
        return false;
      }
    } else {
      console.log('You must play within the big square corresponding to the little square.');
      return false;
    }
  }
};

$(document).ready(function(){
  window.ultimate_board = new UltimateBoard();

  $('.master_board').find('.tile').click(function(){
    var board_x = $(this).parent().parent().parent().index();
    var board_y = $(this).parent().parent().index();

    var x = $(this).parent().index();
    var y = $(this).index();

    if (ultimate_board.play(board_x, board_y, x, y)) {
      $(this).addClass(ultimate_board.current_player() + '-class');

      if (ultimate_board.boards[board_x][board_y].checkVictory()) {
        $(this).parent().parent().addClass(ultimate_board.current_player() + '-class');
      }
    }
  });

  $('#reset-btn').click(function() {
    window.ultimate_board = new UltimateBoard();
    $('.board.small').removeClass('active o-class x-class');
    $('.board.small').find('.tile').removeClass('active o-class x-class');
  });
});
