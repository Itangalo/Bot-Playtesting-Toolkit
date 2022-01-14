/**
 * @file: Classes for decks and cards.
 */

/**
 * Class for managing decks of cards. Also used for creating cards (through Deck.constructCard).
 */
class Deck {
  /**
   * @param {object} deckData: Data with properties for the deck. Special properties:
   *  - id (string): The unique identifier of the deck. Required.
   *  - shuffleWhenCreated (boolean): Whether to shuffle after constructed. Defaults to true.
   *  - addDiscardWhenShuffling (boolean): Whether to add the discard pile when shuffling. Defaults to true.
   *  - displaySize (integer): Used if there should be a common display drawn from the deck. Defaults to 0.
   *  - autoFillDisplay (boolean): Whether to always fill the display to its intended size. Defaults to true.
   *
   * @param {Array} cardDataArray: An array of objects which will be used to create cards.
   * Optional. Special properties used for cards:
   *  - resolver (string): Name of method in modules[module].resolvers.cards. Called from card.resolver().
   */
  constructor(deckData, cardDataArray = false) {
    // Add default settings.
    Object.assign(this, global.defaults.deck);
    // Build basic data and verify required properties.
    Object.assign(this, deckData);
    if (this.id === undefined)
      throw('Decks must have an id property set.');
    
    // Add the deck to gameState and, if relevant, to an agent with the same ID.
    if (gameState.decks === undefined)
      gameState.decks = {};
    gameState.decks[this.id] = this;
    let agent = getAgentById(this.id);
    if (agent) {
      agent.deck = this;
    }

    // Additional processing just for decks.
    this.cards = [];
    this.discardPile = [];
    this.display = [];
    if (cardDataArray) {
      for (let c of cardDataArray) {
        this.constructCard(c);
      }
    }
    if (this.shuffleWhenCreated)
      this.shuffle();
    if (this.autoFillDisplay)
      this.fillDisplay();
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
      if (c !== false) // Don't add the card if there were none to draw.
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
   * Fills the display with cards drawn from the top of the deck.
   */
  fillDisplay() {
    if (!this.displaySize)
      return false;
    while (this.display.length < this.displaySize && this.cards.length > 0) {
      this.display.push(this.draw());
    }
  }

  /**
   * Picks the first card found matching property:value from the display, or false if none is found.
   * If no property or value is provided, the first card in the display will be returned.
   */
  pickFromDisplay(property, value) {
    // If no property is provided, take the first card.
    if (property === undefined) {
      if (!this.display.length) {
        log('Tried to pick the first card in the display of deck ' + this.id + ', but the display is empty.', 'error');
        return false;
      }
      let c = this.display.shift();
      if (this.autoFillDisplay)
        this.fillDisplay();
      return c;
    }

    // Search for a card matching property:value.
    for (let i in this.display) {
      if (this.display[i][property] == value) {
        let c = this.display[i];
        this.display.splice(i, 1);
        if (this.autoFillDisplay)
          this.fillDisplay();
        return c;
      }
    }
    log('Could not find any card where ' + property + ' is ' + value + ' in display of deck ' + this.id + '.', 'error');
    return false;
  }
}

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
   * Calls any resolver set for the card. Any arguments will be sent to the resolver.
   * The card needs to have a the property 'resolver' set and a corresponding
   * method must be placed in modules[module].resolvers.cards.
   */
  resolve() {
    return callResolver('cards', this.resolver, ...arguments);
  }
}
