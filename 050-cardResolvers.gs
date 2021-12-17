/**
 * Resolver methods for cards. Property 'resolver' on cards should
 * correspond to a method defined here.
 * Arguments are fetched dynamically from card.resolver(arg1, arg2...)
 * and passed on.
 */

/**
 * @Examples: Logs the card data, but strips away the deck object
 * (in a non-destructive way) first.
 * @param {Card} card: The card object.
 */
cardResolvers.example = {};
cardResolvers.example.log = function(card) {
  let temporaryCopy = copy(card);
  delete(temporaryCopy.deck);
  temporaryCopy.deck = card.deck.id;
  log('Logging card: ' + JSON.stringify(temporaryCopy), 'example');
}
