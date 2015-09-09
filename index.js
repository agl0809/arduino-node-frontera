var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    var pairBarriers,
        pairBarriers = five.PairBarriers( 2, 3 );

    var mode = 'FREE';
    var currentCombination = {
        external: false,
        internal: false
    };
    var freeCombination = {
        external: false,
        internal: false
    };

    console.log(mode);

    pairBarriers.on('changedCombination', function(combination){
        currentCombination = combination;

        if( mode === 'FREE') {
            if (JSON.stringify(currentCombination) != JSON.stringify(freeCombination)) {
                mode = 'BUSY';
                console.log(mode);
            }
        }else{
            console.log('I\'m busy...');
        }

    });
});


