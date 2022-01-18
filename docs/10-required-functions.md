# Functions a module must include

Modules, containing any specific code to run for a game, are added to the object `modules`, for example `modules.myModule = {}`.

The Bot Playtesting Toolkit expects some functions in a module. These functions should be added to the individual module objects, for example `modules.myModule.buildInitialData = function() {...}`.

## buildInitialData()

This function is responsible for two things.

**The first is populating the `global` object with appropriate data.** This is a good place to put values that are used in different parts of the code, such as the number of victory points that ends the game, default values for various things, or other data you might want to store in globally accessible variables. Note that all the data stored here should be non-changing, and _not_ change between games or within games.

The `global` object contains some settings that are used by the BPT framework itself:

* `global.defaults.iterations` tells how many iterations of to run of a game if no specific number is set. An example value is `100`.
* `global.logging` contains a list of which categories of log messages to display, and also a setting for turning on/off the display of timestamps in the log messages. See documentation for the `log` function for more information.
* `global.percentilesForStatistics` contains an array of the percentile limits to include in the statistics for the game. An example value is `[0, .05, .15, .50, .85, .95, 1]`.

**The second thing the function should do is to return a seed for the initial game state.** The actual game state is built before each iteration of a game, based on a copy of the seed. The game state seed should contain any information that is necessary to know the game state, and could in principle be structured in any way you see fit. If data is entered in some special ways, though, BPT will automatically process the data before each iteration and build objects that could save a lot of work.

* An array of objects in `gameStateSeed.agents` will be processed and turned into [Agent objects](Using-the-Agent-class). Agents are the players in the game.
* An array of object pairs in `gameStateSeed.decks` will be processed and turned into [Deck objects containing Card objects](Using-the-Deck-and-Card-classes). The objects in the array should be on the form `{deck: deckData, cards: cardData}`.
* An array of object pairs in `gameStateSeed.tracks` will be processed and turned into [Track objects containing Space objects](Using-the-Track-and-Space-classes). The objects in the array should be on the form `{track: trackData, spaces: spacesData}`. Tracks can be used for simple linear tracks, but also for movement in complex grids and networks.
* An array of object pairs in `gameStateSeed.markets` will be processed and turned into [Market objects containing Goods objects](Using-the-Market-and-Goods-classes). The objects in the array should be on the form `{market: marketData, goods: goodsData}`.

Building the data for these types of objects is usually done by reading data from the spreadsheet. There are functions available making this easy, described elsewhere.

Note that `buildInitialData()` must return the game state seed, and should thus end with `return gameStateSeed`.

## preIteration()

The game state seed is processed by BPT before each game iteration, and the globally accessible `gameState` variable is set up. There are a number of things that can be taken care of automatically, such as shuffling decks, filling card displays or placing pawns on tracks, but there may by other more customized preparations that needs to be taken care of as well. Any such preparations are done by `preIteration()`.

This function could for example give each agent a random quest card, randomize player order, or place cubes on the board according to the top three cards in a deck. The function may manipulate `gameState` in any way necessary. It does not take any arguments and is not expected to return anything.

## playRound()

This function contains much of the actual game. For complex games, this function will probably either be quite long or split up into sub functions. Much of the complex work is also delegated to the agent strategies.

The function is called by BPT once every round, but for some games it might be easier to instead consider each round as a turn. The number of the round is stored in `gameState.round` by BPT.

This function may use or manipulate `gameState` in any way necessary. It does not take any arguments and is not expected to return anything.

## gameOver()

This function is called before each round. It reads the `gameState` and returns either `true` or `false`. If it returns `true`, the current game iteration ends.

## buildStatistics()

This function is called after the end of each game iteration. It should collect or build any data from the `gameState` that should be included in the statistics for all the played games. The data should be returned in an object, with column header as property name.

Some things to note:

* Only numeric values are currently accepted by BPT. Entries cannot be {winner: 'PlayerA'}, but should rather be `{playerAWins: 1, playerBWins: 0, ...}`.
* Each game iteration should return the same properties for statistics. If one iteration returns {playerAWins: 1}, there must also be an entry for 'playerAWins' in all other iterations.

An example of how data can be processed and stored:

    let stats = {};

    stats.gameLength = gameState.round;
    stats.redWins = 0;
    stats.blueWins = 0;
    if (getAgentById('red').hitPoints > 0)
      stats.redWins = 1;
    else
      stats.blueWins = 1;

    stats.winnerHitPoints = getMax(gameState.agents, 'hitPoints');

    return stats;

Note in particular that the `stats` must be returned. Helper functions, such as `getMax()` used above, are described elsewhere.
