/**
 * @file: Resolver functions
 */

/**
 * Resolver methods for cards, goods or spaces. Property 'resolver' should correspond
 * to a method defined here. Arguments are fetched dynamically from the caller function,
 * for example card.resolver(arg1, arg2...), and passed on.
 */

modules.myModule.resolvers = {};

modules.myModule.resolvers.myCardResolver1 = function(agent) {
  agent.trackChange('hitPoints', 2);
  log(agent.id + ' uses a card to heal 2 hit points.', 'example');
}
modules.myModule.resolvers.myCardResolver2 = function(agent) {
  agent.trackChange('gold', 1);
  log(agent.id + ' uses a card to gain 1 gold.', 'example');
}
