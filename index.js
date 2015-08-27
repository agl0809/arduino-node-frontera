var five = require("johnny-five");
var board = new five.Board();


// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function () {
    five.PairBarriers(2,3);
});


