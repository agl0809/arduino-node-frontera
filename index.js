var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    var mode = 'FREE',
        countdown = 3000,
        isCountdownStarted = false,
        isLocked = false,
        sequenceCombinations = [].
        currentCombination = {
            external: false,
            internal: false
        },
        freeCombination = {
            external: false,
            internal: false
        };

    var initialize = function() {
        var pairBarriers = five.PairBarriers( 2, 3 );
        pairBarriers.on('changedCombination', function(combination){
            start(combination);
        });
    };

    var start = function (combination) {
        currentCombination = combination;

        if( mode === 'FREE') {
            runFreeMode();
        }else{
            runBusyMode();
        }
    };

    var runFreeMode = function () {
        if ( !isFreeCombination() ) {
            mode = 'BUSY';
            console.log(mode);
            runBusyMode();
        }
    };

    var runBusyMode = function () {
        if ( isAlreadyUnblocked() ){
            isLocked = false;
            mode = 'FREE';
        }else if ( isNewCountdown() ) {
            initCountdown();
            runCountdown();
            console.log('entro init');
        }else{
            console.log('entro run');
            runCountdown();
        }

    };

    var isFreeCombination = function () {
        return JSON.stringify(currentCombination) === JSON.stringify(freeCombination);
    };

    var isAlreadyUnblocked = function () {
        return isFreeCombination() &&
            isLocked === true &&
            isCountdownStarted === false;
    };

    var isNewCountdown = function () {
        return isCountdownStarted != true &&
            isLocked != true;
    };

    var initCountdown = function () {
        sequenceCombinations = [];

        setTimeout(function () {
            isCountdownStarted = false;

            if ( !isFreeCombination() ) {
                isLocked = true;
                console.log('locked');
            } else {
                isLocked = false;
                mode = 'FREE';
                console.log(mode);
            }

        }, countdown);

        isCountdownStarted = true;
    };

    var runCountdown = function () {
        sequenceCombinations.push(JSON.stringify(currentCombination));
        console.log(sequenceCombinations);
    };

    initialize();
});


