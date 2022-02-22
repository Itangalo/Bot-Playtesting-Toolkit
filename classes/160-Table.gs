/**
 * Class for creating, manipulating and printing matrices of strings, for example to print
 * simple representations of a game board.
 * 
 * @param {number} rows: The number of rows for the table.
 * @param {number} columns: The number of columns for the table.
 * @param {string} emptyString: Content to print for empty cell. Defaults to '·'.
 * @param {string} separator: String to separate each cell with when printed out. Defaults to a space.
 */
class Table {
  constructor(rows, columns, emptyString = '·', separator = ' ') {
    this.content = new Array();
    this.emptyString = emptyString;
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
      return new Array(this.columns);
    else
      return new Array(this.content[0].length);
  }

  // Sets the value for the given row and column.
  setValue(row, column, value) {
    let t = this;
    let r = this.rowOffset + parseInt(row);
    let c = this.columnOffset + parseInt(column);
    if (r >= this.content.length || c >= this.content[0].length)
      throw('Table has size ' + this.content.length + '×' + this.content[0].length + ', but tried to set value at (' + r + ', ' + c + ').');
    this.content[r][c] = value;
    return this;
  }

  // Adds a new row at the end of the table.
  addRow() {
    this.content.push(this.getEmptyLine());
    this.rows++;
    return this;
  }

  // Adds a new column at the end of the table.
  addColumn() {
    for (let r of this.content)
      r.push(null);
    this.columns++;
    return this;
  }

  // Adds a header row on top of the content.
  addColumnHeaders(headers = []) {
    this.content.unshift(this.getEmptyLine());
    this.rowOffset++;
    for (let i in headers)
      this.setColumnHeader(parseInt(i) + 1, headers[i]);
    return this;
  }

  // Adds a header column to the left of the content.
  addRowHeaders(headers = []) {
    for (let i in this.content)
      this.content[i].unshift(null);
    this.columnOffset++;
    for (let i in headers)
      this.setRowHeader(parseInt(i) + 1, headers[i]);
    return this;
  }

  // Sets a column header.
  setColumnHeader(column, value) {
    this.setValue(0, column, value);
    return this;
  }

  // Sets a row header.
  setRowHeader(row, value) {
    this.setValue(row, 0, value);
    return this;
  }

  // Builds and returns a printout representation of the table.
  getPrintout() {
    let processed = copy(this.content);
    if (this.skipEmptyLines)
      for (let i in processed)
        while (compareObjects(processed[i], this.getEmptyLine()))
          processed.splice(i, 1);

    // Fill all empty cells with the emptyString.
    for (let r in processed)
      for (let c in processed[r])
        if (!processed[r][c])
          processed[r][c] = this.emptyString;

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
          let pre = Math.floor((lengths[c] - processed[r][c].length) / 2);
          let post = Math.ceil((lengths[c] - processed[r][c].length) / 2);
          if (this.adjustOutput == 'center')
            processed[r][c] = repString(pre) + processed[r][c] + repString(post);
          else if (this.adjustOutput == 'right')
            processed[r][c] = repString(pre + post) + processed[r][c];
          else
            processed[r][c] += repString(pre + post);
        }
      }
    }

    for (let i in processed)
      processed[i] = processed[i].join(this.separator);
    processed = processed.join(this.lineBreak);
    return processed;
  }
}
