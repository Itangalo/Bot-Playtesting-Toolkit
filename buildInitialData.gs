/**
 * Builds the data needed to start a game.
 * 
 * Should populate the global and return an object describing initial game state.
 */
function buildInitialData() {
  /**
   * Build global data that should be accessible from anywhere.
   */
  global.defaultIterations = 1;


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

  // @EXAMPLES
  initialGameState.decks = {};
  initialGameState.decks.deck1 = buildObjectArrayFromRows('deck1', 'A1:B53');
  
  initialGameState.agents = {};
  let agents = buildObjectArrayFromRows('agents', 'A1:D4');
  for (let i of agents) {
    initialGameState.agents[i.id] = i;
  }

  return initialGameState;
}
