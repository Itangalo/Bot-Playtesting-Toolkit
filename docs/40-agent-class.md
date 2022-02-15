# The Agent class

Players, or other actors within the game, are called _agents_ in the Bot Playtesting Toolkit.

The most important feature of agents is that they may have _strategies_. By calling `agent.consultStrategy('myMethod', ...arguments)`, the named method _within the agent's strategy_ is called. The point of this is to allow writing different strategies, to test various game flows and also how strategies may compare against each other.

Another feature of agents is that there's a method for automatically tracking any changes to properties on the agent. Instead of running `agent.myProperty++`, you can call `agent.trackChange('myProperty', 1)`. This will not only change the value of myProperty, but also keep track of the changes. Records are stored at `agent.tracking.myProperty`, where you can read how many times the property has increased or decreased, and the total changes.

If any deck, track or market objects have an ID matching an agent ID, the deck/track/market is assumed to belong to that agent and will automatically be added to `agent.deck` (or .track/market) for the agent (as well as be accessible as a regular deck/track/market).

## Creating agents

Agents are normally created in the module's `buildInitialData` function by populating the `gameStateSeed.agents` array. An example from the simulation of No Thanks:

`gameStateSeed.agents = buildObjectArrayFromRows('noThanks', 'A2:C6');`

This statement reads the following data from the spreadsheet:
![A screen dump of the data A2:C6 in the spreadsheet.](https://user-images.githubusercontent.com/262940/149158745-8450c52a-efc0-461a-9dc8-5cd5cbc831f1.png)

Data put in `gameStateSeed.agents` will automatically be used to create agent objects before each iteration of the game.

Agents can also be created explicitly on the form `let agent = new Agent(agentData);`.

### Special properties

Agents must have the property `id` set.

If agents have a property name postfixed by 'Max' or 'Min' (i.e. `agent.myPropertyMax = 22`), the value will be used to set upper or lower limit to the property value. Note that this is only enforced when using the `trackChange` method, not when directly accessing the properties.

If an agent should be able to use strategies, it must have the `strategy` property set. The value must correspond to one of the available strategies in the module. (See also below.)

## Accessing agents

Agents are automatically added to `gameState.agents`. This is an _array_, not a general object as is the case with some other classes. Keeping the agents in an array allows shifting the order of the agents (for example to change turn order). Agents can be accessed through `gameState.agents` and there is also a `getAgentById(myId)` method used for fetching a particular agent.

## Functions available for agents

### myAgent.getRandomOpponent()

`myAgent.getRandomOpponent(filter)`

Returns one random agent which is not the current agent. The `filter` parameter can contain an ObjectFilter, which will add extra constraints on how the agent is selected.

### myAgent.makeFirstAgent()

Moves the agent first in the list of agents (and removes it from its previous place). See also the utility function `getAndRotateFirstAgent()`.

## Using strategies

The main purpose of strategies is to isolate game decisions in separate functions, to make the code more readable and make it easier to swap one strategy for another.

Here is one example from the No Thanks simulation.

    // Add an entry for agentStrategies to the module.
    modules.noThanks.agentStrategies = {};

    // Add base entries for the strategies.
    modules.noThanks.agentStrategies.random = {};
    modules.noThanks.agentStrategies.default = {};

    /**
     * Add strategy callbacks.
     */

    // This is a dummy strategy. It uses a 1/n chance of picking up the card, where
    // n is the number of markers the agent has.
    modules.noThanks.agentStrategies.random.pickOrPay = function(agent) {
      if (Math.random() < (1 / agent.markers))
        return pick(agent);
      else
        return pay(agent);
    };

    // Picks up the card if the number of markers is at least 1/3 of the card value,
    // or if the card fits a straight held by the agent.
    modules.noThanks.agentStrategies.default.pickOrPay = function(agent) {
      if (agent.markers == 0)
        return pick(agent);
      if (gameState.markers *3 >= gameState.decks.deck.display[0].value)
        return pick(agent);
      if (distanceFromStraight(agent) < 1)
        return pick(agent);
      return pay(agent);
    };

When the game simulation is run, the statement `agent.consultStrategy('pickOrPay')` will call the method corresponding to the strategy set by `agent.strategy` (in this case either `random` or `default`). Whenever a strategy method is called, the acting agent will be sent along as the first argument. Any extra arguments will be passed after this, so `agent.consultStrategy('myMethod', foo, bar)` will fit the receiving function `myMethod(agent, foo, bar)`.

New strategies may be added freely. Each strategy must have an entry in `modules.myModule.agentStrategies`.
