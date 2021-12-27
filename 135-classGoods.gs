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
   *  - resolver: Name of a method in the goodsResolver object. Called
   *    through goods.resolve(arguments...) or market.resolve(goodsId, arguments...).
   * @param {Market} market: A market object, to which the goods should be added.
   */
  constructor(goodsData, market) {
    if (!market instanceof Market)
      throw('Goods must be added to a proper market.');

    Object.assign(this, goodsData);
    if (this.id === undefined)
      throw('Goods must have an id property set.');
    this.market = market;
    market.goods[this.id] = this;
    // Set quantity restrictions, if any.
    if (!this.quantity && this.quantity !== 0)
      this.quantity = Number.POSITIVE_INFINITY;
    if (!this.maxQuantity)
      this.maxQuantity = Number.POSITIVE_INFINITY;
    this.initialQuantity = this.quantity;
    
    return this;
  }

  /**
   * Passes on work to any resolver function declared for the goods,
   * along with any parameters. The space needs to have a the property
   * 'resolver' set and a corresponding method must be placed in
   * modules[module].resolvers.goods.
   */
  resolve() {
    callResolver('goods', this.resolver, ...arguments);
  }
}