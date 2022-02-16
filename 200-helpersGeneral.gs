/**
 * @file: Helper functions dealing with general JavaScript/Google sheets stuff.
 */

/**
 * Helper functions for reading data from the spreadsheet.
 */

/**
 * Builds an array of objects with data taken from spreadsheet, one object for each row.
 * By default the first row is used for property names. Can be overridden by columnMapping.
 * All values brackeded by [] will be split into an array using comma as separator.
 * @param {String} sheetName: The name of the sheet to collect data from.
 * @param {String} range: The range, in a format accepted by Google spreadsheet.
 * @param {Object} columnMapping: Used if first row is _not_ property names. Describes which
 * properties to assign column values to, on the form title:columnNumber. 1-indexed.
 */
function buildObjectArrayFromRows(sheetName, range, columnMapping = false) {
  let data = SpreadsheetApp.getActive().getSheetByName(sheetName).getRange(range).getValues();
  return buildObjectArray(data, columnMapping);
}

/**
 * Builds an array of objects with data taken from spreadsheet, one object for each column.
 * By default the first column is used for property names. Can be overridden by rowMapping.
 * All values brackeded by [] will be split into an array using comma as separator.
 * @param {String} sheetName: The name of the sheet to collect data from.
 * @param {String} range: The range, in a format accepted by Google spreadsheet.
 * @param {Object} rowMapping: Used if first column is _not_ property names. Describes which
 * properties to assign rows values to, on the form title:rowNumber. 1-indexed.
 */
function buildObjectArrayFromColumns(sheetName, range, rowMapping = false) {
  let data = SpreadsheetApp.getActive().getSheetByName(sheetName).getRange(range).getValues();
  data = transpose(data);
  return buildObjectArray(data, rowMapping);
}

/**
 * Builds an object with data taken from spreadsheet, with a single row or column where each
 * cell has content on the form 'propertyName: value'. All values brackeded by [] will be split
 * into an array using comma as separator.
 * @param {String} sheetName: The name of the sheet to collect data from.
 * @param {String} range: The range, in a format accepted by Google spreadsheet.
 * @param {String} propertySeparator: A string separating property name from value(s). Defaults to colon.
 */
function buildObjectFromLine(sheetName, range, propertySeparator = ':') {
  let data = SpreadsheetApp.getActive().getSheetByName(sheetName).getRange(range).getValues();
  // Make a column into a row.
  if (data.length > 1)
    data = transpose(data);
  // Only take first row, even if more are provided.
  data = data[0];

  let obj = {};
  for (let i of data) {
    let d = i.split(propertySeparator);
    if (d.length > 2)
      throw('Cell contains the property separator multiple times. Range: ' + range);
    let p = processValue(d[0], false);
    let v = processValue(d[1]);
    obj[p] = v;
  }
  return obj;
}

/**
 * Transposes an array/matrix and returns the result.
 * Code from https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
 */
function transpose(arr){
  arr = arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
  return arr;
}

/**
 * Helper function building an array of objects from a provided matrix.
 * Intended to be called internally.
 */
function buildObjectArray(data, mapping) {
  if (!mapping) {
    mapping = {};
    let properties = data.shift();
    for (let i in properties) {
      mapping[processValue(properties[i], false)] = 1 + parseInt(i);
    }
  }
  let objArray = [];
  for (let row of data) {
    let obj = {};
    for (let property in mapping) {
      let value = processValue(row[-1 + mapping[property]]);
      obj[property] = value;
    }
    objArray.push(obj);
  }
  return objArray;
}

/**
 * Trims strings and turn numeric-like strings into floats.
 * If a string is bracketed by '[]' it is split by ',' and each piece processed
 * (unless 'checkArrays' is false).
 */
function processValue(value, checkArrays = true) {
  // Don't process numbers, boolean values and the like.
  if (!value || typeof(value) != 'string')
    return value;
  value = value.trim();

  // Check if the value is bracketed. If so, split and call this function on each part.
  if (checkArrays) {
    if (value[0] == '[' && value[value.length-1] == ']') {
      value = value.substring(1, value.length-1);
      if (value == '')
        return [''];
      else
        value = value.split(',');
      for (let i in value)
        value[i] = processValue(value[i], true);
      return value;
    }
  }

  // Make boolean-like strings into booleans.
  if (value.toLowerCase() == 'true')
    return true;
  if (value.toLowerCase() == 'false')
    return false;
  // Make numeric-like strings into strings.
  if (!isNaN(value)) {
    value = parseFloat(value);
  }
  return value;
}

/**
 * Helper functions handling arrays.
 */

/**
 * Used for sorting an array of objects by an object property.
 * 
 * @param {array} objArray: The array of objects to be sorted.
 * @param {string} property: The name of the property to sort by.
 * @param {boolean} ascending: Set to false to sort descending. Defaults to true.
 * @param {boolean} shuffleFirst: Set to true to shuffle the array before sorting, to avoid bias.
 */
function sortByProperty(objArray, property, ascending = true, shuffleFirst = false) {
  if (shuffleFirst)
    shuffle(objArray);
  if (ascending)
    objArray.sort((a, b) => a[property] > b[property] ? 1 : -1);
  else
    objArray.sort((a, b) => b[property] > a[property] ? 1 : -1);
  return objArray;
}

/**
 * Used for sorting an array of objects by a sub property.
 * 
 * @param {array} objArray: The array of objects to be sorted.
 * @param {string} property: The name of the property containing the sub property.
 * @param {string} property: The name of the sub property to sort by.
 * @param {boolean} ascending: Set to false to sort descending. Defaults to true.
 * @param {boolean} shuffleFirst: Set to true to shuffle the array before sorting, to avoid bias.
 */
function sortBySubProperty(objArray, property, subProperty, ascending = true, shuffleFirst = false) {
  if (shuffleFirst)
    shuffle(objArray);
  if (ascending)
    objArray.sort((a, b) => a[property][subProperty] > b[property][subProperty] ? 1 : -1);
  else
    objArray.sort((a, b) => b[property][subProperty] > a[property][subProperty] ? 1 : -1);
  return objArray;
}

// Shuffles an array.
// Code from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Returns how many times 'value' occurs in 'array'.
function getFrequency(array, value) {
  let frequency = 0;
  for (let v of array)
    if (v == value) frequency++;
  return frequency;
}

// Returns an object with the frequencies of values in an array.
// [4, 5, 4, 'banana'] returns {4: 2, 5: 1, banana: 1}.
function getFrequencies(array) {
  let frequencies = {};
  for (let v of array)
    frequencies[v] = frequencies[v] ? frequencies[v] + 1 : 1;
  return frequencies;
}

// Takes an array of objects and returns an array with all values for the selected property.
function buildArrayWithProperty(objectArray, property) {
  let result = [];
  for (let o of objectArray) {
    result.push(o[property]);
  }
  return result;
}

/**
 * Helper functions for statistics.
 */

// Looks through all objects in objArray and compares 'property' (or 'property.subProperty').
// Returns the highest value.
function getMax(objArray, property, subProperty = false) {
  if (!subProperty) {
    sortByProperty(objArray, property, false);
    return objArray[0][property];
  }
  else {
    sortBySubProperty(objArray, property, subProperty, false);
    return objArray[0][property][subProperty];
  }
}

// Looks through all objects in objArray and compares 'property' (or 'property.subProperty').
// Returns the lowest value.
function getMin(objArray, property, subProperty = false) {
  if (!subProperty) {
    sortByProperty(objArray, property, true);
    return objArray[0][property];
  }
  else {
    sortBySubProperty(objArray, property, subProperty, true);
    return objArray[0][property][subProperty];
  }
}

// Looks through all objects in objArray and sums up 'property' (or 'property.subProperty').
function getSum(objArray, property, subProperty = false) {
  let sum = 0;
  if (!subProperty) {
    for (let i of objArray) {
      sum += i[property];
    }
  }
  else {
    for (let i of objArray) {
      sum += i[property][subProperty];
    }
  }
  return sum;
}

// Looks through all objArray in objList and looks at 'property' (or 'property.subProperty').
// Returns the average.
function getAverage(objArray, property, subProperty = false) {
  return getSum(objArray, property, subProperty) / objArray.length;
}

// Helper function returning the average of the numbers in an array.
function average(nums) {
    return nums.reduce((a, b) => (a + b)) / nums.length;
}

// Returns the value at a given percentile in a sorted numeric array.
// "Linear interpolation between closest ranks" method
// Code from https://gist.github.com/IceCreamYou/6ffa1b18c4c8f6aeaad2
function percentile(arr, p) {
    if (arr.length === 0) return 0;
    if (typeof p !== 'number') throw new TypeError('p must be a number');
    if (p <= 0) return arr[0];
    if (p >= 1) return arr[arr.length - 1];

    var index = (arr.length - 1) * p,
        lower = Math.floor(index),
        upper = lower + 1,
        weight = index % 1;

    if (upper >= arr.length) return arr[lower];
    return arr[lower] * (1 - weight) + arr[upper] * weight;
}

// Returns the percentile (as a decimal) where the array value first
// becomes positive. Assumes that the array is sorted.
function getPositiveThreshold(arr) {
  if (!arr.length)
    throw('Cannot get non-zero threshold: provided variable is not array or empty.');
  for (let i in arr) {
    if (arr[i] > 0)
      return i/arr.length;
  }
  return 1;
}

/**
 * Miscellaneous helper functions.
 */

// Copies an object or an array. Deep copies, but no methods.
function copy(object) {
  return JSON.parse(JSON.stringify(object));
}

/**
 * Stores an object in the cache, to use in future game iterations. Identified by 'key'.
 */
function setCache(key, value) {
  if (!BPTstatic.cache)
    BPTstatic.cache = {};
  BPTstatic.cache[key] = value;
}

/**
 * Returns a cached object, identified by 'key', or undefined if it is not cached.
 * Cached objects are kept between game iterations.
 */
function getCache(key) {
  if (!BPTstatic.cache) {
    BPTstatic.cache = {};
    return undefined;
  }
  return BPTstatic.cache[key];
}

// Returns the agent with the matching id or false if none is found.
function getAgentById(id) {
  if (!gameState.agents)
    return false;
  return new ObjectFilter({id: id}).findFirstInArray(gameState.agents);
}

/**
 * Returns the first agent in the list of agents, and moves it last in the list.
 */
function getAndRotateFirstAgent() {
  let agent = gameState.agents[0];
  gameState.agents.shift();
  gameState.agents.push(agent);
  return agent;
}

// Returns an array of tracked data for the given property. Adds zeroes when needed.
function getTrackedData(property) {
  let output = [];
  for (let a of gameState.agents) {
    if (!a.tracking || !a.tracking[property])
      output.push({
        increaseCount: 0,
        increaseSum: 0,
        decreaseCount: 0,
        decreaseSum: 0,
        unchangedCount: 0,
        count: 0,
        sum: 0,
      });
    else
      output.push(a.tracking[property]);
  }
  return output;
}

// Selects a and returns a random element from an array. If the array consists of
// objects, 'property' can be set to a property name in order to use the property
// values for weighting probability.
function selectRandom(arr, property = false) {
  let l = arr.length;
  if (!property) {
    return arr[Math.floor(Math.random()*l)];
  }

  let selectionArray = [];
  let sum = 0;
  for (let o of arr) {
    selectionArray.push(sum);
    sum += o[property];
  }
  let selection = Math.random() * sum;
  for (let i = l; i > -1; i--) {
    if (selection > selectionArray[i])
      return arr[i];
  }
}

/**
 * Returns an array of the straights found in an array of values, eg.
 * [[2, 3, 4], [6], [10, 11]]. The straights are sorted by value, ascending.
 * 
 * @param {array} values: An array with integer values.
 * @param {integer} lowest: The lowest value to check for.
 * @param {integer} highest: The highest value to check for.
 */
function getStraights(values, lowest, highest) {
  let straights = [];
  if (lowest === undefined)
    lowest = Math.min(...values);
  if (highest === undefined)
    highest = Math.max(...values);
  for (let i = lowest; i <= highest; i++) {
    let straight = [];
    while (values.includes(i) && i <= highest) {
      straight.push(i);
      i++;
    }
    if (straight.length)
      straights.push(straight);
  }
  return straights;
}

/**
 * Returns the longest straight found in an array of values, for example [2, 3, 4].
 * If several longest are found, the highest is returned.
 * 
 * @param {array} values: An array with integer values.
 * @param {integer} lowest: The lowest value to check for.
 * @param {integer} highest: The highest value to check for.
 */
function getLongestStraight(values, lowest, highest) {
  let straights = getStraights(values, lowest, highest);
  if (straights.length == 0)
    return [];
  sortByProperty(straights, 'length', false);
  return straights[0];
}

/**
 * Looks through the properties of an object and returns the property
 * with the highest numerical value. If several have the highest value,
 * a random of these are returned.
 */
function getHighestProperty(obj) {
  let max = Number.NEGATIVE_INFINITY;
  let properties = [];
  for (let p in obj) {
    if (typeof(obj[p]) == 'number' && obj[p] >= max) {
      if (obj[p] > max) {
        properties = [];
        max = obj[p];
      }
      properties.push(p);
    }
  }
  if (properties.length == 0) return false;
  return selectRandom(properties);
}

// Returns the cartesian distance between point A and B, using the coordinates provided
// in the 'coordinates' array. If B is false, distance to the origin (0) will be returned.
function getDistance(pointA, pointB = false, coordinates) {
  if (!pointB) {
    pointB = {};
    for (let c in coordinates)
      pointB[c] = 0;
  }
  let a = 0;
  for (let c of coordinates)
    a += Math.pow(pointA[c] - pointB[c], 2);
  return Math.sqrt(a);
}

/**
 * Internally used helper functions.
 */

/**
 * Combines default values and overwrite values, bypassing problems with empty strings.
 */
function applyDefaults(defaults, overwrites) {
  let result = {};
  Object.assign(result, defaults);
  Object.assign(result, overwrites);
  for (let i in defaults)
    if (result[i] === '') result[i] = defaults[i];
  return result;
}

/**
 * Processes arguments object into an array, skipping the number of specified first items.
 */
function parseArguments(args, skip = 0) {
  for (let i = 0; i < skip; i++)
    Array.prototype.shift.apply(args);
  return args;
}

/**
 * Checks whether two objects are similar when JSON-stringified.
 */
function compareObjects(o1, o2) {
  if (JSON.stringify(o1) == JSON.stringify(o2))
    return true;
  return false;
}

/**
 * Calls a resolver for a given type of object. Any parameters passed
 * after type and method will be passed to the resolver.
 *
 * @param {string} type: The type of object: cards, spaces or goods.
 * @param {string} method: The name of the resolver method.
 */
function callResolver(method) {
  if (!method)
    return false;

  if (!modules[module].resolvers) {
    log('Active module does not have any resolvers.', 'error');
    return false;
  }
  if (!modules[module].resolvers[method]) {
    log('Active module does not have a resolver ' + method + '.', 'error');
    return false;
  }

  return modules[module].resolvers[method](...parseArguments(arguments, 1));
}
