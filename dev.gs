/**
 * Temporary stuff used while developing.
 */

function tmp() {
  let mapping = {
    title: 1,
    value: 2,
    colour: 3,
  }
  let t = buildObjectArrayFromRows(mapping, 'Sheet1', 'A3:C6');
  Logger.log(typeof(t));
  let deck = new Deck('test', t);
  debugger;
}
