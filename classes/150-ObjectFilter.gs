/**
 * Class for creating and applying filters/conditions on object properties.
 */
class ObjectFilter {
  constructor(andCondition = false) {
    this.andConditions = [];
    this.orConditions = [];
    this.notConditions = [];
    this.notOrConditions = [];

    if (andCondition)
      this.addAndCondition(andCondition);
  }

  // Methods for adding new conditions.
  addAndCondition(condition) {
    this.andConditions.push(condition);
    return this;
  }
  addOrCondition(condition) {
    this.orConditions.push(condition);
    return this;
  }
  addNotCondition(condition) {
    this.notConditions.push(condition);
    return this;
  }
  addNotOrCondition(condition) {
    this.notOrConditions.push(condition);
    return this;
  }
  
  /**
   * Checks whether a single object fulfills the conditions.
   * 
   * Returns 'true' is all conditions in AND and NOT are fulfilled and at least one
   * condition in OR and OR NOT (combined) are fulfilled, if such exist. Otherwise 
   * 'false'. Returns 'true' if no conditions are set.
   * 
   * @return true or false
   */
  applyOnObject(obj) {
    // Check AND conditions.
    for (let c of this.andConditions)
      for (let p in c)
        if (!this.valueMathces(obj[p], c[p])) return false;
    // Check NOT conditions.
    for (let c of this.notConditions)
      for (let p in c)
        if (this.valueMathces(obj[p], c[p])) return false;

    // All AND checks passed. If no OR checks exist, we are done.
    if (this.orConditions.length == 0 && this.notOrConditions.length == 0)
      return true;

    // Check OR conditions.
    for (let c of this.orConditions)
      for (let p in c)
        if (this.valueMathces(obj[p], c[p])) return true;
    // Check NOT OR conditions.
    for (let c of this.notOrConditions)
      for (let p in c)
        if (!this.valueMathces(obj[p], c[p])) return true;

    // No OR conditions fulfilled if we reach this line.
    return false;
  }

  // Internally used function for comparing values, including checking if value exists in array.
  valueMathces(search, target) {
    if (search === undefined)
      return (target === undefined);
    if (typeof(search.includes) == 'function')
      return (search.includes(target));
    return (search === target);
  }

  applyOnArray(objectArray) {
    let output = [];
    for (let o of objectArray)
      if (this.applyOnObject(o)) output.push(o);
    return output;
  }

  removeFromArray(objectArray) {
    let output = [];
    let i = 0;
    while (i < objectArray.length) {
      if (this.applyOnObject(objectArray[i]))
        output.push(objectArray.splice(i, 1)[0]);
      else
        i++;
    }
    return output;
  }
}


function tmp2() {
  let a = ['a', 'b'];
  Logger.log(typeof(a.includes));
  a = {a: 1, b: 2};
  Logger.log(typeof(a.includes));
}
