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

There are nine types of conditions that can be added:

* `myFilter.addFilterCondition(filter)` adds another filter as a condition, allowing complex hierarchies of conditions. The condition is fulfilled if the added filter is fulfilled.
* `myFilter.addEqualsCondition(condition)` requires that the stated object property should match the stated value, or one of several stated values. On the form `{a: 3}` or `{a: [2, 3, 5]}`.
* `myFilter.addNotEqualsCondition(condition)` requires that the stated object property should different from the stated value, or from all of several stated values. On the form `{a: 3}` or `{a: [2, 3, 5]}`.
* `myFilter.addEmptyCondition(condition)` requires that the stated object property is `undefined`, `null`, `false`, an empty array or an empty string. The condition is provided as the name of the property (as a string).
* `myFilter.addNotEmptyCondition(condition)` requires that the stated object property is _not_ `undefined`, `null`, `false`, an empty array or an empty string. The condition is provided as the name of the property (as a string).
* `myFilter.addGreaterThanCondition(condition)` requires that the stated object property is higher than the stated value. On the form `{a: 3}`.
* `myFilter.addGreaterOrEqualCondition(condition)` requires that the stated object property is higher than or equal to the stated value. On the form `{a: 3}`.
* `myFilter.addLessThanCondition(condition)` does what you expect from the pattern above.
* `myFilter.addLessThanCondition(condition)` also does what you expect.

Conditions are added like so:

    myFilter = new ObjectFilter();
    myFilter.addEqualsCondition({a: 1}); // Only objects where a = 1 will be included.
    myFilter.addNotEqualsCondition({b: undefined}); // No objects where b = undefined will be included.
    myFilter.or(); // Any following conditions will be added to the OR stack.
    myFilter.addEqualsCondition({c: 2});
    myFilter.addEqualsCondition({d: 3});
    myFilter.addNotEqualsCondition({e: 0}); // Only objects where c = 2, d = 3 _or_ e != 0 will be included.

The methods for adding conditions return the object filter itself, allowing chaining.

## Applying filters

### Evaluating against a single object

`myFilter.applyOnObject(myObject)`

The filter can be evaluated against a single object by the method `myFilter.applyOnObject(myObject)`. This returns `true` or `false`, depending on whether the object fulfills the conditions in the filter or not.

### Applying the filter on an array of objects

`myFilter.applyOnArray(objectArray)` returns an array with all the objects matching the filter. The array can be empty.

`myFilter.findFirstInArray(objectArray)` returns the first matching object in the array, or `false` if none is found.

`myFilter.removeFirstFromArray(objectArray)` returns the first matching object in the array, _and removes it from the array_. If no match is found, `false` is returned.

`myFilter.removeFromArray(objectArray, maxNumber = Number.POSITIVE_INFINITY)` returns an array with all or a set number of matching objects in the arrary, _and removes them from the original array_. The parameter `maxNumber` can be used to limit how many items should be removed at most.
