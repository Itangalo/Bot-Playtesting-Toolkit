/**
 * Temporary stuff used while developing.
 */

function tmp(gs) {
  let cards = gs.decks.deck1.pickAll('colour', 'spades');
  debugger
  for (let c of cards)
    c.discard();
  debugger
  cards[0].deck.shuffle();
  debugger
}
