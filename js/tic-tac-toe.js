(function($) {

    var Game = { 
        // Keep track of the player
        squares: new Array(9),
        xIsNext: true,
        getPlayerName: function() {
            if (this.xIsNext) {
                return "X";
            } else {
                return "O";
            }
        },
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
        getIsDraw: function() {
            for (let i = 0; i < Game.squares.length; i++) {
                var square = Game.squares[i];
                if (!square) {
                    return false;
                }
            }
            return true;
        },
        restart: function() {
            for (let i = 0; i < Game.squares.length; i++) {
                var square = Game.squares[i] = null;
            }
            Game.xIsNext = true;
        }
    };

    $(document).ready(function() {

        var $buttons = $("#board button");
        $buttons.on('click', function() {
            let $this = $(this);
            if ($this.text()) {
                // Can't write in a filled square!
                return;
            }
            if (Game.getWinnerName()) {
                // If there's a winner, do nothing!
                return;
            }
            let i = $buttons.index($this);
            let value = Game.getPlayerName();
            $this.text(value);
            Game.squares[i] = value;
            Game.xIsNext = !Game.xIsNext;   

            // check for a winner
            if (Game.getWinnerName()) {
                // TODO: Won game effect
                $buttons.prop("disabled", true);
                $("#game-info").text("Player " + Game.getWinnerName() + " won!");
            } 

            if (Game.getIsDraw()) {
                $buttons.prop("disabled", true);
                $("#game-info").text("It's a draw!");
            }

        });

        $("#restart").on('click', function() {
            Game.restart();
            $buttons.prop("disabled", false);
            $buttons.text("");
            $("#game-info").text("");
        })

    });
    

})(jQuery);