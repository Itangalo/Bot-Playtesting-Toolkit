/**
 * Class for managing decks of cards. Also used for creating cards (through deck.constructCard).
 */
class deck {
  /**
   * @param {string} id: The unique identifier of the deck.
   * @param {array} cardDataArray: An array of objects which will be used to create cards.
   * @param {boolean} shuffle: Whether to shuffle after constructed. Defaults to true.
   */
  constructor(id, cardDataArray = false, shuffle = true) {
    this.id = id;
    this.cards = [];
    this.discardPile = [];
    this.addDiscardWhenShuffling = true;
    if (typeof cardDataArray == 'array') {
      for (let c of cardDataArray) {
        this.constructCard(c);
      }
    }
    if (shuffle)
      this.shuffle();
  }

  /**
   * Creates a card object and adds to the bottom of the deck.
   * @param {object} cardData: An object with any sets of property:value pairs.
   * @return
   */
  constructCard(cardData) {
    // Note that the card constructor adds it to the bottom of the deck.
    let c = new card(cardData, this);
    return c;
  }

  /**
   * Draws the top card from the deck.
   */
  draw() {
    if (this.cards.length > 0)
      return this.cards.shift()
    else {
      log('Tried to draw from empty deck (' + this.id + ').', 'notice');
      return false;
    }
  }

  /**
   * Draws the top card and puts it into the discard pile.
   */
  drawAndDiscard() {
    let c = this.draw();
    if (!c)
      return false;
    this.discardPile.push(c);
    return c;
  }

  /**
   * Draws n top cards and returns them in an array.
   */
  drawMultiple(n = 1) {
    let cards = [];
    for (let i = 0; i < n; i++) {
      let c = this.draw();
      if (!c) // Don't add the card if there were none to draw.
        cards.push(c);
    }
    return cards;
  }

  /**
   * Adds a card to the bottom of the deck.
   */
  addToBottom(card) {
    this.cards.push(card);
  }

  /**
   * Adds a card to the top of the deck.
   */
  addToTop(card) {
    this.cards.unshift(card);
  }

  /**
   * Shuffles the deck.
   * Also adds discard pile to deck, if indicated by on this.addDiscardWhenShuffling.
   */
  shuffle() {
    if (this.addDiscardWhenShuffling) {
      this.cards.push(...this.discardPile);
      this.discardPile = [];
    }
    shuffle(this.cards);
  }

  /**
   * Picks the first card found matching property:value, or false if none is found.
   */
  pick(property, value) {
    for (let i in this.cards) {
      if (this.cards[i][property] == value) {
        let c = this.cards[i];
        this.cards.splice(i, 1);
        return c;
      }
    }
    log('Could not find any card where ' + property + ' is ' + value + ' in deck ' + this.id + '.', 'notice');
    return false;
  }
}
