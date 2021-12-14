/**
 * @file: Handles log outputs.
 */

function log(message, type) {
  // Only message types set to true will be printed.
  const onOff = {
    rounds: true,
    notice: true,
    example: true,
    statistics: true,
    tests: true,
    errors: true,
  };

  if (onOff[type]) {
    Logger.log(message);
  }
}
