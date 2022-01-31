/**
 * @file: Classes for markets and goods.
 */

/**
 * Class for managing markets for buying goods.
 * 
 * @param {object} marketData: An object with properties to transfer to
 * the market object. Some special properties:
 *    - id: The identifier for the market. Required.
 *    - resources: An array with IDs for resources the market consumes. Required.
 *    - restockOnlyIncreases: If true, restocking never decreases quantity. Defaults to true.
 * 
 *
 * @param {Array} goodsDataArray: An array with one object for each goods type that
 * can be bought on the market. ID will be used as property name. Some special properties:
 *    - id: The unique id for the goods type. Will be used as property name under market.goods.
 *    - <resource>: Any property matching a resource ID will be interpreted
 *      as a cost. Several resources may be present for a combined cost.
 *    - any: Will be interpreted as a cost that can be paid with any resource
 *      type.
 *    - anyButSame: Will be interpreted as a cost that can be paid with any
 *      resource type, but all must be of the same type.
 *    - quantity: Set to an integer to limit the amount of that type of goods.
 *      Defaults to infinite.
 *    - maxQuantity: Set to an integer to cap the possible amount of the goods type.
 *    - resolver: Name of a method in modules[module].resolver. Called
 *      through market.resolve(goodsId, arguments...).
 */

// @TODO: Consider a way to track agents' increase/decrease in resources when buying.
class Market {
  constructor(marketData, goodsDataArray = false) {
    // Add default settings, overwrite with provided data.
    Object.assign(this, applyDefaults(global.defaults.market, marketData));
    // Verify that an ID is present.
    if (this.id === undefined)
      throw('Markets must have an id property set.');

    // Add the market to gameState and, if relevant, to an agent with the same ID.
    if (gameState.markets === undefined)
      gameState.markets = {};
    gameState.markets[this.id] = this;
    let agent = getAgentById(this.id);
    if (agent) {
      agent.market = this;
    }

    // Additional processing just for markets.
    this.goods = {};
    if (goodsDataArray) {
      for (let g of goodsDataArray) {
        this.constructGoods(g);
      }
    }
  }

  /**
   * Creates a goods object and adds to the market.
   * @param {Object} goodsData: An object with any sets of property:value pairs.
   * @see class Goods.
   */
  constructGoods(goodsData) {
    let g = new Goods(goodsData, this);
    return g;
  }

  /**
   * Resets goods quantity to initial amount.
   *
   * @param {Array} goodsArray: If provided, only the listed goods are restocked.
   */
  restock(goodsArray = false) {
    if (goodsArray === false)
      goodsArray = Object.keys(this.goods);
    for (var g of goodsArray) {
      if (this.restockOnlyIncreases)
        this.goods[g].quantity = Math.max(this.goods[g].quantity, this.goods[g].initialQuantity);
      else
        this.goods[g].quantity = this.goods[g].initialQuantity;
    }
  }

  /**
   * Sets the price of a goods type.
   * 
   * @param {string} goodsId: The id for the goods type.
   * @param {object} price: An object with properties on the form
   * resourceType:cost.
   */
  setPrice(goodsId, price) {
    for (let r in price) {
      if (!this.resources.includes(r))
        throw('Tried to set price of ' + goodsId + ' but ' + r + ' is not a valid resource.');
      this.goods[goodsId][r] = price[r];
    }
  }

  // Gets the price for a goods type.
  getPrice(goodsId) {
    let price = {};
    for (let r of this.resources) {
      price[r] = this.goods[goodsId][r] || 0;
    }
    for (let r of ['anyButSame', 'any']) {
      if (this.goods[goodsId][r])
        price[r] = this.goods[goodsId][r];
    }
    return price;
  }

  /**
   * Sets the available quantity for a goods type.
   * 
   * @param {string} goodsId: The id for the goods type.
   * @param {number} amount: The new available quantity.
   * @param {boolean} relative: If true, change will be relative to current amount.
   */
  setQuantity(goodsId, amount, relative = false) {
    if (relative)
      this.goods[goodsId].quantity += amount;
    else
      this.goods[goodsId].quantity = amount;
    // Make sure the amount is withing boundaries.
    this.goods[goodsId].quantity = Math.max(this.goods[goodsId].quantity, 0);
    this.goods[goodsId].quantity = Math.min(this.goods[goodsId].quantity, this.goods[goodsId].maxQuantity);
    return this.goods[goodsId].quantity;
  }

  // Gets the quantity of a goods type.
  getQuantity(goodsId) {
    return this.goods[goodsId].quantity;
  }

  /**
   * Returns an object. Properties are each goods type possible to buy with
   * the provided resources. Values are the resources left if bought.
   * 
   * @param {object} resources: An object with properties on the form
   * resourceType:AvailableAmount. Can be an agent object.
   */
  getBuyableItems(resources) {
    let result = {};
    for (let i in this.goods) {
      let b = this.getBalance(i, resources);
      if (b)
        result[i] = b;
    }
    return result;
  }

  /**
   * Returns how much resources are left after buying the specified goods type.
   * Returns false if the resource cannot be bought.
   * 
   * @param {object} resources: An object with properties on the form
   * resourceType:AvailableAmount. Can be an agent.
   */
  getBalance(goodsId, resources) {
    if (this.goods[goodsId].quantity < 1)
      return false;
    let resourcesLeft = {};
    // Check that there is enough of standard resources.
    for (let r of this.resources) {
      if (!this.goods[goodsId][r] || this.goods[goodsId][r] <= resources[r])
        resourcesLeft[r] = resources[r] - this.goods[goodsId][r];
      else
        return false;
    }
    // Check that 'anyButSame' is satisfied. Take from the most abundant resource.
    if (this.goods[goodsId].anyButSame) {
      let p = getHighestProperty(resourcesLeft);
      if (resourcesLeft[p] >= this.goods[goodsId].anyButSame)
        resourcesLeft[p] -= this.goods[goodsId].anyButSame;
      else
        return false;
    }
    // Check that 'any' is satisfied. Shave from the most abundant resource.
    if (this.goods[goodsId].any) {
      for (let j = 0; j < this.goods[goodsId].any; j++) {
        let p = getHighestProperty(resourcesLeft);
        if (resourcesLeft[p] < 1)
          return false;
        else
          resourcesLeft[p]--;
      }
    }
    // Check if the bought goods is a resource. If so, increase resource inventory.
    if (this.resources.includes(goodsId))
      resourcesLeft[goodsId]++;

    return resourcesLeft;
  }

  /**
   * Buys goods (1 piece) and updates the resource balance for the buying agent.
   * 
   * @param {string} goodsId: The ID for the goods type.
   * @param {Agent} agent: The agent buying the goods.
   * @param {boolean} resolve: Whether to call the goods resolver, if any. Defaults to false.
   * 
   * @return: The result of the goods resolver or, if not called, the goods object.
   *    Returns false if the purchase could not be made.
   */
  buy(goodsId, agent, resolve = false) {
    if (!agent instanceof Agent)
      throw('Only agents may buy from the market.');
    let b = this.getBalance(goodsId, agent);
    if (b === false) {
      log(agent.id + ' tried to buy goods type ' + goodsId + ' but this is not possible.', 'error');
      return false;
    }
    // Update the balance.
    Object.assign(agent, b);
    this.goods[goodsId].quantity--;

    if (resolve) {
      let args = parseArguments(arguments, 3);
      return this.resolve(goodsId, ...args);
    }
    return this[goodsId];
  }

  /**
   * Buys 'amount' goods of a type and updates the resource balance for the buying agent.
   * Only performs the purchase if the full amount can be bought.
   *
   * @param {string} goodsId: The ID for the goods type.
   * @param {number} amount: The amount of goods to buy.
   * @param {Agent} agent: The agent buying the goods.
   * @param {boolean} resolve: Whether to call the goods resolver, if any,
   *    after _all_ goods are bought. Defaults to false.
   * 
   * @return: The result of the goods resolver or, if not called, the goods object.
   *    Returns false if the purchase could not be made.
   */
  buyMultiple(goodsId, amount, agent, resolve = false) {
    if (!agent instanceof Agent)
      throw('Only agents may buy from the market.');
    if (amount < 1)
      return false;
    let balance = {};
    for (let r of this.resources) {
      balance[r] = agent[r];
    }
    for (let i = 0; i < amount; i++) {
      balance = this.getBalance(goodsId, balance);
    }
    if (balance === false) {
      log(agent.id + ' tried to buy ' + amount + ' of goods type ' + goodsId + ' but this is not possible.', 'notice');
      return false;
    }
    // Update the balance.
    Object.assign(agent, balance);
    this.goods[goodsId].quantity -= amount;

    if (resolve) {
      let args = parseArguments(arguments, 4);
      return this.resolve(goodsId, ...args);
    }
    return this[goodsId];
  }
  /**
   * Calls any resolver set for the goods type in the active module.
   * Any arguments after the goods ID will be sent to the resolver.
   * The goods needs to have a the property 'resolver' set and a corresponding
   * method must be placed in modules[module].resolvers.
   * Note that resolver also can be called from goods.resolve().
   */
  resolve(goodsId) {
    if (!this[goodsId]) {
      log('Tried to call resolver for ' + goodsId + ' but the goods does not exist.', 'error');
      return false;
    }
    let args = parseArguments(arguments, 1);
    return callResolver(this[goodsId].resolver, ...args);
  }
}

/**
 * Class for managing goods, used in markets.
 */
class Goods {
  /**
   * @param {Object} goodsData: Any propery:value pairs that should be added to the goods.
   *  - id: The id of the goods. Can be a name of a resource. Will be used as property name under
   *    market.goods.Required.
   *  - [resource]: Any property matching a resource ID will be interpreted
   *    as a cost. Several resources may be present for a combined cost.
   *  - any: Will be interpreted as a cost that can be paid with any resource
   *    type.
   *  - anyButSame: Will be interpreted as a cost that can be paid with any
   *    resource type, but all must be of the same type.
   *  - quantity: Set to an integer to limit the amount of that type of goods.
   *    Defaults to infinite.
   *  - maxQuantity: Set to an integer to cap the possible amount of the goods type.
   *  - resolver: Name of a resolver method. Called through goods.resolve(arguments...)
   *    or market.resolve(goodsId, arguments...).
   * @param {Market} market: A market object, to which the goods should be added.
   */
  constructor(goodsData, market) {
    if (!market instanceof Market)
      throw('Goods must be added to a proper market.');
    // Add default settings, overwrite with provided data.
    Object.assign(this, applyDefaults(global.defaults.goods, goodsData));

    if (this.id === undefined)
      throw('Goods must have an id property set.');
    this.market = market;
    market.goods[this.id] = this;
    // Set quantity restrictions, if any.
    this.initialQuantity = this.quantity;
    
    return this;
  }

  /**
   * Passes on work to any resolver function declared for the goods,
   * along with any parameters. The goods needs to have a the property
   * 'resolver' set and a corresponding method must be placed in
   * modules[module].resolvers.
   */
  resolve() {
    return callResolver(this.resolver, ...arguments);
  }
}
