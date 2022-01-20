/**
 * @file: Handles log outputs.
 */

/**
 * Outputs log messages, if the flag for the message type is on.
 * 
 * @param {string} message: The message to display.
 * @param {string} type: The type of log message, used for restricting actual output.
 */
function log(message, type) {
  if (global.logging.categories[type]) {
    if (global.logging.showTimestamps)
      message += ' (time: ' + (Date.now() - global.startTime) + ')';
    Logger.log(message);
  }
}
