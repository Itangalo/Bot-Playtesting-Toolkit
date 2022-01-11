/**
 * @file: Contains tests for some functionality in the toolbox.
 *
 * Good when developing. May steal some time in execution, so if a script is
 * going slowly it _might_ help to delete this file.
 */

var tests = {};

tests.helpersGeneral = {};
tests.helpersGeneral.processValue = function() {
  if (processValue(' True ') !== true)
    return 'Boolean-ish values (true) are not parsed correctly.';
  if (processValue(' FALSE ') !== false)
    return 'Boolean-ish values (false) are not parsed correctly.';
  if (processValue(' test ') != 'test')
    return 'Strings are not trimmed correctly.';
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
  if (processValue('[]')[0] != '')
    return 'Empty arrays are parsed incorrectly.';
  if (processValue('[test,]')[1] != '')
    return 'Empty array values are parsed incorrectly.';
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
};
tests.helpersGeneral.buildObjectArrayFromColumns = function() {
  let d = buildObjectArrayFromColumns('testData', 'E7:H11');
  let d2 = buildObjectArrayFromRows('testData', 'E2:I5');
  if (JSON.stringify(d) != JSON.stringify(d2))
    return 'Matrix is not transposed correctly.'
  if (d.length != 3)
    return 'Incorrect number of objects.';
};
tests.helpersGeneral.buildObjectFromLine = function() {
  let d1 = buildObjectFromLine('testData', 'O2:O4');
  let d2 = buildObjectFromLine('testData', 'O6:Q6');
  if (JSON.stringify(d1) != JSON.stringify(d2))
    return 'Lines and rows are processed differently.';
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
}
tests.helpersGeneral.getNonZeroThreshold = function() {
  let a = [0, 0, 0, 0];
  if (getNonZeroThreshold(a) != 1)
    return 'getNonZeroThreshold does not work properly for zero-arrays.';
  a.push(1);
  if (getNonZeroThreshold(a) != .8)
    return 'getNonZeroThreshold does not work properly.';
  a.unshift(1);
  if (getNonZeroThreshold(a) != 0)
    return 'getNonZeroThreshold does not work properly for percentile 0.';
}
tests.helpersGeneral.getHighestProperty = function() {
  let o = {a: -3, b: -5, c: -3};
  let r = [];
  for (let i = 0; i < 10; i++)
    r.push(getHighestProperty(o));
  if (!r.includes('a') || !r.includes('c'))
    return 'getHighestProperty fails in selecting by random among shared highest properties.';
  o = {a: '1', b: '100'};
  if (getHighestProperty(o) !== false)
    return 'getHighestProperty handles objects without numerical properties incorrectly.';
}
// @TODO: Write tests for sortByProperty, sortBySubProperty, getMax, getMin,
// getSum and getAverage. Perhaps also selectRandom and percentile.

tests.deck = {};
// @TODO: Write tests for decks. And agents, and tracks. And dice rolls.

tests.track = {};
tests.track.gridMovement = function() {
  let tData = buildObjectFromLine('testData', 'K2:K4');
  let sData = buildObjectArrayFromRows('testData', 'L2:M63');
  let track = new Track(tData, sData);
  if (track.spaces[0].connectsTo[0] != '1x2')
    return 'Space connections are not properly turned into arrays.';
  if (track.graph[0][1] != 1)
    return 'Track graph is not created correctly.';
  if (track.graph[1][0] != 1)
    return 'Symmetric connections are not created correctly.';
  
  track.setPawnSpace('test', '5x1');
  track.buildPath('test', '5x5');
  if (track.pawnPaths['test'].length != 7)
    return 'Paths are not built correctly.';
  let space = track.movePawn('test', 2);
  if (space.id != '5x3')
    return 'Movements do not return new pawn space correctly.';
  if (track.pawnPaths['test'].length != 5)
    return 'Movements do not shorten the paths correctly.';
  space = track.movePawn('test', 10);
  if (space.id != '5x5')
    return 'Movements do not stop on the end of the path correctly.';
  space = track.moveTowards('test', '1x1', 3);
  if (space.id != '4x4' || track.pawnPaths['test'].length != 5)
    return 'MoveTowards does not update path correctly.'
  space = track.moveTowards('test', '5x7', 3);
  if (space !== false || track.pawnPaths['test'].length != 5)
    return 'Unreachable targets updates path, which it should not.';
};

tests.market = {};
tests.market.theLot = function() {
  let marketData = buildObjectArrayFromColumns('testData', 'S2:T4');
  let goodsData = buildObjectArrayFromRows('testData', 'U2:AE9');
  let m = new Market(marketData[0], goodsData);
  if (!compareObjects(m.resources, ['wood', 'clay', 'sheep', 'grain', 'ore']))
    return 'Markets are not built correctly.';
  let r = {
    wood: 1,
    clay: 1,
    sheep: 1,
    grain: 1,
    ore: 0,
  };
  if (!compareObjects(r, m.getPrice('house')))
    return 'getPrice is not working correctly.';
  let a = m.getPrice('ore');
  if (a.anyButSame != 4)
    return 'getPrice fails to catch costs of type "anyButSame".';
  a = m.getPrice('sheep');
  if (a.any != 2)
    return 'getPrice fails to catch costs of type "any".';
  r.clay = 0; r.ore = 1;
  let b = m.getBalance('house', r);
  if (b !== false)
    return 'Markets allows purchase when resources are missing.';
  r.clay = 1;
  b = m.getBalance('house', r);
  if (!b)
    return 'Markets disallows purchase when enough resources are provided.';
  b = m.getBalance('sheep', r);
  if (!b)
    return 'Markets handles any incorrectly. Disallows even when resources are provided.';
  b = m.getBalance('ore', r);
  if (b !== false)
    return 'Markets handles anyButSame incorrectly. Allows different resources.';
  r.sheep = 4;
  b = m.getBalance('ore', r);
  if (!b)
    return 'Markets handles anyButSame incorrectly. Disallows when resources are provided.';
  if (b.ore != 2)
    return 'Markets handles purchase of resources incorrectly. Returned resources are not increased.';
  if (m.getQuantity('house') != 5)
    return 'getQuantity is not working properly.';
  m.buy('house', r);
  if (m.getQuantity('house') != 4)
    return 'Markets do not decrease quantity on purchase correctly.';
  m.setQuantity('city', 5);
  m.restock(['city']);
  if (m.getQuantity('house') != 4)
    return 'Markets do not carry out selective restocking correctly.';
  if (m.getQuantity('city') != 5)
    return 'Markets do not respect restockOnlyIncreases.';
  m.restock();
  if (m.getQuantity('house') != 5)
    return 'Markets do not carry out restocking correctly.';
  m.setQuantity('city', 1, true);
  if (m.getQuantity('city') != 6)
    return 'Markets do not carry out relative quantity changes correctly.';
  m.setQuantity('city', 100);
  if (m.getQuantity('city') != 7)
    return 'Markets do not respect maxQuantity.';
  m.setQuantity('city', -100, true);
  if (m.getQuantity('city') != 0)
    return 'Markets do not respect 0 as lower quantity limit.';

}


function runTests() {
  log('== TEST RESULTS ==', 'tests');
  for (let i in tests) {
    log('## ' + i, 'tests');
    for (let j in tests[i]) {
      let errorMessage = tests[i][j]();
      if (!errorMessage)
        log(j + ': OK.', 'tests');
      else
        log(j + ': ERROR. ' + errorMessage, 'tests');
    }
  }
}
