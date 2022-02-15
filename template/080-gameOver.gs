/**
 * Tells when the game is over.
 *
 * @return Either true or false.
 */
modules.myModule.gameOver = function() {
  // Game is over if (at least) one agent is out of hit points or there are no more cards in deck1.
  if (gameState.decks.deck1.cards.length == 0)
    return true;
  for (let agent of gameState.agents)
    if (agent.hitPoints <= 0)
      return true;

  return false;
}
