/**
 * Resolver methods for cards. Property 'resolver' on cards should
 * correspond to a method defined here.
 * Arguments are fetched dynamically from card.resolver(arg1, arg2...)
 * and passed on.
 */

modules.example1.resolvers = {};
modules.example1.resolvers.cards = {};

modules.example1.resolvers.cards.heal = function(card, agent) {
  agent.trackChange('hitPoints', 2);
  log(agent.id + ' draws a two and heals 2 hit points.', 'example');
}
modules.example1.resolvers.cards.income = function(card, agent) {
  agent.trackChange('gold', 1);
  log(agent.id + ' draws a face card and gains one gold.', 'example');
}
