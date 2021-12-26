/**
 * Resolver methods for goods. Property 'resolver' on goods should
 * correspond to a method defined here.
 * Arguments are fetched dynamically from goods.resolver(goodsId, resources, arg1, arg2...)
 * and passed on.
 */

/**
 * @Examples: Just logs the card data.
 * @param {Card} card: The card object.
 */
goodsResolvers.example = {};
goodsResolvers.example.attackBooster = function(agent) {
  agent.trackChange('attackBoosters', 1);
  log(a.id + ' bought an attack boster.', 'example');
}
goodsResolvers.example.healing = function(agent) {
  agent.trackChange('hitPoints', 2);
  log(a.id + ' bought healing.', 'example');
}
