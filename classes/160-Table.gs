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
    this.defaultString = defaultString;
    this.rows = rows;
    this.columns = columns;
    for (let i = 0; i < rows; i++)
      this.content.push(this.getEmptyLine());

    // Set some table properties.
    this.separator = separator;
    this.lineBreak = '\r\n';
    this.adjustOutput = true;
    this.skipEmptyLines = false;
    this.rowOffset = -1; // Used to make the matrix 1-indexed.
    this.columnOffset = -1;
  }

  getEmptyLine() {
    if (!this.content.length)
      return new Array(this.columns).fill(this.defaultString);
    else
      return new Array(this.content[0].length).fill(this.defaultString);
  }

  // Sets the value for the given row and column.
  setValue(row, column, value) {
    this.content[this.rowOffset + parseInt(row)][this.columnOffset + parseInt(column)] = value;
    return this;
  }

  // Adds a header row on top of the content.
  addHeaderRow() {
    this.content.unshift(this.getEmptyLine());
    this.rowOffset++;
    return this;
  }

  // Adds a header column to the left of the content.
  addHeaderColumn() {
    for (let i in this.content)
      this.content[i].unshift(this.defaultString);
    this.columnOffset++;
  }

  // Sets a row header.
  setRowHeader(rowNumber, value) {
    this.setValue(rowNumber, 0, value);
    return this;
  }

  // Sets a column header.
  setColumnHeader(columnNumber, value) {
    this.setValue(0, columnNumber, value);
    return this;
  }

  // Builds and returns a printout representation of the table.
  getPrintout() {
    let processed = copy(this.content);
    if (this.skipEmptyLines)
      for (let i in processed)
        while (compareObjects(processed[i], this.getEmptyLine()))
          processed.splice(i, 1);

    if (this.adjustOutput) {
      // Get maximum length for all columns.
      let lengths = new Array(processed[0].length).fill(0);
      for (let c = 0; c < processed[0].length; c++) {
        for (let r = 0; r < processed.length; r++) {
          lengths[c] = Math.max(lengths[c], processed[r][c].length);
        }
      }
      // Pad the cells.
      for (let c = 0; c < processed[0].length; c++) {
        for (let r = 0; r < processed.length; r++) {
          let padding = lengths[c] - processed[r][c].length;
          processed[r][c] += new Array(padding + 1).join(' ');
        }
      }
    }

    for (let i in processed)
      processed[i] = processed[i].join(this.separator);
    processed = processed.join(this.lineBreak);
    return processed;
  }
}
