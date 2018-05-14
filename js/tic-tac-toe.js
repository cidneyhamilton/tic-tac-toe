(function($) {
    'use strict';

    // Game object to keep track of Tic-Tac-Toe state
    var Game = {
        // Initialize object and define the HTML entities for the game
        init: function() {
            Game.config = {
                buttons: $("#board button"),
                gameInfo: $("#game-info"),
                restart: $("#restart")
            };
            Game.setup();
        },
        // Bind click handlers
        setup: function() {
            Game.config.buttons.click(Game.clickSquare);
            Game.config.restart.click(Game.restart);
        },
        // Keep track of the 3x3 grid
        squares: [null, null, null, null, null, null, null, null, null],
        // Keep track of whose turn it is
        xIsNext: true,
        // Keep track of all possible winning combinations
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
        // Get the name of the active player (X or O)
        getPlayerName: function() {
            if (this.xIsNext) {
                return "X";
            } else {
                return "O";
            }
        },
        // Get the name of the winning player
        getWinnerName: function() {
            if (Game.getIsWin(Game.squares)) {
                return Game.getPlayerName();
            }
            return null;
        },
        // Taking a hypothetical grid, return true if a player is winning, false otherwise
        getIsWin: function(grid) {
            for (let i = 0; i < Game.wins.length; i++) {
                let win = Game.wins[i];
                var [a, b, c] = win;
                if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
                    return true;
                }
            }
            return false;
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
            Game.enableUI();
            Game.config.buttons.text("");
            Game.config.gameInfo.text("");
        },
        // Simulate the active player clicks the square at the given index
        moveToIndex: function(index) {
            Game.squares[index] = Game.getPlayerName();
        },
        // Randomly pick a valid square for the AI player to move into
        // Randomization means that the AI will ignore winning combinations; but will not always draw
        getNextMove: function() {
            var moves = [];
            for (let i = 0; i < Game.squares.length; i++) {
                if (Game.squares[i] === null) {
                    moves.push(i);
                }
            }

            if (moves.length === 0) {
                return -1;
            }

            // If it's possible to win the game in one move, do so
            var winningMove = Game.getWinningMove(moves, "O");
            if (winningMove) {
                return winningMove;
            }

            // Otherwise, if the human player is close to winning, prevent them from winning
            var blockingMove = Game.getWinningMove(moves, "X")
            if (blockingMove) {
                console.log("Blocking move found");
                return blockingMove;
            }

            // Otherwise, randomly pick a square to move to
            var randomIndex = Math.floor(Math.random() * moves.length);
            return moves[randomIndex];
        },
        // If it's possible for playerName to win the game in one move, return that move
        getWinningMove: function(moves, playerName) {
            console.log("Getting winning move for " + playerName);
            for (let i = 0; i < moves.length; i++) {
                var squareToMove = moves[i];
                console.log("Checking to see if square " + squareToMove + " will win the game");
                var nextMoveGrid = Game.squares.slice();
                nextMoveGrid[squareToMove] = playerName;
                if (Game.getIsWin(nextMoveGrid)) {
                    console.log("Player can win in 1 move.")
                    return squareToMove;
                }
            }
            return null
        },
        // Updates the UI if the game if is over.
        // Returns true if the game is over; false otherwise
        handleGameOver: function() {
            // check for a winner
            if (Game.getWinnerName()) {
                // Update the UI; player won the game!
                Game.disableUI();
                Game.config.gameInfo.text("Player " + Game.getWinnerName() + " won!");
                return true;
            }
            else if (Game.getIsDraw()) {
                // Update the UI; it's a draw!
                Game.disableUI();
                Game.config.gameInfo.text("It's a draw!");
                return true;
            } else {
                // game not over
                return false;
            }
        },
        // Disable all buttons in the grid
        disableUI: function() {
            Game.config.buttons.prop("disabled", true);
        },
        // Enable all buttons in the grid=
        enableUI: function() {
            Game.config.buttons.prop("disabled", false);
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
            if (Game.handleGameOver()) {
                // The human player won, or all 9 squares have been filled
                return;
            }

            // change to AI player
            Game.xIsNext = false;
            Game.disableUI();
            // Add a slight delay
            setTimeout(function() {
                // Wait a few seconds, then the AI player takes a turn
                var aiMove = Game.getNextMove();
                if (aiMove !== -1) {
                    // Updates the grid
                    $(Game.config.buttons.get(aiMove)).text(Game.getPlayerName());
                    // Updates the game state
                    Game.moveToIndex(aiMove);
                    // Check for game over
                    if (Game.handleGameOver() == false) {
                        // If game is still in progress, human player gets another move
                        Game.enableUI();
                        // change to human player
                        Game.xIsNext = true;
                    }
                }
            }, 500);
        }
    };

    $(document).ready(Game.init);

})(jQuery);