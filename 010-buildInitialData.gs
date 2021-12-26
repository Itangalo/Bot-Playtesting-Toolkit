/**
 * This example simulates a silly game with the following rules:
 * 
 * Players take one standard deck each and flip the top card in each round.
 *  - The player with the lowest card lose hit points equal to the value
 *    difference between the cards.
 *  - A 'two' gives two health points.
 *  - Jack, queen and king gives a gold.
 *  - Two golds can be used to either buy 1 hit point or cause 1 hit point
 *    extra damage in next time damage is dealt.
 * First to get 0 hit points loses.
 */

/**
 * Builds the data needed to start a game.
 * 
 * Should populate the global variable and also return an object describing initial game state.
 */

// Add an entry for the module.
modules.example = {};

modules.example.buildInitialData = function() {
  /**
   * Build global non-changing data that should be accessible from anywhere.
   *
   * This could be data about game board, fixed values used by other functions,
   * or something else that does not change in or between games.
   */

  // These properties are used by the board game scripting tools.
  // They may be changed, but not removed.
  global.defaults.iterations = 1;
  global.percentilesForStatistics = [0, .05, .15, .50, .85, .95, 1];

  /**
   * Build object describing initial game state.
   * 
   * Any decks put in the initialGameState.decks array will be created on game start.
   * Each entry should be on the form {deck:objectWithData, cards:arrayWithCardData}.
   * The deck must have an id set. See Deck class for more details.
   *
   * Any agents put in the initialGameState.agents array will be created on game start.
   * Each entry should be an object with data. The agent must have an id set.
   * See Agent class for more details. Note that agents in the processed game state
   * object will be stored in an _array_, to allow ordering them.
   *
   * Any tracks put in the initialGameState.tracks array will be created on game start.
   * Each entry should be on the form {track:objectWithData, spaces:arrayWithSpaceData}.
   * The track must have an id set. See Track class for more details.
   */
  let initialGameState = {};

  // Build data for agents (players).
  initialGameState.agents = buildObjectArrayFromColumns('exampleData', 'E2:G5');

  // Create a deck for each player. Use player id as deck id.
  let cardData = buildObjectArrayFromRows('exampleData', 'A2:C54');
  initialGameState.decks = [];
  debugger
  for (let a in initialGameState.agents) {
    initialGameState.decks.push(
      {deck: {id:a.id},
      cards: cardData},
    );
  }

  // Create a market where the stuff can be bought.
  let marketData = buildObjectFromLine('exampleData', 'I3:I4');
  let goodsData = buildObjectArrayFromRows('exampleData', 'K2:M4');
  initialGameState.markets = [];
  initialGameState.markets.push(
    {market: marketData, goods: goodsData}
  );

  return initialGameState;
}
