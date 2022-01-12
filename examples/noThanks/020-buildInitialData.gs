/**
 * This example simulates the No Thanks! game.
 * See also https://boardgamegeek.com/boardgame/12942/no-thanks
 * 
 * Rules, briefly: There's a deck with cards 3–35, where nine cards are removed
 * before each game. A card is worth its value in _negative_ points. Each player has
 * 11 markers, worth one point each. The top card is displayed, and players take turns
 * to either place one marker on the card or take the card with all the markers on it.
 * The player who takes the card reveals the next, and then either takes it or places
 * a marker on it.
 * 
 * When there are no more cards, players get negative points for cards and positive points
 * for markers. But when cards form straights, only the lowest number in the straight
 * counts. Most points wins.
 */

/**
 * Builds the data needed to start a game.
 * 
 * Should populate the global variable and also return an object describing initial game state.
 */

// Add an entry for the module.
modules.noThanks = {};

modules.noThanks.buildInitialData = function() {
  /**
   * Build global non-changing data that should be accessible from anywhere.
   *
   * This could be data about game board, fixed values used by other functions,
   * or something else that does not change in or between games.
   */

  // These properties are used by the board game scripting tools.
  // They may be changed, but not removed.
  global.defaults.iterations = 100;
  global.logging = {
    // Only message types set to true will be printed in the log.
    // Feel free to add more categories.
    categories: {
      rounds: true,
      notice: true,
      example: true,
      statistics: true,
      tests: true,
      system: true,
      errors: true,
    },
    // If true, log messages will also show how long time has passed since the script started.
    showTimestamps: true,
  };
  global.percentilesForStatistics = [0, .05, .15, .50, .85, .95, 1];

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
  gameStateSeed.agents = buildObjectArrayFromRows('noThanks', 'A2:C6');

  // Each player gets an empty deck, where taken cards are put.
  // There is also a shared deck, where the cards start.
  let deckData = buildObjectArrayFromRows('noThanks', 'E2:G7');
  let cardData = buildObjectArrayFromRows('noThanks', 'I2:I35');
  gameStateSeed.decks = [];
  for (let d of deckData) {
    gameStateSeed.decks.push(
      {deck: d},
    );
  }
  // Add the cards to the shared deck.
  gameStateSeed.decks[0].cards = cardData;

  return gameStateSeed;
}
