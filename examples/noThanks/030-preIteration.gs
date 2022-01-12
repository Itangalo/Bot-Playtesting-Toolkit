/**
 * @file: Contains function called before each game iteration is run,
 * after all standard processing of the game state has been made.
 */

modules.noThanks.preIteration = function() {
  // Remove nine cards from the deck.
  for (let i = 0; i < 9; i++)
    gameState.decks.deck.draw();
  
  // Set some starting values.
  gameState.markers = 0;
  for (let a of gameState.agents) {
    a.picks = 0;
    a.payments = 0;
  }
}
