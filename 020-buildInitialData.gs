/**
 * Builds the data needed to start a game.
 * 
 * Should populate the global and return an object describing initial game state.
 */
function buildInitialData() {
  /**
   * Build global data that should be accessible from anywhere.
   *
   * This could be data about game board, fixed values used by other functions,
   * or something else that does not change in or between games.
   */

  // These properties are used by the board game scripting tools.
  // They may be changed, but not removed.
  global.defaults = {};
  global.defaults.iterations = 1;
  global.defaults.diceRoll = {
    quantity: 3,
    numberOfSides: 6,
    customSides: false,
  }
  global.percentilesForStatistics = [0, .05, .15, .50, .85, .95, 1];

  // Other properties that are independent of game instance.
  // @Examples.
  global.distances = {
    'a-b': 5,
    'a-c': 3,
    'b-c': 4,
  };

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

  // @Examples.
  initialGameState.decks = [];
  let deck1 = {
    deck: buildObjectArrayFromRows('deck1', 'A1:B53'),
  }
  initialGameState.decks.push(deck1);
  
  initialGameState.agents = [];
  let agents = buildObjectArrayFromRows('agents', 'A1:D4');
  for (let i of agents) {
    initialGameState.agents.push(i);
  }

  return initialGameState;
}
