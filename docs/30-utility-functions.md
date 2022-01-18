# Common utility functions

The Bot Playtesting Toolkit provides a number of functions that may come handy when creating a model for a game. They are described in code as well as here.

## Utility functions for handling arrays

### sortByProperty()

`sortByProperty(objArray, property, ascending = true)`

Example usage: `sortByProperty(gameState.agents, 'hitPoints')`

This function sorts an array of objects by a given property. The array is changed in place and the array is also returned. The default is to sort _ascending_, and only numerical sorting is applied.

### sortBySubProperty()

`sortBySubProperty(objArray, property, subProperty, ascending = true)`

Example usage: `sortByProperty(gameState.agents, 'cards', 'length', false)`

This function sorts an array of objects based on a given sub property. The array is changed in place and the array is also returned. The default is to sort _ascending_, and only numerical sorting is applied.

### shuffle()

`shuffle(array)`

This function randomizes the order of elements in an array. The array is changed in place and the array is also returned.

### pickFromObjectArray()

`pickFromObjectArray(objectArray, property, value, remove = true)`

Example usage 1: `pickFromObjectArray(gameState.decks.myDeck.discardPile, 'title', 'Library of Leng')`
Example usage 2: `pickFromObjectArray(gameState.decks.myDeck.discardPile, ['colour', 'value'], ['spades', 1])`

Returns the first object matching property:value in an array of objects, or `false` if no match is found. If multiple property:value pairs should be fulfilled, provide them as arrays.

`remove` determines whether the object should be removed from the search array or not. Defaults to `true`.

### pickAllFromObjectArray()

`pickAllFromObjectArray(objectArray, property, value, remove = true)`

Example usage 1: pickAllFromObjectArray(gameState.availableQuests, 'startingPlace', 'Village')
Example usage 1: pickAllFromObjectArray(gameState.theStore, ['type', 'cost'], ['potion', 2], false)

Returns an array of all objects matching property:value in an array of objects, defaulting to an empty array if none are found. If multiple property:value pairs should be fulfilled, provide them as arrays.

`remove` determines whether the objects should be removed from the search array or not. Defaults to `true`.

### getFrequency()

`getFrequency(array, value)`

Returns how many times 'value' occurs in 'array'. The array should be an array of plain values, no objects.

### getFrequencies()

`getFrequencies(array)`

Returns an object with the frequencies of values in an array. `getFrequencies([4, 5, 4, 'banana'])` returns `{4: 2, 5: 1, banana: 1}`.

### buildArrayWithProperty()

`buildArrayWithProperty(objectArray, property)`

Example usage: buildArrayWithProperty(gameState.agents, 'gold')

Takes an array of objects and returns an array with all values for the selected property.

## Utility functions for statistics

These functions may be particularly useful when collecting data for statistics in `buildStatistics()`.

### getMax()

`getMax(objArray, property, subProperty = false)`

Looks through all objects in the provided array and compares 'property' (or 'property.subProperty'). The highest value is returned.

### getMin()

`getMin(objArray, property, subProperty = false)`

Looks through all objects in the provided array and compares 'property' (or 'property.subProperty'). The lowest value is returned.

### getSum()

`getSum(objArray, property, subProperty = false)`

Goes through all the objects in the provided array and returns the sum of the values in the given property (or sub property).

### getAverage()

`getAverage(objArray, property, subProperty = false)`

Goes through all the objects in the provided array and returns the arithmetic mean of the values in the given property (or sub property).


## Other utility functions

### copy()

`copy(object)`

Returns a deep copy of the provided object, for example to avoid making changes in the original object. Note that methods/functions are _not_ copied.

### isIterable()

`isIterable(obj)`

Returns `true` if the provided object is iterable (i.e. can be used in a _for of_ loop), otherwise `false`.

### getAgentById()

`getAgentById(id)`

Returns the agent with the provided id, or `false` if no match is found.

### selectRandom()

`selectRandom(arr, property = false)`

Example usage 1: `selectRandom([1, 2, 3, 4, 5])`
Example usage 2: `selectRandom(gameState.agents, 'hitPoints')`

Selects a and returns a random element from an array. If the array consists of objects, `property` can be set to a property name in order to use the property values for weighting probability. (In example 2 above, an agent with 10 hit points will be twice as likely to be selected as one with 5 hit points.)

### getStraights()

`getStraights(values, lowest, highest)`

Returns an array of the straights found in an array of values, for example `[[2, 3, 4], [6], [10, 11]]`. The straights are sorted by value, ascending. Values are not repeated between straights, so [2, 3, 4] will return a single straight (and no straights with 1 and 2 values only).

If `lowest` and `highest` are set, only values between these limits are included.

### getLongestStraight()

`getLongestStraight(values, lowest, highest)`

Returns the longest straight found in an array of values, for example `[2, 3, 4]`. If several longest are found, the highest is returned.

If `lowest` and `highest` are set, only values between these limits are included.

### getHighestProperty()

`getHighestProperty(obj)`

Looks through all numerical properties of an object and returns the property with the highest numerical value. If several have the highest value, a random of these are returned. Note that it is the property _name_ that is returned, not the value.