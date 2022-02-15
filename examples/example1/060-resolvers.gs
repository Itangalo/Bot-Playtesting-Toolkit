/**
 * @file: Resolver functions.
 */

/**
 * Resolver methods for cards. Property 'resolver' on cards should
 * correspond to a method defined here.
 * Arguments are fetched dynamically from card.resolver(arg1, arg2...)
 * and passed on.
 */

modules.example1.resolvers = {};

modules.example1.resolvers.heal = function(agent) {
  agent.trackChange('hitPoints', 2);
  log(agent.id + ' draws a two and heals 2 hit points.', 'example');
}
modules.example1.resolvers.income = function(agent) {
  agent.trackChange('gold', 1);
  log(agent.id + ' draws a face card and gains one gold.', 'example');
}

/**
 * Resolver methods for goods. Property 'resolver' on goods should
 * correspond to a method defined here.
 */

modules.example1.resolvers.attackBooster = function(agent) {
  agent.trackChange('attackBoosters', 1);
  log(agent.id + ' bought an attack boster.', 'example');
}
modules.example1.resolvers.healing = function(agent) {
  agent.trackChange('hitPoints', 2);
  log(agent.id + ' bought healing.', 'example');
}
