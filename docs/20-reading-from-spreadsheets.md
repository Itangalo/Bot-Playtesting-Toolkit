# Functions for reading data from spreadsheets

The Bot Playtesting Toolkit contains some functions that helps reading data from spreadsheets. They are primarily used when building the game state seed in `buildInitialData()`, but could be used elsewhere too. Reading data from the spreadsheet is a pretty slow process, though, so doing it inside game iterations could slow the simulations considerably.

Screen shot and code below gives a quick image of how the functions are used.

![Example of spreadsheet data turned into an array of objects.](https://user-images.githubusercontent.com/262940/149318379-8ee4ae08-f0a8-4816-9cf0-fca71a8bdc5a.png)

The data above parsed through `buildObjectArrayFromColumns('mySheet', 'E2:G7')` gives the following objects in an array:

    data[0] = {
      id: 'red',
      hitPoints: 10,
      gold: 0,
      attackBoosters: 0,
      strategy: 'offensive',
    };
    data[1] = {
      id: 'blue',
      hitPoints: 10,
      gold: 0,
      attackBoosters: 0,
      strategy: 'defensive',
    };

## buildObjectArrayFromRows()

`buildObjectArrayFromRows(sheetName, range, columnMapping = false)`

Example use: `buildObjectArrayFromRows('mySheet', 'A1:D29')`

This function turns a selected range in a spreadsheet into an array of objects, one object per line in the range. By default the first row is used as a header, becoming property names in the objects.

Values in the spreadsheet cells will be processed as follows:

* Any starting or trailing spaces will be trimmed.
* Any value that looks like a number (according to JavaScript) will be converted to a number.
* Any strings 'true' or 'false' will be converted to boolean values.
* Any values within [brackets] will be converted to arrays, with each value in the array further processed. There may be arrays within arrays.

An alternative to using the first row as headers and property names is to pass the `columnMapping` argument. It should be an object containing property names and corresponding column numbers on the form `{propOne: 6, propTwo: 1, ...}`. Note that the column mapping is _one-indexed_, so the first column has number 1 (not 0).

## buildObjectArrayFromColumns()

`buildObjectArrayFromColumns(sheetName, range, rowMapping = false)`

This function works just like `buildObjectArrayFromRows()`, but creates one object per column instead of per row.

## buildObjectFromLine()

`buildObjectFromLine(sheetName, range, propertySeparator = ':')`

This function works in the same way as `buildObjectArrayFromRows()` and `buildObjectArrayFromColumns()`, but reads data from a single line instead of a number of rows or columns. The line can either be a single row or column. This function can be a handy alternative when reading a single object, not a series of objects.

The property names and values are assumed to be separated by a colon, but the separator can be set to something different by using the `propertySeparator` argument. The values are processed in the same way as with the other functions for reading spreadsheet data, for example allowing array values.

![Example of single row with data.](https://user-images.githubusercontent.com/262940/149332072-b574057c-1f34-4cee-8ee3-ff3bad1be3b1.png)

Running `buildObjectFromLine('mySheet', 'K2:K4')` on the data in the image above gives the following object: `{id: 'basicTests', loop: false, assumePresent: false}`.
