/**
 * Functions that are specific to each game.
 */

/**
 * Tells when the game is over.
 */
function gameOver(gameState) {
  // Example: Game is over when 10 rounds have been played.
  if (gameState.round >= 10)
    return true;
  else
    return false;
}
