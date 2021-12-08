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
  global.defaultIterations = 1;
  global.percentilesForStatistics = [0, .05, .15, .50, .85, .95, 1];

  // Other properties that are game-dependent.
  // @Examples.
  global.distances = {
    'a-b': 5,
    'a-c': 3,
    'b-c': 4,
  };

  /**
   * Build object describing initial game state.
   * 
   * Any decks put in initialGameState.decks will be created on game start.
   * Decks should be stored on the form initialGameState.decks[deckId] = array_of_card_data,
   * not as Deck objects. (Nor should cards be Card objects, just objects with data.)
   *
   * Any agents put in initialGameState.agents will be created on game start.
   * Agents should be stored on the form initialGameState.agents[agendId] = object_with_agent_data,
   * not as Agent objects.
   */
  let initialGameState = {};

  // @Examples.
  initialGameState.decks = {};
  initialGameState.decks.deck1 = buildObjectArrayFromRows('deck1', 'A1:B53');
  
  initialGameState.agents = {};
  let agents = buildObjectArrayFromRows('agents', 'A1:D4');
  for (let i of agents) {
    initialGameState.agents[i.id] = i;
  }

  return initialGameState;
}
