# Introduction to the Bot Playtesting Toolkit

The Bot Playtesting Toolkit is intended to complement human playtesting of board games. Once you have coded a game simulation bots can play hundreds or thousands of games, generating quantitative data that human playtesting cannot really do. In this way, bots can help you balance numbers or evaluate effects of potential changes to the game, and human playtesting can focus on the more human (and arguably more important) aspects of game design – the experience of the game.

## When should the Bot Playtesting Toolkit _not_ be used?

Games are, as I see it, about _experiences_. This is exactly the thing the Bot Playtesting Toolkit cannot evaluate. No matter how good models you make of your game and how many simulations you run, the Bot Playtesting Toolkit cannot tell you whether the game is fun, rewarding, thought-provoking or in some other way worth playing.

Games that are heavily imbalanced or that have a clear dominant strategy, though, are often not fun to play. The Bot Playtesting Toolkit can help you examine and improve such aspects of your game. The toolkit can, thus, be viewed as a way of testing some but not all important aspects of the game you are creating.

Some other cases when you probably shouldn't use the Bot Playtesting Toolkit (BPT):

* If you don't know how to code. (Unless you don't want to spend a lot of time learning it – it's fun!)
* If your game is in early stages and its overall frame is still shifting. Coding a model of your game takes effort, and re-writing the model time and time again is usually not well spent time.
* If you don't have clear questions you want answers to. BPT _can_ be used for exploring the game in general, but unless you have a really good model of your game you risk finding stuff that are effects of your model rather than the actual game.
* If the answers you are after are not qualitative in nature. BPT spits out numbers. Many things can be represented by numbers, but not all.

## When might the Bot Playtesting Toolkit be useful?

Some examples of questions that the Bot Playtesting Toolkit might be good at answering:

* What are the chances of certain card combinations turning up on the starting hands? What are the chances of certain dice results, if players are allowed to re-roll according to certain rules? (Such well-delimited questions can be done as small isolated projects at early stages in game development, instead of writing a full model for a game.)
* How many rounds does a game typically last? What is the span of rounds, looking at percentile 5 to 95?
* How often does strategy A win over strategy B?
* How are some statistics in my game affected if I remove all cards with healing effects?
* How are some statistics in my game affected if I shift from D6 from D20, or customized dice?
* How are some statistics in my game affected if I shorten the distances on the board?

## Models, simulations and agent strategies

With the Bot Playtesting Toolkit you can build a _model_ of your boardgame. Depending on the type of game, it is very likely that the model will _not_ contain everything in the game. You might choose to ignore effects on 30 percent of your cards, because they don't play a big role in the things you want to evaluate. You might choose to ignore some actions players can do. You might ignore real-time restrictions. Or just leave some things out simply because they are difficult to include in the model.

The choices you make when you build your model decides in which ways you can use the results. BPT is a tool to use with other tools in board game development. If you get results that seem weird or contradict other experiences, it could very well be your model that needs fixing.

A particularly important part of the game model is the _strategies_ you write for the agents (players) in the game. Deep down the strategies are a bunch of `if` statements, telling an agent whether to do X or Y in the game. The strategies will never be better than the code you write, and they will be more rigid and less clever than human players. (Unless you want to try using things like artificial neural networks – feel free to help out in [issue #17](https://github.com/Itangalo/Bot-Playtesting-Toolkit/issues/17).)

The strategies used in your model will have flaws. Agents will make choices that seem stupid to experienced players, when the circumstances are right (or wrong). You will have to go for _good enough_, or spend so much time thinking about and coding strategies that the rest of your game development will stall. This is not necessarily a bad thing – if you find the perfect strategy, you have turned your game into a puzzle and also solved it. Playing it then risks becoming as boring as it is to the bots in the toolkit – follow the flowchart and do whatever pops out. That you cannot pin down every decision that could fit in a strategy means that you have a game that is still interesting to play.

The point is: All models are wrong. Some are useful.
