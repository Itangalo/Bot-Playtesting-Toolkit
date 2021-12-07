/**
 * Class for managing cards, making up decks.
 */
class card {
  /**
   * @param {object} cardData: Any propery:value pairs that should be added to the card.
   * @param {deckObject} deck: A deck object, to which the card should be added.
   */
  constructor(cardData, deckObject) {
    if (!deckObject instanceof deck) {
      log('Cards must be added to a proper deck.', 'error');
      return false;
    }

    for (let i in cardData) {
      this[i] = cardData[i];
    }
    this.deck = deckObject;
    deckObject.addToBottom(this);
  }

  /**
   * Passes on work to any resolver function declared for the card,
   * along with any parameters. Card needs to have property 'resolver'
   * set to a method available in the cardResolvers object.
   */
  resolve() {
    if (!this.resolver)
      return false;
    if (!cardResolvers[this.resolver]) {
      log('Resolver ' + this.resolver + ' does not exist.', 'error');
      return false;
    }

    cardResolvers[this.resolver](...arguments);
  }
}
