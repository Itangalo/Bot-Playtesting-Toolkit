/**
 * @file: Carries out each round in the game. Called once for each round.
 */

modules.myModule.playRound = function() {
  // Take agent first in the list and put it last.
  let actingAgent = getAndRotateFirstAgent();

  // Roll dice and use the sum to see how many steps to move the agent's pawn.
  // (Assumes there is a track named 'board' present, and a pawn matching the agent id.)
  // let dice = new DiceRoll();
  // actingAgent.board.pawn.move(dice.sum());
  // Call any resolver set for the space where the pawn ended up. Pass the agent as argument.
  // actingAgent.board.pawn.space.resolve(actingAgent);

  // Shuffle deck1 if it is empty. This automatically adds the discard pile for the deck.
  // if (gameState.decks.deck1.cards.length == 0)
  //   gameState.decks.deck1.shuffle();

  // Call the agent strategy to see which card in the agent's display should be used.
  // let card = actingAgent.consultStrategy('selectCard');
  // Remove the card from the display.
  // actingAgent.deck.pickFromDisplay('id', card.id);
  // Call the resolver set on the card. Pass the agent as argument. Then discard.
  // card.resolve(actingAgent);
  // card.discard();
}
