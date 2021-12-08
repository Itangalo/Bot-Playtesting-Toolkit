/**
 * Temporary stuff used while developing.
 */

function tmp() {
  let mapping = {
    title: 1,
    value: 2,
    colour: 3,
  }
  let t = buildObjectArrayFromRows('Sheet1', 'A2:C6');
  let agent = new Agent('test', t, 'default');
  agent.consultStrategy('log');
}
