/**
 * Resolver methods for cards. Property 'resolver' on cards should
 * correspond to a method defined here.
 * Arguments are fetched dynamically from card.resolver(arg1, arg2...)
 * and passed on.
 */

/**
 * Example resolver. Logs the card data, but strips away the deck object
 * (in a non-destructive way) first.
 * @param {card} card: The card object.
 */
cardResolvers.log = function(card) {
  let copy = Object.assign({}, card);
  delete(copy.deck);
  copy.deck = card.deck.id;
  log('Logging card: ' + JSON.stringify(copy), 'test');
}