/**
 * @file: Handles log outputs.
 * 
 * @TODO: Allow module to overwrite values, instead of hacking this file.
 */

/**
 * Outputs log messages, if the flag for the message type is on.
 * 
 * @param {string} message: The message to display.
 * @param {string} type: The type of log message, used for restricting actual output.
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
  // If true, log messages will also show how long time has passed since the script started.
  const showTimestamps = true;

  if (onOff[type]) {
    if (showTimestamps)
      message += ' (time: ' + getTime() + ')';
    Logger.log(message);
  }
}

/**
 * Measures how many milliseconds has passed since the script started.
 */
function getTime(label) {
  return Date.now() - global.startTime;
}
