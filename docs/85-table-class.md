# The Table class

The Table class is created to help make log outputs of a game board or some other part of the game state. The class manages text put in a table. It is only used to build and then print complex log messages – not to manipulate the game state.

![image](https://user-images.githubusercontent.com/262940/155134242-50cad38c-acde-4f73-acca-d45cab25b850.png)

_Example of table created using the Table class._

## Creating a table, setting values and printing table content

    myTable = new Table(rows, columns, defaultString = '·', separator = ' ')
    myTable.setValue(row, column, value)
    myTable.getPrintout()

A table is created by `let myTable = new Table(rows, columns)`, telling how many rows and columns the table should have. The table will be filled with a default string (set to '·' if not overridden) and each cell will be separated by another default string (space if not overridden).

Cell content is set by calling `myTable.setValue(row, column, value)`, which sets the value of the cell in a given row and column.

The function `myTable.getPrintout()` processes the table content and returns a string which can be output to the log.

## Using table headers

    myTable.addColumnHeaders(headers = [])
    myTable.setColumnHeader(column, value)
    myTable.addRowHeaders(headers = [])
    myTable.setRowHeader(row, value)

Headers can be added to the top of columns by using `myTable.addColumnHeaders(headers)`, where `headers` is an optional array of headers to add. Header for an individual column can also be set by calling `myTable.setColumnHeader(column, value)`. Setting headers for each row is done in the same way, with the sister functions.

## Other functions for tables

    myTable.addRow()
    myTable.addColumn()

The `addRow()` and `addColumn()` functions add a row or column to the end of the table.

## Special properties for tables

`myTable.rows` and `myTable.columns` contains the number of rows and columns for the table content.

`myTable.defaultString` contains the string to use for empty cells.

`myTable.separator` contains the string used for separating cells when printed out.

`myTable.lineBreak` contains the string to used when joining table rows in printouts.

`myTable.adjustOutput` can be set to `false` to _not_ have cells adjusted to the same widths on printouts. Set to `center` or `right` to have cell content centred or right-aligned.

`myTable.skipEmptyLines` can be set to `true` to skip any empty lines in printouts.
