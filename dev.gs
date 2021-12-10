/**
 * Temporary stuff used while developing.
 */

function tmp(gs) {
  // let a = buildObjectFromLine('agents', 'B21:B25');
  // let a = buildObjectFromLine('agents', 'C21:G21');
  // let a = buildObjectArrayFromRows('agents', 'A1:E4');
  // let a = buildObjectArrayFromColumns('agents', 'A11:D14');
  let agent = new Agent('test');
  let trackData = buildObjectArrayFromRows('track1', 'A1:B6');
  let track = new Track('track1', trackData, {assumePresent: true});
  track.moveAgent(agent, 2);
  debugger;
}
