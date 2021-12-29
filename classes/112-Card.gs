/**
 * Class for managing cards, making up decks.
 */
class Card {
  /**
   * @param {Object} cardData: Any propery:value pairs that should be added to the card.
   * @param {Deck} deck: A deck object, to which the card should be added.
   */
  constructor(cardData, deck) {
    if (!deck instanceof Deck)
      throw('Cards must be added to a proper deck.');

    Object.assign(this, cardData);
    this.deck = deck;
    deck.addToBottom(this);
  }

  /**
   * Places the card at the top of the discard pile for the card's deck.
   */
  discard() {
    this.deck.discardPile.unshift(this);
  }

  /**
   * Places the card at the bottom of the card's deck.
   */
  returnToDeck() {
    this.deck.addToBottom(this);
  }

  /**
   * Calls any resolver set for the card.
   * Any arguments will be sent to the resolver. Note that the card itelf is
   * always passed on as the first parameter.
   * The card needs to have a the property 'resolver' set and a corresponding
   * method must be placed in modules[module].resolvers.cards.
   */
  resolve() {
    callResolver('cards', this.resolver, this, ...arguments);
  }
}
