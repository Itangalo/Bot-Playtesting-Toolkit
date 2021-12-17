/**
 * Takes an array with results from each game iterations. Outputs processed and
 * formatted results to the log and returns an array processed results that should
 * be displayed in the spreadsheet.
 */
function processResults(results) {
  /**
   * Process and display + return data.
   */

  // Sort results. (Needed for percentiles.)
  var sortedResults = {};
  for (let i in results[0]) {
    sortedResults[i] = [];
  }
  for (let i in results) {
    for (let j in results[i]) {
      sortedResults[j].push(results[i][j]);
    }
  }
  for (let i in sortedResults) {
    sortedResults[i].sort(function(a, b) {return a - b;});
  }

  // Build log
  let message = 'DISTRIBUTION: average (percentile ';
  let values = [];
  for (let p of global.percentilesForStatistics) {
    values.push(p);
  }
  message += values.join(' | ') + ')\r\n---\r\n';
  for (let i in sortedResults) {
    message += i + ': ';
    message += average(sortedResults[i]).toFixed(2) + ' (';
    values = [];
    for (let p of global.percentilesForStatistics) {
      values.push(percentile(sortedResults[i], p).toFixed(2));
    }
    message += values.join(' | ') + ') Non-zero at ';
    message += getNonZeroThreshold(sortedResults[i]) + '\r\n';
  }
  log(message, 'statistics');

  // Build output array.
  let output = [['']];
  for (let i in sortedResults) {
    output[0].push(i);
  }
  output.push(['Average']);
  for (let i in sortedResults) {
    output[1].push(average(sortedResults[i]));
  }
  output.push(['Non-zero at']);
  for (let i in sortedResults) {
    output[2].push(getNonZeroThreshold(sortedResults[i]));
  }
  for (let p of global.percentilesForStatistics) {
    let line = ['percentile ' + p];
    for (let i in sortedResults) {
      line.push(percentile(sortedResults[i], p));
    }
    output.push(line);
  }
  return output;
}
