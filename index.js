var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    var pairBarriers,
        latestCombination,
        pairBarriers = five.PairBarriers( 2, 3 );

        pairBarriers.on('changedCombination', function(combination){
            latestCombination = combination;
            console.log(latestCombination);
        });
});


