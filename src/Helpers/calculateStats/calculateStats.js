
const createCopy = data => JSON.parse(JSON.stringify(data));
const calcAve = (pin, ttlG) => Math.ceil(pin / ttlG) < 1 ? 0 : Math.ceil(pin / ttlG);
const lessOne = val => val < 0 ? 0 : val;


const addStats = ({ state, score }) => {
    const tS = createCopy(state);
    const tempTtlG = +tS.ttlFrames + 1;
    const tempPinFall = +tS.ttlPinFall + +score;

    const newState = {
        average: calcAve(tempPinFall, tempTtlG),
        ttlFrames: tempTtlG,
        ttlGames: tS.ttlGames,
        ttlPinFall: tempPinFall,
        lastUpdated: new Date()
    };
    return newState;
}

const reset = () => {
    return {
        average: 0,
        ttlFrames: 0,
        ttlGames: 0,
        ttlPinFall: 0,
        lastUpdated: null
    }
}


const addPreExistingGame = ({ state, newGame, userId }) => {
    const tS = createCopy(state);

    if (Object.keys(newGame.games).length === 0) {
        tS.ttlGames = tS.ttlGames + 1;
        return tS;
    }

    Object.keys(newGame.games).forEach(x => {
        if (newGame.games[x][userId]) {
            tS.ttlFrames = +tS.ttlFrames + 1;
            tS.ttlPinFall = +tS.ttlPinFall + +newGame.games[x][userId].score
        }
    });

    const newState = {
        average: calcAve(tS.ttlPinFall, tS.ttlFrames),
        ttlFrames: tS.ttlFrames,
        ttlGames: +tS.ttlGames + 1,
        ttlPinFall: tS.ttlPinFall,
        lastUpdated: new Date()
    };
    return newState;
}


const updateScores = ({ state, newScores }) => {
    const tS = createCopy(state);
    const tempPinFall = (tS.ttlPinFall - newScores.old) + newScores.new;

    const newState = {
        ttlGames: tS.ttlGames,
        average: lessOne(calcAve(tempPinFall, tS.ttlFrames)),
        ttlFrames: tS.ttlFrames,
        ttlPinFall: lessOne(tempPinFall),
        lastUpdated: new Date()
    };
    return newState;
}


const removeScores = ({ state, pinfall }) => {
    const tS = createCopy(state);
    const tempPinFall = tS.ttlPinFall - pinfall;
    const tempG = tS.ttlFrames - 1

    const newState = {
        ttlGames: tS.ttlGames-1,
        average: lessOne(calcAve(tempPinFall, (tS.ttlFrames - 1))),
        ttlFrames: lessOne(tempG),
        ttlPinFall: lessOne(tempPinFall),
        lastUpdated: new Date()
    };
    return newState;
}


const calculateStats = {
    addStats,
    updateScores,
    removeScores,
    reset,
    addPreExistingGame
};



module.exports = calculateStats;