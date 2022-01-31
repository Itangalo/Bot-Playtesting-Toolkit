# Using the Bot Playtesting Toolkit

If you model a board game with a computer program you will have to keep track of a lot of data describing how things in the game evolve – often called the **game state**. The program also has to know the **game rules**, such as how turn order works, when players are allowed to draw cards and how to determine when the game is over. In many cases it is also useful to talk about **game content**, such as effects of special cards and tiles, particular things that happen on certain spaces on the board, and things like that. (One could argue that game content from a theoretical point of view is just an extension of the game rules, but when modeling a board game it is useful to separate the two.)

Moreover: If your model should approximate humans playing the game in some realistic way, you need to have some kind of playing **strategy** implemented in the program. The rules tell how the game state ticks forward, but it does not tell what choices the players make.

Writing all this code can be fun and inspiring, but it also has potential to take a lot of time and cause frustration. The **Bot Playtesting Tookit** helps reducing the things you need to code, and also helps keeping a nice structure on the code you write.

The Bot Playtesting Toolkit (BPT) is built as scripts to run with [Google spreadsheets](https://sheets.google.com/). A lot of data for the game content can be kept and managed in spreadsheets, for example data for cards and player stats. Some of the data-heavy rules can also go into the spreadsheets, such as and board/map layout and data for game resources and things you can buy or build with them. This is complemented by code describing the game rules, written in the coding environment that comes with Google spreadsheets. The toolkit has designated functionality for writing player strategies, which is done in a way that makes it easy to swap one strategy for another. On top of that, the Bot Playtesting Toolkit gives you some nice functionality for logging messages and also takes care of some things outside the game model such as running a lot of game iterations plus storing and displaying statistics from the games.

The game-specific code is kept in a so-called _module_, making it easier to update the Bot Playtesting Toolkit without having to rewrite your own code.

## Getting started

If you want to try out BPT, these are good steps:

1. Make a [copy of the BPT spreadsheet template (v. 1.2)](https://docs.google.com/spreadsheets/d/1A8oDT3vX8Vmp8sLPuJUWkdaXtlPyG8c5h9lBO0KkKUc/copy). It includes all the scripts for BPT, as well as two example modules.
2. In the _extensions_ menu, click _apps script_ to open the coding environment. You will now see a lot of files in the left sidebar and some JavaScript code in the main window.
3. In the first file (already selected), click the _run_ button. This will run a simulation of the game _example1_, but more importantly it will open a dialogue where you can approve that the script reads from your Google spreadsheets. (This is required to be able to read from data from the spreadsheet, and there was no way of restricting access to only the current sheet. Sorry.)
4. Start experimenting. You will want to look in the examples files, as well as in the documentation here in the wiki.

If you like the Bot Playtesting Toolkit, and are used to working with version control, you will sooner or later want to install the Chrome extension [Google Apps Script GitHub Assistant](https://chrome.google.com/webstore/detail/google-apps-script-github/lfjcgcmkmjjlieihflfhjopckgpelofo). It allows working against a GitHub repository (such as this) in the Google apps script coding environment.

## Modules and the big picture

The Bot Playtesting Toolkit follows the overall flow described below when simulating games. At each step it calls some particular functions that hold the code that is specific for your game.

1. Some global variables are set up, mostly being empty. Which module (game) to use is determined, as well as how many iterations to run.
2. A 'seed' for the initial game state is stored. The seed is built by the function `buildInitialData()`, to a large degree by reading information from the spreadsheet. The function can also store any information that does not change within or between games in the `global` variable.
3. A first game session is prepared. Some parts of the initial game state seed are processed automatically, and any extra preparations are done by the function `preIteration()`. After this, the global variable `gameState` holds all the information of the game. The content of this object will be read and changed throughout the game iteration, representing how the game changes.
4. The function `gameOver()` is called. If it returns `false`, the game is _on_. The toolkit notes that a new round starts and calls `playRound()`, which is responsible for all the things happening to the game state while the game goes on. Then step 4 is run again. If `gameOver()` returns `true`, this game iteration is finished.
7. When the game is over, `buildStatistics()` is called. This function processes and collects any data from the game state that should be used for statistics, and returns it to the toolkit.
8. If the required number of game iterations has not yet been reached, the toolkit goes back to step 3 in this list.
9. When all game iterations are done, the stored data is processed and displayed with averages, selected percentiles and also the percentile where values go above zero.

The code you write to run your game is stored in a _module_. The module needs the following.

* An entry in the module object, for example `modules.myModule = {}`.
* An entry in the actual module for each of the functions mentioned above, such as `modules.myModule.buildInitialData = function() {...}`.

The Bot Playtesting Toolkit currently comes with two example modules, which help show how modules can be built and stored in a number of files to help navigating the code even when it grows. You could copy the files from one of these examples as a starting point.

Which module to use is set when calling the `simulate` function. Calling `simulate('myModule', 1000)`, for example, will run 1000 simulations of the game in `myModule`. If the simulate function is called from the spreadsheet, the result is output in the spreadsheet. If it is called from the coding environment, the result and log messages are displayed in the log window.

## Why Google spreadsheet?

Building BPT on Google spreadsheet brings some limitations, not least a maximum 30 seconds execution time. But it lowers the threshold for getting started. There might be a future version of BPT written in Python (or something else) and is run locally on your computer, allowing long execution times and more flexibility in how to read and output data.
