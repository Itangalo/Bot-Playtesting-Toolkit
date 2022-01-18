# The Market and Goods classes

The Market and Goods classes are primarily used when resources are used to buy items or convert into other resources. There are pre-built functionality to handle costs and purchase of goods, handling costs of wildcard resources, limiting the number of available goods and also restocking markets.

Goods can have **resolvers**, allowing them to trigger special-case effects.

Goods can currently only have a single cost. There are issues for allowing alternative costs as well as flexible costs in the issue queue for the Bot Playtesting Toolkit. There is also an issue for supporting selling goods.

## Creating Markets and Goods

Markets and goods are normally created in the module's `buildInitialData` function by populating the `gameStateSeed.markets` array. The array should be populated by objects on the following form:

    {
      market: marketData,
      goods: goodsDataArray,
    }

The goods data is usually built from data in a spreadsheet. The market data could also be fetched from a spreadsheet, but is often times so small that it also can be written directly in code. In the example below, both market and goods data are fetched from a spreadsheet.

![A screen shot with market and goods data in a spreadsheet](https://user-images.githubusercontent.com/262940/149500166-ec690915-974f-40f8-a346-5f0ae3886de7.png)

    let marketDataArray = buildObjectArrayFromColumns('mySheet', 'S2:T3'); // Builds an array, not a single object!
    let goodsDataArray = buildObjectArrayFromRows('mySheet', 'U2:AE9');

    gameStateSeed.markets = [];
    gameStateSeed.markets.push({
      market: marketDataArray[0],
      goods: goodsDataArray,
    });

Data stored in `gameStateSeed.markets` will automatically be used to create Markets and Goods objects before each game iteration. The markets will be stored under `gameState.markets[marketId]`. Goods are stored as an array at `gameState.markets[marketId].goods`.

Markets and goods can also be created from other places in the code by the statement `myMarket = new Market(marketData, goodsDataArray)` and `myGoods = myMarket.constructGoods(goodsData)`.

## Special properties

### Market properties

Markets must have the property `id` set. If the id matches the id of an agent, the market is assumed to belong to that agent is added to agent.market. (It is also available at gameState.markets[marketId].)

Markets must have the property `resources` set. This should be an array containing strings identifying each type of goods that can be used to buy things at the market.

The property `restockOnlyIncreases` determines whether restocking the market never should cause the number of goods to decrease. It defaults to `true`.

`myMarket.goods` is an object containing all the goods handled by the market (whether out of stock or not). Each good is found at `myMarket.goods[goodsId]`.

### Goods properties

Goods must have the property `id` set. If the id matches the identifier for a resource type, is treated as a way of converting resources into another resource.

The property `quantity` tells many units of the particular goods type is available at the market. Defaults to infinity.

The property `maxQuantity` limits how many units could ever be available at the market. Defaults to infinity.

Any property matching a `<resourceId>` will be treated as a cost for buying the goods.

The property `any` is used for specifying costs that could be paid with _any_ resource type handled by the market.

The property `anyButSame` is used for specifying costs that could be paid with _any_ resource type handled by the market, but where the resources must be the same (such as in trading 4:1 in Catan).

The property `resolver` can be set to any name of a function stored at `modules[module].resolvers.goods`. Calling goods.resolve(...arguments) will send off the request to the resolver function of the goods and return the result. If the goods has no resolver, `false` is returned.

`myGoods.quantity` holds how many units of the goods type is available at the market.

`myGoods.initialQuantity` is set to the number of units present when the market was created, and is the level used when restocking the market.

## Functions available for markets and goods

### myMarket.constructGoods()

`myMarket.constructGoods(goodsData)`

Creates a goods type and adds it to the market.

### myMarket.restock()

`myMarket.restock(goodsArray = false)`

Resets goods quantity to the initial amount. If an array of goods IDs are provided, only the listed goods types are restocked.

If `myMarket.restockOnlyIncreases == true`, restocking will never lower the available amount of goods.

### myMarket.setPrice()

`myMarket.setPrice(goodsId, price)`

Updates the cost for the given goods type. The price should be provided on the form `{resourceId1: 3, resourceId2: 1, ...}`. Omitted resource types are set to zero. Note that the price could also be updated directly on the goods object.

### myMarket.getPrice()

`myMarket.getPrice(goodsId)`

Returns the price for a goods type.

### myMarket.setQuantity()

`myMarket.setQuantity(goodsId, amount, relative = false)`

Sets the available quantity for a goods type. If relative is `true`, the amount is treated as a change relative to the current value instead of just the new value. The quantity will never go below zero or above `myGoods.maxQuantity`.

### myMarket.getQuantity()

`myMarket.getQuantity(goodsId)`

Returns the available amount of the goods type. Can also be read directly from the goods object.

### myMarket.getBuyableItems()

`getBuyableItems(resources)`

Returns an object describing what can be bought at the market for the provided resources. The object is on the following form:

    {
      goods1: {resource1: 4, resource2: 0, ...}
      goods2: {resource1: 2, resource2: 2, ...}
      goods5: {resource1: 1, resource2: 0, ...}
      ...
    }

The property names are the IDs for the goods that can be bought, and the following object is the balance describing how much would be left of each resource type after the purchase. Note that if the goods being bought itself is a resource type, this is reflected in the balance.

The `resources` argument could be an agent object, provided that the agent's resources are stored as properties directly on the agent object.

### myMarket.getBalance()

`myMarket.getBalance(goodsId, resources)`

Returns an object describing how much resources would be left if trying to buy the given goods with `resources`. Returns `false` if the goods cannot be bought. Both `resources` and the returned object is on the form {resource1: 4, resource2: 0, ...}.

The `resources` argument could be an agent object, provided that the agent's resources are stored as properties directly on the agent object.

### myMarket.buy()

`myMarket.buy(goodsId, agent, resolve = false)`

Buys one unit of the specified goods type and updates the resource balance for the purchasing agent. Returns `false` if the purchase could not be made and logs an error message.

Returns the goods object if the purchase goes through and `resolve` is `false`.

If `resolve` is set to `true`, any resolver for the goods will be called if the purchase goes through, and its result will be returned.

### myMarket.buyMultiple()

`myMarket.buyMultiple(goodsId, amount, agent, resolve = false)`

Buys `amount` goods of a type and updates the resource balance for the purchasing agent. Only performs the purchase if the full amount can be bought, otherwise `false` is returned and a notice message is logged.

Returns the goods object if the purchase goes through and `resolve` is `false`.

If `resolve` is set to `true`, any resolver for the goods will be called if the purchase goes through, and its result will be returned. The resolver will only be called once.

### myMarket.resolve()

`myMarket.resolve(goodsId, ...arguments)`

Calls any resolver set for the goods type in the active module. Any arguments provided after the goods ID will be sent to the resolver. The goods needs to have a the property `resolver` set and a corresponding method must be placed in `modules[module].resolvers.goods`. Note that the resolver also can be called from `myGoods.resolve()`.

### myGoods.resolve()

`myGoods.resolve(...arguments)`

Passes on work to any resolver function declared for the goods, along with any parameters. The goods needs to have a the property `resolver` set and a corresponding method must be placed in `modules[module].resolvers.goods`.
