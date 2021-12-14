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
    system: true,
    errors: true,
  };
  const showTimestamps = true;

  if (onOff[type]) {
    if (showTimestamps)
      message += ' (time: ' + getTime() + ')';
    Logger.log(message);
  }
}

function getTime(label) {
  return Date.now() - global.startTime;
}
