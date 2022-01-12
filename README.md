# Bot Playtesting Toolkit

This repository contains a toolkit for simulating board games with Google spreadsheets. The target group is board game developers who also knows some coding.

Sometimes images are better than words. Below is an example of when the Bot Playtesting Toolkit plays _No Thanks_.

![Part of log for simulation of No Thanks. Note the time (in milliseconds) in each log message.](https://user-images.githubusercontent.com/262940/149219184-ab73eb9e-2b17-43a7-8d3e-d7a0f0c43917.png)

Note that the time stamps in the log messages above show elapsed time in milliseconds.

![Statistics for 10,000 games of No Thanks, played according to a given strategy.](https://user-images.githubusercontent.com/262940/149214937-8b13ddd1-7a1c-4e96-8355-c2dce2bf0359.png)

Statistics for 10,000 games of No Thanks, played according to a given strategy.

## The idea

You're building a board game. At some point you get interested in getting quantitative data: How often does X occur? Will strategy A generally win over strategy B? Will changing a card or a rule in a particular way shorten the game, and if so, by how much?

These questions could be answered by playtesters, but it would take a lot of sessions to get reliable data. And the results will often lead to tweaking numbers in the game, to get things balanced in the way you want. Which will require even more playtesting. Playtesting that could be better spent on getting feedback on how the game feels, what parts are more or less engaging, what the players want more of, and things like that.

This project helps coding board game bots for playing your game. A lot. You will need to write some code, but the Bot Playtesting Toolkit has a lot of pre-made functions and an overall framework that saves you a lot of time and gives more structure to your work.

The idea is to have bot playtesting complementing human playtesting. Human time is precious. Computer clock cycles are cheap. Use human playtesters for the things computers can't do.

## How do I use the Bot Playtesting Toolkit?

Check out [the wiki](https://github.com/Itangalo/Bot-Playtesting-Toolkit/wiki).

The Bot Playtesting Toolkit is written as a script for Google spreadsheet. This brings some limitations (such as maximum 30 seconds execution time), but lowers the threshold for getting started. You combine data in a spreadsheet with custom code, and can either get game statistics in the script log or output to the spreadsheet.

Some features of the Bot Playtesting Toolkit:

* All code you write is kept in a "module". This makes it easier to update the main program when updates are available. It will also make it easier to compare different versions of your game, by having them in different modules.
* There are functions for easily reading data from the spreadsheet, for example for creating decks, complex player data or information about tracks or board spaces.
* When cards, spaces or other components (such as purchaseable items) causes special effects, the framework has built-in support for adding "resolvers". These are function names specified in the spreadsheet, which can be easily accessed in code (for example by calling ``card.resolve()``).
* Agents (the toolkit's name for players) have _strategies_. Whenever decisions needs to be made, ``agent.consultStrategy()`` calls any specified method in the agent's strategy. This allows separating code for each decision in the game, and also allows agents to shift strategies if need arises.
* The toolkit provides an overall flow of the game, and calls the module to alter the game state before each game is started, and during each round. It also asks the module whether the game is over or not. When it is over, the toolkit asks which data should be saved and presented in statistics.
* The toolkit runs as many iterations of the game as you wish, and then prints data for the results. The data is presented with averages, percentile values and a bit more.
* The toolkit also contains handy logging functionality, with time logging during execution as an extra option.


## How can I get started?

The Bot Playtesting Toolkit is not yet released for public use, but it is coming. With video guides and more.

To be sure to be notified when there is more to get, either subscribe to this repository here on GitHub or follow [my blog](https://creatingboardgames.wordpress.com/).
