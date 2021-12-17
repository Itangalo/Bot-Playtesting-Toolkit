# Board game scripting tools

A toolkit for simulating board games with Google spreadsheets. Intended use is board game development.

The idea behind this project is as follows:

* You're building a board game. To complement human play testing you want a lot of quantitative data. This project aims towards having bots playing your game hundreds or thousands of times, spitting out statistics over game results.
* To make this happen, you add data to a Google spreadsheet _and_ write code.
* The framework/toolbox provided by this project does the heavy lifting for (algorithmically) simple games. More complex games will require more custom code.
* The code you write is put in a "module", keeping it separate from the framework (and making it swappable). It contains five parts of code:
  * buildInitialData: This sets up global static data and also data that describes the initial game state. (Describing cards, board spaces, player stats, etc.) The framework provides handy functions for reading data from the spreadsheet.
  * preIteration: This does any extra processing of the game state before each simulated game iteration is run. ("Remove three cards from deck X" and the like.)
  * playRound: This is the most central code, playing each round in the game. For complex games, this will most likely be split up into more functions.
  * gameOver: This function looks at the game state and tells whether the game is over or not.
  * buildStatistics: This function takes the game state and extracts whichever information should be included in overall statistics. (Number of rounds played, how many cards have been drawn in total, etc.)
* Players are called "agents" in the framework. The module can provide several different strategies that agents could use.
* To make it easier to take care of special effects of cards and board/track spaces, the module can also provide "resolvers" for cards and board/track spaces. This allows calling the special code easily, keeping each resolver function separate from one another, and also saves you the headache of a gazillion of if statements.
* When the code is run, it plays the game the stated number of times and outputs statistics in a nice table. If called from the coding environemnt the results are shown in the log. If called from the spreadsheet the results show up in the sheet.

More documentation and code is coming. Comments and ideas are welcome.
