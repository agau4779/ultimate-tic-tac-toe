var player_x = 'X';
var player_o = 'O';

var Tile = function Tile() {
  this.active = true;
  this.player = 0;
};

var Board = function Board() {
  this.tiles = [];
  this.turnCount = 0;
  this.active = true;
  this.player = 0;

  for(var i=0; i<3; i++) {
    var row = [];
    for(var j=0; j<3; j++) {
      row.push(new Tile());
    };
    this.tiles.push(row);
  };
};

Board.prototype = {
  current_player: function() {
    var current_player;
    if (this.turnCount % 2 === 0) {
      return player_x;
    } else {
      return player_o;
    };
  },

  play: function(x, y) {
    if (this.active) {
      var tile = this.tiles[x][y];
      if (this.tiles[x][y].active) {
        tile.active = false;
        var current_player;
        if (this.turnCount % 2 === 0) {
          current_player = player_x;
        } else {
          current_player = player_o;
        };
        tile.player = current_player;
        this.turnCount++;

        if (this.checkVictory()) {
          this.active = false;
          this.player = current_player;
          console.log("Congratulations! " + current_player + " won!");
        } else {
          if (this.checkTie()) {
            this.active = false;
            console.log("It is a tie!");
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
  }
}

$(document).ready(function(){
  var board = new Board();
  $('.board.small').find('.tile').click(function(){
    if (!$(this).hasClass('active')) {
      var x = $(this).index();
      var y = $(this).parent().index();
      $(this).addClass('active');
      if (board.play(x, y)) {
        if (board.current_player() == player_x) {
          $(this).addClass('x-class');
        } else {
          $(this).addClass('o-class');
        }
      }
    }
  });

  $('#reset-btn').click(function() {
    board = new Board();
    $('.board.small').find('.tile').removeClass('active o-class x-class');
  });
});
