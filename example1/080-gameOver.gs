/**
 * Tells when the game is over.
 *
 * @return Either true or false.
 */
modules.example1.gameOver = function() {
  // Game is over if (at least) one agent is out of hit points.
  for (let a of gameState.agents) {
    if (a.hitPoints <= 0)
      return true;
  }
  return false;
}
