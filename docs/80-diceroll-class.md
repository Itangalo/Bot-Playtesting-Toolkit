# The DiceRoll class

The DiceRoll class is used to make it easier to handle dice rolls. In contrast to Agent, Deck, Goods and other classes provided by BPT, DiceRoll objects are intended to be created and thrown away during games – not created prior to each game iteration.

The DiceRoll class has functionality for rolling many dice at the same time, getting sums, doing skill checks, checking for straights, and also for using non-standard and customized dice.

## Setting default DiceRoll settings

The default settings for dice rolls are stored in `global.defaults.diceRoll`, and can for example be altered by `buildInitialData()`.

* `global.defaults.diceRoll.quantity` tells how many dice by default are rolled at the same time. Is set to 3 if not overridden.
* `global.defaults.diceRoll.numberOfSides` tells how many sides each die has. Can be any positive integer. Is set to 6 if not overridden.
* `global.defaults.diceRoll.customSides` can be set to an array to allow custom dice sides, for example [-1, 1, 1, 2, 4, 8] or [1, 2, 3, 'bonus']. Note that some functions for dice rolls only work on numerical values.

## Making a dice roll

A dice roll is made by a statement on the form `let myRoll = new DiceRoll(quantity, numberOfSides, customSides)`. If default values should be used, `let myRoll = new DiceRoll()` is enough.

## Special properties

The properties `myRoll.quantity`, `myRoll.numberOfSides` and `myRoll.customSides` hold the information used when the dice roll was created.

`myRoll.result` is an array with the dice results, unsorted.

## Functions available for dice rolls

### myRoll.reRoll()

`myRoll.reRoll(n)`

Re-rolls die number `n` and returns the dice roll object. If the die does not exist, an error is thrown.

### myRoll.sum()

`myRoll.sum(modifier = 0, compareAgainst = 0)`

Returns the sum of the rolled dice, plus any provided modifier. If `compareAgainst` is set, the difference against this number is returned (which can be useful for skill checks).

### myRoll.getFrequency()

`myRoll.getFrequency(value)`

Returns how many times `value` occurs in the rolled dice and returns.

### myRoll.getFrequencies()

Returns a frequency distribution of the rolled results, as an object on the form `{1: 1, 3: 1, 4: 1, 6: 2}` (where the property name is the rolled result and the value is how many times it occurs). Results not present on the dice are not present in the returned object – there are no zero-frequencies present.

### myRoll.getStraights()

`myRoll.getStraights(lowest, highest)`

Returns an array of all straights in the dice results, optionally only counting results between `lowest` and `highest`. The return array is on the form `[[1, 2], [5, 6]]` (sorted).

### myRoll.getLongestStraight()

`myRoll.getLongestStraight(lowest, highest)`

Returns the longest straight in the dice results, optionally only counting results between `lowest` and `highest`. Picks the highest if more than one straight is longest.

### myRoll.getHighestFrequency()

`myRoll.getHighestFrequency(threshold)`

Returns the highest number of equal dice with value above `threshold`. If no threshold is set, all results (also non-numeric) are counted.

### myRoll.restrict()

`myRoll.restrict(n)`

Treats dice results as if only the `n` first dice are present until `myRoll.unlock()` is called. Returns the dice roll object. Dice that already are restricted cannot be restricted again until unlocked.

### myRoll.unlock()

Unlocks restricted dice, making the full dice results available again.
