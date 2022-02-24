/**
 * Builds the data needed to start a game.
 * 
 * Module entry is required. The function buildInitialData is optional. If used, it should 
 * populate the BPTstatic variable and also return an object describing initial game state.
 */

// Add an entry for the module.
modules.myModule = {};

modules.myModule.buildInitialData = function(arg1, arg2) {
  /**
   * Build global non-changing data that should be accessible from anywhere.
   *
   * This could be data about game board, fixed values used by other functions,
   * or something else that does not change in or between games.
   */

  // Override any default settings. See the defaults file for more examples.

  // Tell BPT which log messages to show or hide.
  // BPTstatic.defaults.logging.categories.rounds = false;
  // BPTstatic.defaults.logging.categories.myCategory = true;

  // Set standard dice rolls.
  // BPTstatic.defaults.diceRoll.numberOfSides = 10;
  // BPTstatic.defaults.diceRoll.quantity = 2;

  // Tell which percentiles to display in the processed result of game runs.
  // BPTstatic.defaults.statistics.percentiles = [0, .05, .2, .50, .8, .95, 1];

  // Any other data that will not be changed during simulations, but you might want to
  // tweak to explore how the game responds.
  // BPTstatic.cardsToDrawOnStart = 4;
  // BPTstatic.startingGold = 3;
  // BPTstatic.numberOfVpToWin = arg1 || 10; // <-- Note that extra arguments are passed to the module functions.

  /**
   * Build object describing initial game state.
   * 
   * Any agents put in the gameStateSeed.agents array will be created on game start.
   * Each entry should be an object with data. The agent must have an id set.
   * See Agent class for more details. Note that agents in the processed game state
   * object will be stored in an _array_, to allow ordering them.
   * 
   * Any decks put in the gameStateSeed.decks array will be created on game start.
   * Each entry should be on the form {deck:objectWithData, cards:arrayWithCardData}.
   * The deck must have an id set. See Deck class for more details.
   *
   * Any tracks put in the gameStateSeed.tracks array will be created on game start.
   * Each entry should be on the form {track:objectWithData, spaces:arrayWithSpaceData}.
   * The track must have an id set. See Track class for more details.
   * 
   * Any markets put in the gameStateSeed.markets array will be created on game start.
   * Each entry should be on the form {market:objectWithData, goods:arrayWithGoodsData}.
   * Market and goods must have IDs set. See Market class for more details.
   */
  let gameStateSeed = {};

  // Build data for agents (players).
  // One agent per column: gameStateSeed.agents = buildObjectArrayFromColumns('myModule', 'E2:G6');
  // One agent per row: gameStateSeed.agents = buildObjectArrayFromRows('myModule', 'E2:G6');

  gameStateSeed.decks = [];
  // Create an arbitrary deck. See documentation for decks for settings for decks, for example to
  // prevent the deck being shuffled when the game starts, or automatically fill a display.
  // gameStateSeed.decks.push({
  //   deck: {id: 'myDeckId'},
  //   cards: buildObjectArrayFromRows('myModule', 'A2:C54');
  // });

  // Create a deck for each player. When deck id is an agent id, the deck will also be accessible
  // at myAgent.deck.
  // let cardData = buildObjectArrayFromRows('myModule', 'A2:C54');
  // for (let a of gameStateSeed.agents) {
  //   gameStateSeed.decks.push({
  //     deck: {id: a.id},
  //     cards: cardData,
  //   });
  // }

  gameStateSeed.tracks = [];
  // Create a simple linear track. See documentation for tracks for settings for tracks, for example
  // to set pawns to loop around the track, set which space is the starting space, or that pawns should
  // be created when moved if they don't already exist.
  // If pawn id match an agent id, the pawn will allso be accessible at myAgent[trackId].pawn.
  // gameStateSeed.tracks.push({
  //   track: {id: 'myTrackId'},
  //   spaces: buildObjectArrayFromRows('myModule', 'L2:L64'),
  //   pawns: buildObjectArrayFromRows('myModule', 'E2:E5'),
  // });

  // Create a board where spaces are connected in a more complex way.
  // gameStateSeed.tracks.push({
  //   track: {
  //     id: 'myGridTrackId',
  //     gridMovement: true,
  //.    symmetricConnections: true,
  //.    cacheGraph: true,
  //   },
  //   spaces: buildObjectArrayFromRows('myModule', 'L2:N64'),
  //   pawns: buildObjectArrayFromRows('myModule', 'E2:E5'),
  // });

  // Create a market where the stuff can be bought.
  // gameStateSeed.markets = [];
  // let marketData = buildObjectFromLine('myModule', 'I3:I4');
  // let goodsData = buildObjectArrayFromRows('myModule', 'K2:M4');
  // gameStateSeed.markets.push(
  //   {market: marketData, goods: goodsData}
  // );

  return gameStateSeed;
}
