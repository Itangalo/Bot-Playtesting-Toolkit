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
  if (BPTstatic.logging.categories[type]) {
    if (BPTstatic.logging.showTimestamps)
      message += ' (time: ' + (Date.now() - BPTstatic.startTime) + ')';
    Logger.log(message);
  }
}
