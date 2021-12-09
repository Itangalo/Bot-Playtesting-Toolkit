/**
 * @file: Helper functions dealing with general JavaScript stuff.
 */

/**
 * Helper functions for randomness.
 */

// Selects a random element from an array. If property is set, the
// property value will be used for weighting probabily.
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
 * Helper functions handling arrays.
 */

// Used for sorting an array of objects by an object property.
function sortByProperty(objArray, property, ascending = true) {
  if (ascending)
    objArray.sort((a, b) => a[property] > b[property] ? 1 : -1);
  else
    objArray.sort((a, b) => b[property] > a[property] ? 1 : -1);
}

// Used for sorting an array of objects by a sub property.
function sortBySubProperty(objArray, property, subProperty, ascending = true) {
  if (ascending)
    objArray.sort((a, b) => a[property][subProperty] > b[property][subProperty] ? 1 : -1);
  else
    objArray.sort((a, b) => b[property][subProperty] > a[property][subProperty] ? 1 : -1);
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
    sortBy(objArray, property, true);
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

/**
 * Miscellaneous helper functions.
 */

/**
 * Builds an array of objects with data taken from spreadsheet, one object for each row.
 * By default the first row is used for property names. Can be overridden by columnMapping.
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
 * cell has content on the form 'propertyName: value'. If 'valueSeparator' is provided, all
 * values brackeded by [] will be split into an array using the separator. Values (also arrayed)
 * are processed: trimmed and turned into floats if possible. Property names are trimmed.
 * @param {String} sheetName: The name of the sheet to collect data from.
 * @param {String} range: The range, in a format accepted by Google spreadsheet.
 * @param {String} propertySeparator: A string separating property name from value(s). Defaults to colon.
 * @param {String} valueSeparator: If provided, array values will be split into arrays using this as separator.
 */
function buildObjectFromLine(sheetName, range, propertySeparator = ':', valueSeparator = false) {
  let data = SpreadsheetApp.getActive().getSheetByName(sheetName).getRange(range).getValues();
  // Make a column into a row.
  if (data.length > 1)
    data = transpose(data);
  // Only take first row.
  data = data[0];

  let obj = {};
  for (let i of data) {
    let d = i.split(propertySeparator);
    if (d.length > 2)
      throw('Cell contains the property separator multiple times. Range: ' + range);
    let p = processValue(d[0]);
    let v = processValue(d[1]);
    if (valueSeparator && v[0] == '[' && v[v.length-1] == ']') {
      v = v.substring(1, v.length-1);
      v = v.split(valueSeparator);
      v = v.map(processValue);
    }
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
      mapping[properties[i]] = 1 + parseInt(i);
    }
  }
  let objArray = [];
  for (let row of data) {
    let obj = {};
    for (let property in mapping) {
      let value = row[-1 + mapping[property]];
      if (typeof(value) == 'string')
        value = value.trim();
      obj[property] = value;
    }
    objArray.push(obj);
  }
  return objArray;
}

/**
 * Trims strings and turn numeric-like values into floats.
 */
function processValue(value) {
  if (!value)
    return value;
  if (typeof(value) == 'string') {
    value = value.trim();
  }
  if (!isNaN(value)) {
    value = parseFloat(value);
  }
  return value;
}
