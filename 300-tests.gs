/**
 * @file: Contains tests for some functionality in the toolbox.
 *
 * Good when developing. May steal some time in execution, so if a script is
 * going slowly it _might_ help to delete this file.
 */

var tests = {};

tests.helpersGeneral = {};
tests.helpersGeneral.processValue = function() {
  if (processValue(' test ') != 'test')
    return 'Strings are not trimmed correctly.';
  if (processValue(' 1 ') + 1 != 2)
    return 'Integers are processed incorrectly.';
  if (processValue(' 1.1 ') + 1 != 2.1)
    return 'Floats are processed incorrectly.';
  if (processValue(' -1 ') + 1 != 0)
    return 'Negative numbers are processed incorrectly.';
  if (processValue('[test]', false) != '[test]')
    return 'Turning off conversion to arrays works incorrectly.';
  if (processValue('[test]')[0] != 'test')
    return 'Array parsing works incorrectly.';
  if (processValue('[[test]]')[0][0] != 'test')
    return 'Recursive array parsing works incorrectly.';
  debugger
  if (processValue('[]')[0] != '')
    return 'Empty arrays are parsed incorrectly.';
  if (processValue('[test,]')[1] != '')
    return 'Empty array values are parsed incorrectly.';
  return true;
};
tests.helpersGeneral.buildObjectArrayFromRows = function() {
  let d = buildObjectArrayFromRows('testData', 'A2:C54');
  if (d.length != 52)
    return 'Incorrect number of objects.';
  if (d[0].colour != 'spades')
    return 'Property names/values not read correctly.';
  d = buildObjectArrayFromRows('testData', 'A3:C54', {type: 1, v: 2, resolver: 3});
  if (d[20].type != 'hearts')
    return 'Property mapping is not working correctly.'
  return true;
};
tests.helpersGeneral.buildObjectArrayFromColumns = function() {
  let d = buildObjectArrayFromColumns('testData', 'E7:H11');
  let d2 = buildObjectArrayFromRows('testData', 'E2:I5');
  if (JSON.stringify(d) != JSON.stringify(d2))
    return 'Matrix is not transposed correctly.'
  if (d.length != 3)
    return 'Incorrect number of objects.';
  return true;
};
tests.helpersGeneral.buildObjectFromLine = function() {
  let d1 = buildObjectFromLine('testData', 'O2:O4');
  let d2 = buildObjectFromLine('testData', 'O6:Q6');
  if (JSON.stringify(d1) != JSON.stringify(d2))
    return 'Lines and rows are processed differently.';
  return true;
};
tests.helpersGeneral.arrayManagement = function() {
  let a = [1, 2, 19, 19, 19, 4, 5, 6, 20, 10, 11, 12, 20, 21];
  let b = [1, 2, 19, 19, 19, 4, 5, 6, 20, 10, 11, 12, 20, 21];
  shuffle(b);
  if (JSON.stringify(a) == JSON.stringify(b))
    return 'Array shuffling is not working properly';
  let c = [[1.0, 2.0], [4.0, 5.0, 6.0], [10.0, 11.0, 12.0], [19.0, 20.0, 21.0]];
  if (JSON.stringify(getStraights(b, 1, 21)) != JSON.stringify(c))
    return 'getStraights function is not working properly.';
  if (JSON.stringify(getLongestStraight(b, 1, 21)) != JSON.stringify([19, 20, 21]))
    return 'getLongestStraight is not working properly.'
  if (JSON.stringify(getLongestStraight(b, 1, 20)) != JSON.stringify([10, 11, 12]))
    return 'Limiting range in getLongestStraight is not working properly.'
  return true;
}
// @TODO: Write tests for sortByProperty, sortBySubProperty, getMax, getMin,
// getSum and getAverage. Perhaps also selectRandom and percentile.

tests.deck = {};
// @TODO: Write tests for decks. And agents, and tracks. And dice rolls.

function runTests() {
  log('== TEST RESULTS ==', 'tests');
  for (let i in tests) {
    log('## ' + i, 'tests');
    for (let j in tests[i]) {
      let result = tests[i][j]();
      if (result == true)
        log(j + ': OK.', 'tests');
      else
        log(j + ': ERROR. ' + result, 'tests');
    }
  }
}
