/**
 * Used to process any data after the gameState has been created, but before the first iteration.
 * Optional.
 * 
 * Use setCache() to store data. Note that objects with methods (such as spaces, decks, etc.) can
 * not be cached.
 */

modules.myModule.postBuild = function(arg1, arg2) {
  // For example, do heavy processing of board data that does not change between iterations
  // and store the results as space indices.

  // let myProcessedData = {};
  // Heavy processing goes here...
  // setCache('processedBoardData', myProcessedData);
}
