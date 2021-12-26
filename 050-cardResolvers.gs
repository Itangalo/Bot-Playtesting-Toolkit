/**
 * Resolver methods for cards. Property 'resolver' on cards should
 * correspond to a method defined here.
 * Arguments are fetched dynamically from card.resolver(arg1, arg2...)
 * and passed on.
 */

cardResolvers.example = {};
cardResolvers.example.heal = function(card, agent) {
  agent.trackChange('hitPoints', 2);
  log(a.id + ' draws a two and heals 2 hit points.', 'example');
}
cardResolvers.example.income = function(card, agent) {
  agent.trackChange('gold', 1);
  log(a.id + ' draws a face card and gains one gold.', 'example');
}
