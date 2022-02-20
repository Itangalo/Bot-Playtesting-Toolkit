/**
 * Class for creating, manipulating and printing matrices of strings, for example to print
 * simple representations of a game board.
 * 
 * @param {number} rows: The number of rows for the table.
 * @param {number} columns: The number of columns for the table.
 * @param {string} defaultString: Initial content of each cell. Defaults to '·'.
 * @param {string} separator: String to separate each cell with when printed out. Defaults to a space.
 */
class Table {
  constructor(rows, columns, defaultString = '·', separator = ' ') {
    this.content = new Array();
    for (let i = 0; i < rows; i++)
      this.content.push(new Array(columns).fill(defaultString));
    
    // Set some table properties.
    this.rows = rows;
    this.columns = columns;
    this.separator = separator;
    this.lineBreak = '\r\n';
    this.offset = -1; // Used to make the matrix 1-indexed.
  }

  // Sets the value for the given row and column.
  setValue(row, column, value) {
    this.content[row + this.offset][column + this.offset] = value;
  }

  // Builds and returns a printout representation of the table.
  getPrintout(adjust = true) {
    this.adjustedCells = copy(this.content);
    if (adjust) {
      // Get maximum length for all columns.
      let lengths = new Array(this.columns).fill(0);
      for (let c = 0; c < this.columns; c++) {
        for (let r = 0; r < this.rows; r++) {
          lengths[c] = Math.max(lengths[c], this.content[r][c].length);
        }
      }
      // Pad the cells.
      for (let c = 0; c < this.columns; c++) {
        for (let r = 0; r < this.rows; r++) {
          let padding = lengths[c] - this.content[r][c].length;
          this.adjustedCells[r][c] += new Array(padding + 1).join(' ');
        }
      }
    }

    let output = '';
    for (let row of this.adjustedCells)
      output += row.join(this.separator) + this.lineBreak;
    return output;
  }
}

function tmp() {
  let m = new Table(5, 13);
  m.separator = '';
  m.setValue(2, 3, 'hej');
  debugger
  Logger.log(m.getPrintout())
}
