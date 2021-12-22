/**
 * Class for managing markets for buying goods.
 * 
 * @param {object} marketData: An object with properties to transfer to
 * the market object. Some special properties:
 *    - id: The identifier for the market. Required.
 *    - resources: An array with IDs for resources the market consumes. Required.
 *    - restockOnlyIncreases: If true, restocking never decreases quantity.
 * 
 *
 * @param {Array} goodsArrayData: An array with one object for each goods type that
 * can be bought on the market. ID will be used as property name. Some special properties:
 *    - id: The unique id for the goods type. Will be used as property name under market.goods.
 *    - [resource]: Any property matching a resource ID will be interpreted
 *      as a cost. Several resources may be present for a combined cost.
 *    - any: Will be interpreted as a cost that can be paid with any resource
 *      type.
 *    - anyButSame: Will be interpreted as a cost that can be paid with any
 *      resource type, but all must be of the same type.
 *    - quantity: Set to an integer to limit the amount of that type of goods.
 *      Defaults to infinite.
 *    - maxQuantity: Set to an integer to cap the possible amount of the goods type.
 *    - resolver: Name of a method in the goodsResolver object. Called
 *      through market.resolve(goodsId, arguments...).
 */
class Market {
  constructor(marketData, goodsArrayData) {
    for (let p in marketData) {
      this[p] = marketData[p];
    }
    this.goods = {};
    for (let g of goodsArrayData) {
      this.goods[g.id] = g;
      if (!g.quantity && g.quantity !== 0)
        g.quantity = Number.POSITIVE_INFINITY;
      if (!g.maxQuantity)
        g.maxQuantity = Number.POSITIVE_INFINITY;
      g.initialQuantity = g.quantity;
    }
  }

  // @TODO: Add method for adding goods.

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
   * resourceType:AvailableAmount.
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
   * resourceType:AvailableAmount.
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
   * Buys goods (1 piece), calls any resolver, and returns resource balance for buyer.
   * 
   * @param {string} goodsId: The ID for the goods type.
   * @param {object} resources: An object with properties on the form
   * resourceType:AvailableAmount.
   */
  buy(goodsId, resources) {
    let b = this.getBalance(goodsId, resources);
    if (b === false) {
      log('Tried to buy goods type ' + goodsId + ' but this is not possible.', 'error');
      return false;
    }
    // Prepare and call any resolver for the goods type.
    let args = parseArguments(arguments, 2);
    this.resolve(goodsId, ...args);
    this.goods[goodsId].quantity--;
    return b;
  }

  /**
   * Calls any resolver set for a goods type, in the active module.
   * Any parameters passed after the goods ID will be passed on to the
   * resolver.
   */
  resolve(goodsId) {
    if (!this.goods[goodsId].resolver)
      return false;
    if (!goodsResolvers[module] || !goodsResolvers[module][this.goods[goodsId].resolver])
      throw('Tried to call goods resolver ' + this.goods[goodsId].resolver + ' but it does not exist in module ' + module + '.');
    let args = parseArguments(arguments, 1);
    goodsResolvers[module][this.goods[goodsId].resolver](...args);
  }
}
