/**
 * Builds the data needed to start a game.
 * 
 * Should populate the BPTstatic variable and also return an object describing initial game state.
 */

// Add an entry for the module.
modules.myModule = {};

modules.myModule.buildInitialData = function() {
  /**
   * Build global non-changing data that should be accessible from anywhere.
   *
   * This could be data about game board, fixed values used by other functions,
   * or something else that does not change in or between games.
   */

  // Tell BPT which log messages to show or hide.
  BPTstatic.logging.categories.rounds = false;
  BPTstatic.logging.categories.myCategory = true;

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
  gameStateSeed.agents = buildObjectArrayFromColumns('myModule', 'E2:G6');

  // Create a deck for each player. Use player id as deck id.
  let cardData = buildObjectArrayFromRows('myModule', 'A2:C54');
  gameStateSeed.decks = [];
  for (let a of gameStateSeed.agents) {
    gameStateSeed.decks.push(
      {deck: {id:a.id},
      cards: cardData},
    );
  }

  // Create a market where the stuff can be bought.
  let marketData = buildObjectFromLine('myModule', 'I3:I4');
  let goodsData = buildObjectArrayFromRows('myModule', 'K2:M4');
  gameStateSeed.markets = [];
  gameStateSeed.markets.push(
    {market: marketData, goods: goodsData}
  );

  return gameStateSeed;
}
