/**
 * Class for managing decks of cards. Also used for creating cards (through Deck.constructCard).
 */
class Deck {
  /**
   * @param {String} id: The unique identifier of the deck.
   * @param {Array} cardDataArray: An array of objects which will be used to create cards.
   * @param {Boolean} shuffle: Whether to shuffle after constructed. Defaults to true.
   */
  constructor(id, cardDataArray = false, shuffle = true) {
    this.id = id;
    this.cards = [];
    this.discardPile = [];
    this.addDiscardWhenShuffling = true;
    if (cardDataArray) {
      for (let c of cardDataArray) {
        this.constructCard(c);
      }
    }
    if (shuffle)
      this.shuffle();
  }

  /**
   * Creates a card object and adds to the bottom of the deck.
   * @param {Object} cardData: An object with any sets of property:value pairs.
   * @return
   */
  constructCard(cardData) {
    // Note that the card constructor adds it to the bottom of the deck.
    let c = new Card(cardData, this);
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

  /**
   * Picks all cards matching property:value, returned in an array (can be empty).
   */
  pickAll(property, value) {
    let picked = [];
    for (let i = this.cards.length - 1; i >= 0; i--) {
      if (this.cards[i][property] == value) {
        let c = this.cards[i];
        this.cards.splice(i, 1);
        picked.push(c);
      }
    }
    return picked;
  }

  /**
   * Counts how many cards matching property:value are in the deck.
   */
  countOccurances(property, value) {
    let occurances = 0;
    for (let c of this.cards) {
      if (c[property] == value)
        occurances++;
    }
    return occurances;
  }

  /**
   * Lists how many cards there are with each value of the given property.
   * Returns an array with entries {value:X, occurances:NN}, sorted with most
   * common values first.
   */
  getAllOccurances(property) {
    let unsortedList = {};
    for (let c of this.cards) {
      if (!unsortedList[c[property]])
        unsortedList[c[property]] = 1;
      else
        unsortedList[c[property]]++;
    }
    let sortedList = [];
    for (let value in unsortedList) {
      sortedList.push({value: value, occurances: unsortedList[value]});
    }
    sortByProperty(sortedList, 'occurances', false);
    return sortedList;
  }

  /**
   * Short-hand function for reading number of cards left in the deck.
   */
  getNumberOfCards() {
    return this.cards.length;
  }

  /**
   * Short-hand function for reading number of cards in the discard pile.
   */
  getNumberOfDiscardedCards() {
    return this.discardPile.length;
  }
}
