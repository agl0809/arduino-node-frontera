var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    var mode = 'FREE',
        countdownInterval = 3000,
        isCountdownStarted = false,
        isLocked = false,
        sequenceCombinations = [],
        sequenceEnter = [
            '{"external":true,"internal":false}',
            '{"external":true,"internal":true}',
            '{"external":false,"internal":true}',
            '{"external":false,"internal":false}'
        ],
        sequenceLeave = [
            '{"external":false,"internal":true}',
            '{"external":true,"internal":true}',
            '{"external":true,"internal":false}',
            '{"external":false,"internal":false}'
        ],
        freeCombination = {
            external: false,
            internal: false
        },
        currentCombination = {
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
            isCountdownStarted = false;
            isLocked = false;
            mode = 'FREE';
            console.log( 'unlocked' );
            console.log( 'Forced FREE' );
        }else if ( isNewCountdown() ) {
            initCountdown();
            runCountdown();
        }else{
            runCountdown();
        }
    };

    var isFreeCombination = function () {
        return JSON.stringify(currentCombination) === JSON.stringify(freeCombination);
    };

    var isAlreadyUnblocked = function () {
        return isFreeCombination() &&
            isLocked === true;
    };

    var isNewCountdown = function () {
        return isCountdownStarted != true &&
            isLocked != true;
    };

    var initCountdown = function () {
        sequenceCombinations = [];
        setTimeout(countdownCallback, countdownInterval);
        isCountdownStarted = true;
    };

    var countdownCallback = function () {
        if(mode === 'BUSY') {
            if (!isFreeCombination()) {
                isLocked = true;
                console.log('locked');
            } else {
                isCountdownStarted = false;
                isLocked = false;
                mode = 'FREE';
                console.log('Forced FREE');
            }
        }
    };

    var runCountdown = function () {
        sequenceCombinations.push(JSON.stringify(currentCombination));
        console.log( sequenceCombinations );
        checkSequenceCombinations();
    };

    var checkSequenceCombinations = function () {
        if( hasSameLengthAsSequenceEnter() &&
            isSequenceValidCombination( sequenceEnter ) ){
                console.log('enter');
                isCountdownStarted = false;
                mode = 'FREE';
                console.log( 'Forced FREE' );
        }

        if( hasSameLengthAsSequenceLeave() &&
            isSequenceValidCombination( sequenceLeave ) ){
                console.log('leave');
                isCountdownStarted = false;
                mode = 'FREE';
                console.log( 'Forced FREE' );
        }
    };

    var hasSameLengthAsSequenceEnter = function () {
        return sequenceCombinations.length === sequenceEnter.length;
    };

    var hasSameLengthAsSequenceLeave = function () {
        return sequenceCombinations.length === sequenceLeave.length;
    };

    var isSequenceValidCombination = function ( sequenceValid ){
        return sequenceCombinations.every(function(element, index) {
            return element === sequenceValid[index]
        });
    };

    initialize();
});


