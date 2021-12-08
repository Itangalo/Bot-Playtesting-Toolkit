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
  debugger
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

// Shoffles an array.
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

// Builds and returns an object with properties/values specified in an array of data.
// The array either contains property name and value in sub arrays, or has them combined
// in a string with a given separator. Values will be trimmed and also converted to numbers if possible.
function buildObject(data, separator = false) {
  // If we have a single array with property name and value mixed, split them up and call again.
  if (separator !== false) {
    d = [];
    for (i in data) {
      if (typeof(data[i]) == 'array') {
        data[i] = data[i][0];
      }
      t = data[i].split(separator);
      d.push([t[0], t[1]]);
    }
    return buildObject(d);
  }

  // Build an object and add the values.
  o = {};
  for (i in data) {
    property = data[i][0];
    if (typeof(property) == 'string') {
      property = property.trim();
    }
    value = data[i][1];
    if (typeof(value) == 'string') {
      value = value.trim();
    }
    if (!isNaN(value)) {
      value = parseFloat(value);
    }
    o[property] = value;
  }
  return o;
}

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
  if (!columnMapping) {
    columnMapping = {};
    let properties = data.shift();
    debugger
    for (let i in properties) {
      columnMapping[properties[i]] = 1 + parseInt(i);
    }
  }
  let objArray = [];
  for (let row of data) {
    let obj = {};
    for (let property in columnMapping) {
      let value = row[-1 + columnMapping[property]];
      if (typeof(value) == 'string')
        value = value.trim();
      obj[property] = value;
    }
    objArray.push(obj);
  }
  return objArray;
}

/**
 * Parses values in an array: Trims any strings and turns numbers to floats.
 */
function washArray(arr) {
  for (let i in arr) {
    if (typeof(arr[i]) == 'string') {
      arr[i] = arr[i].trim();
    }
    if (!isNaN(arr[i])) {
      arr[i] = parseFloat(arr[i]);
    }
  }
}

// Transpose an array/matrix.
// From https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
function transpose(arr){
  arr = arr[0].map((_, colIndex) => arr.map(row => row[colIndex]));
  return arr;
}
