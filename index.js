var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    var pairBarriers = five.PairBarriers;
    pairBarriers.init( 2, 3, five );
});


