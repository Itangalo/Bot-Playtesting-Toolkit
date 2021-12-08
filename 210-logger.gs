/**
 * @file: Handles log outputs.
 */

function log(message, type) {
  // Only message types set to true will be printed.
  const onOff = {
    rounds: true,
    notice: true,
    test: true,
    statistics: true,
    errors: true,
  };

  if (onOff[type]) {
    Logger.log(message);
  }
}
