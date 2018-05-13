(function($) {
    'use strict';

    // Game state
    var Game = {
        init: function() {
            Game.config = {
                buttons: $("#board button"),
                gameInfo: $("#game-info"),
                restart: $("#restart")
            };
            Game.setup();
        },
        setup: function() {
            Game.config.buttons.click(Game.clickSquare);
            Game.config.restart.click(Game.restart);
        },
        // Keep track of the grid
        squares: [null, null, null, null, null, null, null, null, null],
        // Keep track of whose turn it is
        xIsNext: true,
        wins: [
            // rows
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            // columns
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            // diagonals
            [0, 4, 8],
            [2, 4, 6]
        ],
        // Get the name of the active player
        getPlayerName: function() {
            if (this.xIsNext) {
                return "X";
            } else {
                return "O";
            }
        },
        // Get the name of the winner
        getWinnerName: function() {
            for (let i = 0; i < Game.wins.length; i++) {
                let win = Game.wins[i];
                var [a, b, c] = win;
                if (Game.squares[a] && Game.squares[a] === Game.squares[b] && Game.squares[a] === Game.squares[c]) {
                    return Game.squares[a];
                }
            }
            return null;
        },
        // Return true if it's a draw; false otherwise
        getIsDraw: function() {
            for (let i = 0; i < Game.squares.length; i++) {
                var square = Game.squares[i];
                if (!square) {
                    return false;
                }
            }
            return true;
        },
        // Restart the game
        restart: function() {
            // Update the game state
            for (let i = 0; i < Game.squares.length; i++) {
                var square = Game.squares[i] = null;
            }
            Game.xIsNext = true;

            // Update the UI
            Game.config.buttons.prop("disabled", false);
            Game.config.buttons.text("");
            Game.config.gameInfo.text("");
        },
        // Simulate the active player clicks the square at the given index
        moveToIndex: function(index) {
            Game.squares[index] = Game.getPlayerName();
            Game.xIsNext = !Game.xIsNext;
        },
        // Get the next move for the AI player
        getNextMove: function() {
            var moves = [];
            for (let i = 0; i < Game.squares.length; i++) {
                if (Game.squares[i] === null) {
                    moves.push(i);
                }
            }

            console.log("Available moves:" + moves);
            console.log("Available moves length: " + moves.length);

            if (moves.length === 0) {
                return -1;
            }

            // Randomly pick a square to move to
            var randomIndex = Math.floor(Math.random() * moves.length);
            console.log("Random index: " + randomIndex);
            return moves[randomIndex];
        },
        handleGameOver: function() {
            // check for a winner
            if (Game.getWinnerName()) {
                // Update the UI; player won the game!
                Game.config.buttons.prop("disabled", true);
                Game.config.gameInfo.text("Player " + Game.getWinnerName() + " won!");
            }

            if (Game.getIsDraw()) {
                // Update the UI; it's a draw!
                Game.config.buttons.prop("disabled", true);
                Game.config.gameInfo.text("It's a draw!");
            }
        },
        // Handle click events on a square in the grid
        clickSquare: function() {
            let square = $(this);
            if (square.text()) {
                // Can't write in a filled square!
                return;
            }
            if (Game.getWinnerName()) {
                // If there's already a winner, do nothing!
                return;
            }
            let i = Game.config.buttons.index(square);
            square.text(Game.getPlayerName());
            Game.moveToIndex(i);
            Game.handleGameOver();

            setTimeout(
              function()
              {
                // AI Player Moves Next
                var aiMove = Game.getNextMove();
                if (aiMove !== -1) {
                    console.log("Next Move: " + aiMove);
                    $(Game.config.buttons.get(aiMove)).text(Game.getPlayerName());
                    Game.moveToIndex(aiMove);
                    Game.handleGameOver();
                }
              }, 5);



        }
    };

    $(document).ready(Game.init);

})(jQuery);