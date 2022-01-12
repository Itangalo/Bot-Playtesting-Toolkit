/**
 * Tells when the game is over.
 *
 * @return Either true or false.
 */
modules.noThanks.gameOver = function() {
  // Game is over if the display for the shared deck is empty – it means that we are out of cards.
  if (gameState.decks.deck.display.length < 1)
    return true;
  return false;
}
