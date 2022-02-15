# The ObjectFilter class

The `ObjectFilter` class is used for four things:

1. Creating simple of complex filters or conditions, intended to be applied on object properties.
2. Evaluating the filter/condition on a single object (returning `true` or `false`).
3. In an array of objects, finding one, many or all objects that match the filter.
4. In an array of objects, finding and removing one, many or all objects that match the filter.

The ObjectFilter class is used as a utility function -- it is not intended to be stored on persistend objects.

## Some examples

Getting all agents on the blue team:

`let blueTeam = new ObjectFilter({team: 'blue'}).applyOnArray(gameState.agents);`

Selecting all spaces on a track (i.e. chess board) where the colour is black there is no piece:

`let mySpaces = new ObjectFilter().addEqualsCondition({colour: 'black'}).addEqualsCondition({piece: false}).applyOnArray(gameState.track.board.spaces);`

Taking out all cards that are spades or twos:

`let myCards = new ObjectFilter().or().addEqualsCondition({colour: 'spades'}).addEqualsCondition({value: 2}).removeFromArray(gameState.decks.myDeck.cards);`


## Creating an object filter

Object filters are created by `let filter = new ObjectFilter()`, or by directly stating adding a condition: `let filter = new ObjectFilter({a: 5})`. Any conditions added on creation are treated as _equals_ conditions and added as an _and_ condition.

The introducing examples don't store the filter itself, only the results when applying the filter to an array of objects, but it is quite possible to save the filter in a variable to use later on.

## Adding conditions

The filter has a stack of AND conditions and a stack of OR conditions. The filter is considered fulfilled if all conditions in the AND stack are fulfilled and at least one condition in OR stack is fulfilled (if any conditions are present).

Conditions are by default added to the AND stack. The stack to use is set by calling `myFilter.and()` and `myFilter.or()`.

There are six types of conditions that can be added:

* <break>

Conditions are added either to a stack of AND condition

There are AND conditions, OR conditions, NOT conditions and NOT OR conditions. The filter is considered fulfilled if all conditions in AND and NOT are fulfilled and at least one condition in OR and OR NOT (combined) are fulfilled, if such exist.

Conditions are added like so:

    myFilter = new ObjectFilter();
    myFilter.addAndCondition({a: 1}); // Only objects where a = 1 will be included.
    myFilter.addNotCondition({b: undefined}); // No objects where b = undefined will be included.
    myFilter.addOrCondition({c: 2});
    myFilter.addOrCondition({d: 3});
    myFilter.addNotOrCondition({e: 0}); // Only objects where c = 2, d = 3 _or_ e != 0 will be included.

The methods for adding conditions return the object filter itself, allowing chaining.

## Applying filters

### Evaluating against a single object

`myFilter.applyOnObject(myObject)`

The filter can be evaluated against a single object by the method `myFilter.applyOnObject(myObject)`. This returns `true` or `false`, depending on whether the object fulfills the conditions in the filter or not.

### Applying the filter on an array of objects

`myFilter.applyOnArray(objectArray)` returns an array with all the objects matching the filter. The array can be empty.

`myFilterfindFirstInArray(objectArray)` returns the first matching object in the array, or `false` if none is found.

`myFilterremoveFirstFromArray(objectArray)` returns the first matching object in the array, _and removes it from the array_. If no match is found, `false` is returned.

`myFilterremoveFromArray(objectArray, maxNumber = Number.POSITIVE_INFINITY)` returns an array with all or a set number of matching objects in the arrary, _and removes them from the original array_. The parameter `maxNumber` can be used to limit how many items should be removed at most.
