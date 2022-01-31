# The Deck and Card classes

The Bot Playtesting Toolkit comes with pre-made functionality for handling decks and cards. Functionality includes things like shuffling, drawing cards, discard piles, card displays and searching a deck for certain cards.

A useful feature is also **resolvers**. Some games only have cards that all have the same functionality, with minor variations based on values on the cards. But sometimes there are cards with completely different effects, or a few cards that have special effects that break the common patterns. For such cards _resolvers_ can be set. If calling `card.resolve(...arguments)`, the any resolver function on the card will be called with the provided arguments. This allows for easily keeping different effects in different functions or files, decreasing the need for a clutter of if statements.

## Creating decks and cards

Decks and cards are normally created in the module's `buildInitialData` function by populating the `gameStateSeed.decks` array. The array should be populated by objects on the following form:

    {
      deck: deckData,
      cards: cardDataArray,
    }

The card data is usually built from data in a spreadsheet. The deck data could also be fetched from a spreadsheet, but is often times so small that it also can be written directly in code. In the example below, card data is fetched from a spreadsheet and deck data is written by hand.

![Screen dump of card data in a spreadsheet.](https://user-images.githubusercontent.com/262940/149384533-c6e206c0-a0d4-48b1-a9d9-4929f990b564.png)

    let cardDataArray = buildObjectArrayFromRows('example1', 'A2:C54');
    let deckData = {
      id: 'theDeck',
      shuffleWhenCreated: false,
    };

    gameStateSeed.decks = [];
    gameStateSeed.decks.push({
      deck: deckData,
      cards: cardDataArray,
    });

Data stored in `gameStateSeed.decks` will automatically be used to create Deck and Card objects before each game iteration. The decks will be stored under `gameState.decks[deckId]`. Cards are stored as an array at `gameState.decks[deckId].cards`.

Decks and cards can also be created from other places in the code by the statement `myDeck = new Deck(deckData)` and `myCard = myDeck.constructCard(cardData)`.

## Special properties

In the example above the cards have the properties _colour_ and _value_. These are arbitrary and will match whatever headers are used in the spreadsheet data. (See also [documentation about reading data from spreadsheets](Functions-for-reading-from-spreadsheets).) The property _resolver_ is special, as are some other properties. The special properties are described below.

### Deck properties

Decks must have the property `id` set. If the id matches the id of an agent, the deck is assumed to belong to that agent is added to agent.deck. (It is also available at gameState.decks[deckId].)

The property `shuffleWhenCreated` can be set to `false` to avoid shuffling the deck before a game iteration starts. Defaults to `true`.

The property `addDiscardWhenShuffling` can be set to `false` to avoid automatically adding the discard pile to the deck when it is shuffled. Defaults to `true`.

The property `displaySize` can be set to a positive integer to tell BPT that there should be a visible display of a certain number of cards. Defaults to 0.

The property `autoFillDisplay` can be set to `true` to have BPT automatically fill the display when a game starts and when cards are drawn from the display (assuming there are cards left in the deck). Defaults to `true` (but note that default display size is 0).

`myDeck.cards` contains an array of all cards in the deck.

`myDeck.discardPile` contains an array of all cards in the deck's discard pile.

`myDeck.display` contains an array of all cards in the deck's display.

### Card properties

The property `resolver` can be set to any name of a function stored at `modules[module].resolvers`. Calling card.resolve(...arguments) will send off the request to the resolver function of the card and return the result. If the card has no resolver, `false` is returned.

`myCard.deck` points to the deck from which the card was created.

Id is not required on cards.

## Functions available for decks and cards

The examples below assumes that 

### myDeck.constructCard()

`myDeck.constructCard(cardData)`

The function adds a card to the deck, based on the properties provided in `cardData`, and returns the result.

### myDeck.draw()

Draws the top card from the deck: removes the topmost card from the deck and returns it. Returns `false` and logs a notice message if the deck is empty.

### myDeck.drawAndDiscard()

Puts the top card in the deck in the discard pile _and_ returns it. This is useful when the card effects are processed, but the actual card is not kept by agents or elsewhere. Returns `false` and logs a notice message if the deck is empty.

### myDeck.drawMultiple()

`myDeck.drawMultiple(n = 1)`

Draws the `n` top cards and returns them in an array. A notice message is logged for each missing card, if any. The array will be empty if no cards are left to draw.

### myDeck.addToBottom()

`myDeck.addToBottom(card)`

Adds a card to the bottom of the deck.

### myDeck.addToTop()

`myDeck.addToTop(card)`

Adds a card to the top of the deck.

### myDeck.shuffle()

Shuffles the deck. If `deck.addDiscardWhenShuffling` is `true` any cards in `myDeck.discardPile` will be added before shuffling.

### myDeck.pick()

`myDeck.pick(property, value)`

Picks the first card found in the deck matching `property:value`, or `false` if no match is found. _Removes_ the card from the deck.

### myDeck.pickAll()

`myDeck.pickAll(property, value)`

Picks all cards matching `property:value` from the deck, returned in an array (which can be empty). _Removes_ the cards from the deck.

### myDeck.countOccurances()

`myDeck.countOccurances(property, value)`

Counts how many cards matching `property:value` are in the deck and returns that number.

### myDeck.getAllOccurances()

`myDeck.getAllOccurances(property)`

Lists how many cards there are with each value of the given property. Returns an array with entries {value:X, occurances:NN}, sorted with most common values first.

### myDeck.fillDisplay()

Fills the display with cards drawn from the deck. The display size is determined by `myDeck.displaySize`.

### myDeck.pickFromDisplay()

`myDeck.pickFromDisplay(property, value)`

Returns the first card found matching `property:value` from the display, or `false` if none is found. If no property or value is provided, the first card in the display will be returned. The card will be removed from the display. If `myDeck.autoFillDisplay` is `true` the display will automatically be refilled.

### myCard.discard()

Adds the card to the top of the discard pile for the card's deck.

### myCard.returnToDeck()

Adds the card to the bottom of the card's deck.

### myCard.resolve()

`myCard.resolve(...arguments)`

Calls any resolver set for the card and returns the result. Any arguments provided will be passed on to the resolver. The card needs to have a the property 'resolver' set and a corresponding method must be placed in modules[module].resolvers. If no resolver is set, `false` is returned.
