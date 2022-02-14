/**
 * @file: Resolver functions
 */

/**
 * Resolver methods for cards, goods or spaces. Property 'resolver' should correspond
 * to a method defined here. Arguments are fetched dynamically from the caller function,
 * for example card.resolver(arg1, arg2...), and passed on.
 */

modules.myModule.resolvers = {};

modules.myModule.resolvers.cards.heal = function(agent) {
  agent.trackChange('hitPoints', 2);
  log(agent.id + ' draws a two and heals 2 hit points.', 'example');
}
modules.myModule.resolvers.cards.income = function(agent) {
  agent.trackChange('gold', 1);
  log(agent.id + ' draws a face card and gains one gold.', 'example');
}
