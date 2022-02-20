/**
 * Class for creating, manipulating and printing matrices of strings, for example to print
 * simple representations of a game board.
 * 
 * @param {number} rows: The number of rows for the table.
 * @param {number} columns: The number of columns for the table.
 * @param {string} defaultString: Initial content of each cell. Defaults to '·'.
 * @param {string} separator: String to separate each cell with when printed out. Defaults to a space.
 *
 * Conditions are added as either AND or OR conditions. The filter is fulfilled if all
 * AND condition are fulfilled and, if any are present, at least one OR condition.
 * The and() and or() methods tell the filter how to treat upcoming conditions. Default is AND.
 */
class Table {
  constructor(rows, columns, defaultString = '·', separator = ' ') {
    this.content = new Array();
    for (let i = 0; i < rows; i++)
      this.content.push(new Array(columns).fill(defaultString));
    this.separator = separator;
    this.lineBreak = '\r\n';
    this.offset = -1; // Used to make the matrix 1-indexed.
  }

  // Sets the value for the given row and column.
  setValue(row, column, value) {
    this.content[row + this.offset][column + this.offset] = value;
  }

  getPrintVersion() {
    let output = '';
    for (let row of this.content)
      output += row.join(this.separator) + this.lineBreak;
    return output;
  }
}

function tmp() {
  let m = new Table(5, 13);
  m.setValue(2, 3, '-')
  debugger
  Logger.log(m.getPrintVersion())
}
