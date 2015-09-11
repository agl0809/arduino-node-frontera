var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function () {
    var mode = 'FREE',
        countdown,
        countdownInterval = 6000,
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
        },
        summary = {
            enter: 0,
            leave: 0,
            back: 0,
            error: 0,
            inside: function() {
                return (this.enter - this.leave)
            }
        };

    var initialize = function() {
        var pairBarriers = five.PairBarriers( 2, 3 );
        pairBarriers.on('changedCombination', function(combination){
            start(combination);
        });
        renderSummaryInside();
        renderSummary();
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
            runBusyMode();
        }
    };

    var runBusyMode = function () {
        if ( isReadyToUnlock() ){
            isLocked = false;
            runCountdown();
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

    var isReadyToUnlock = function () {
        return isFreeCombination() &&
            isLocked === true;
    };

    var isNewCountdown = function () {
        return  countdown === undefined ||
                (countdown.ontimeout === null && isLocked != true);
    };

    var initCountdown = function () {
        sequenceCombinations = [];
        countdown = setTimeout(countdownCallback, countdownInterval);
    };

    var countdownCallback = function () {
        if( mode === 'BUSY' && !isFreeCombination() ) {
            isLocked = true;
        }
    };

    var runCountdown = function () {
        sequenceCombinations.push(JSON.stringify(currentCombination));
        matchSequence();
    };

    var destroyCountdown = function () {
        clearTimeout(countdown);
    };

    var closeCountdown = function () {
        destroyCountdown();
        isLocked = false;
        mode = 'FREE';
        renderSummaryInside();
        renderSummary();
    };

    var hasSameLengthAsEnter = function () {
        return sequenceCombinations.length === sequenceEnter.length;
    };

    var hasSameLengthAsLeave = function () {
        return sequenceCombinations.length === sequenceLeave.length;
    };

    var matchSequence = function () {
        if( hasSameLengthAsEnter() &&
            isValidSequence( sequenceEnter ) ){
            enterProcess();
            closeCountdown();
        }

        if( hasSameLengthAsLeave() &&
            isValidSequence( sequenceLeave ) ){
            leaveProcess();
            closeCountdown();
        }

        if( sequenceCombinations.length > sequenceEnter.length  &&
            sequenceCombinations[0] === sequenceEnter[0] &&
            sequenceCombinations[sequenceCombinations.length-2] === sequenceEnter[sequenceEnter.length-2] &&
            isFreeCombination() ){
            enterProcess();
            closeCountdown();
        }

        if( sequenceCombinations.length > sequenceLeave.length  &&
            sequenceCombinations[0] === sequenceLeave[0] &&
            sequenceCombinations[sequenceCombinations.length-2] === sequenceLeave[sequenceLeave.length-2] &&
            isFreeCombination() ){
            leaveProcess();
            closeCountdown();
        }

        if( sequenceCombinations.length > sequenceEnter.length  &&
            sequenceCombinations[0] === sequenceEnter[0] &&
            sequenceCombinations[sequenceCombinations.length-2] != sequenceEnter[sequenceEnter.length-2] &&
            isFreeCombination()){
            backProcess();
            closeCountdown();
        }

        if( sequenceCombinations.length > sequenceLeave.length  &&
            sequenceCombinations[0] === sequenceLeave[0] &&
            sequenceCombinations[sequenceCombinations.length-2] != sequenceLeave[sequenceLeave.length-2] &&
            isFreeCombination()){
            backProcess();
            closeCountdown();
        }

        if( sequenceCombinations.length < sequenceLeave.length  &&
            isFreeCombination() ){
            backProcess();
            closeCountdown();
        }
    };

    var isValidSequence = function ( sequenceValid ) {
        return sequenceCombinations.every(function(element, index) {
            return element === sequenceValid[index]
        });
    };

    var enterProcess = function () {
        summary.enter += 1;
    };

    var leaveProcess = function () {
        if( ( summary.enter - summary.leave ) > 0 ) {
            summary.leave += 1;
        }else{
            errorProcess();
        }
    };

    var backProcess = function () {
        summary.back += 1;
    };

    var errorProcess = function () {
        summary.error += 1;
    };

    var renderSummary = function () {
        console.log('Summary ', JSON.stringify(summary));
    };

    var renderSummaryInside = function () {
        console.log('Inside ', summary.inside());
    };

    initialize();
});


