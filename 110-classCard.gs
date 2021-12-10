/**
 * Class for managing cards, making up decks.
 */
class Card {
  /**
   * @param {Object} cardData: Any propery:value pairs that should be added to the card.
   * @param {Deck} deck: A deck object, to which the card should be added.
   */
  constructor(cardData, deck) {
    if (!deck instanceof Deck) {
      log('Cards must be added to a proper deck.', 'error');
      return false;
    }

    for (let i in cardData) {
      this[i] = cardData[i];
    }
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
   * Passes on work to any resolver function declared for the card,
   * along with any parameters. Card needs to have a the property 'resolver'
   * set and the cardResolvers object needs to have a corresponding method.
   */
  resolve() {
    if (!this.resolver)
      return false;
    if (!cardResolvers[this.resolver]) {
      log('Card resolver ' + this.resolver + ' does not exist.', 'error');
      return false;
    }

    cardResolvers[this.resolver](...arguments);
  }
}
