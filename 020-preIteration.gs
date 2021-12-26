/**
 * @file: Contains function called before each game iteration is run,
 * after all standard processing of the game state has been made.
 */

modules.example.preIteration = function() {
  // Create a reference to the agent's deck on the agent object, for easier reference.
  // Note that decks have the same IDs as the agents.
  // Also move 'gold' to the main property 'resources', making it easier to handle for markets.
  for (let d in gameState.decks) {
    let a = getAgentById(gameState, d);
    a.deck = gameState.decks[d];
    a.resources = {gold: a.gold};
  }
}
