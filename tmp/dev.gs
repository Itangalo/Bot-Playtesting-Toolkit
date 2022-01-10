/**
 * Temporary stuff used while developing.
 */

function tmp2() {
  let tData = buildObjectFromLine('testData', 'K2:K4');
  let sData = buildObjectArrayFromRows('testData', 'L2:M63');
  let track = new Track(tData, sData);
  
  track.setPawnSpace('test', '5x1');
  track.buildPath('test', '5x5');
  track.movePawn('test', 2);
  track.moveTowards('test', '1x1', 3);
  track.moveTowards('test', '5x7', 3);
  debugger
}

function tmp() {
  let graph = [
    [0, 0, 0, 2, 0],
    [2, 0, 2, 2, 0],
    [2, 2, 0, 6, 2],
    [0, 1, 0, 0, 0],
    [0, 0, 2, 0, 0],
  ];
  let heuristic = [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
  ]


  let start = 0;
  let goal = 4;

  let path = aStar(graph, heuristic, start, goal);
  debugger

  let d = new Deck({id: 'tmp'});
  debugger
}
