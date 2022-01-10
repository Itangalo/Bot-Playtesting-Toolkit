/**
 * Temporary stuff used while developing.
 */

function tmp2() {
  let tData = buildObjectFromLine('testData', 'K2:K3');
  let sData = buildObjectArrayFromRows('testData', 'L2:M63');
  let track = new Track(tData, sData);
  
  let path = aStar(track.graph, track.heuristic, 0, 60);
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
