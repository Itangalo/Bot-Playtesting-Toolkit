/**
 * @file: Contains function called before each game iteration is run,
 * after all standard processing of the game state has been made. Optional.
 */

modules.myModule.preIteration = function() {
  // Put all zero-cost cards in the display for the deck1.
  // let filter = new ObjectFilter().addEqualsCondition({cost: 0});
  // let cards = filter.removeFromArray(gameState.decks.deck1);
  // gameState.decks.deck1.display.push(...cards);

  // Remove three random cards from deck2. Note that the deck is already shuffled.
  // gameState.decks.deck1.drawMultiple(3);

  // Deal five cards from deck3 to each agent, placing in each agent's deck display.
  // There are decks with id matching each agent, allowing a smart shortcut.
  // for (let agent of gameState.agents) {
  //   let cards = gameState.decks.deck3.drawMultiple(5);
  //   agent.deck.display.push(...cards);
  // }

  // Place tokens on three different randomly selected spaces on the board.
  // let filter = new ObjectFilter().addEqualsCondition({hasToken: false});
  // for (let i = 0; i < 3; i++) {
  //   let space = selectRandom(filter.applyOnArray(gameState.tracks.board.spaces));
  //   space.hasToken = true;
  //   gameState.tokensLeft--;
  // }
}
