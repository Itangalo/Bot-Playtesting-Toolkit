/**
 * Class for creating and applying filters/conditions on object properties.
 * 
 * @param {object} andCondition: Any AND condition to add when the filter is created.
 * 
 * Any conditions are added either on the form {a: value} or {a: [value1, value2, ...]},
 * where the condition is fulfilled if property 'a' has _any_ of the provided values.
 * Conditions are combined by the addAndCondition(), addOrCondition, addNotCondition() and
 * addNorOrCondition() methods.
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

  /**
   * Adds an AND condition to the filter. See class documentation for details.
   */
  addAndCondition(condition) {
    this.andConditions.push(this._assureConditionFormat(condition));
    return this;
  }
  /**
   * Adds an OR condition to the filter. See class documentation for details.
   */
  addOrCondition(condition) {
    this.orConditions.push(this._assureConditionFormat(condition));
    return this;
  }
  /**
   * Adds an NOT condition to the filter. See class documentation for details.
   */
  addNotCondition(condition) {
    this.notConditions.push(this._assureConditionFormat(condition));
    return this;
  }
  /**
   * Adds an NOT OR condition to the filter. See class documentation for details.
   */
  addNotOrCondition(condition) {
    this.notOrConditions.push(this._assureConditionFormat(condition));
    return this;
  }

  // Used internally to convert all condition values into arrays.
  _assureConditionFormat(condition) {
    if (condition instanceof ObjectFilter)
      return condition;
    for (let i in condition)
      if (condition[i] === undefined || typeof(condition[i].includes) != 'function')
        condition[i] = [condition[i]];
    return condition;
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
      if (c instanceof ObjectFilter && c.applyOnObject(obj) === false)
        return false;
      else {
        for (let p in c)
          if (!c[p].includes(obj[p])) return false;
      }
    // Check NOT conditions.
    for (let c of this.notConditions)
      if (c instanceof ObjectFilter && c.applyOnObject(obj) === true)
        return false;
      else {
        for (let p in c)
          if (c[p].includes(obj[p])) return false;
      }
    // All AND checks passed. If no OR checks exist, we are done.
    if (this.orConditions.length == 0 && this.notOrConditions.length == 0)
      return true;

    // Check OR conditions.
    for (let c of this.orConditions)
      if (c instanceof ObjectFilter && c.applyOnObject(obj) === true)
        return true;
      else {
        for (let p in c)
          if (c[p].includes(obj[p])) return true;
      }
    // Check NOT OR conditions.
    for (let c of this.notOrConditions)
      if (c instanceof ObjectFilter && c.applyOnObject(obj) === false)
        return true;
      else {
        for (let p in c)
          if (!c[p].includes(obj[p])) return true;
      }
    // No OR conditions fulfilled if we reach this line.
    return false;
  }

  /**
   * Applies the filter on an array of objects and returns the matching objects (in an array).
   */
  applyOnArray(objectArray) {
    let output = [];
    for (let o of objectArray)
      if (this.applyOnObject(o)) output.push(o);
    return output;
  }

  /**
   * Applies the filter on an array of objects. Removes and returns the matching objects.
   * 
   * @param {number} maxNumber: If set, at most this number of objects are removed.
   */
  removeFromArray(objectArray, maxNumber = Number.POSITIVE_INFINITY) {
    let output = [];
    let i = 0;
    while (i < objectArray.length && output.length < maxNumber) {
      if (this.applyOnObject(objectArray[i]))
        output.push(objectArray.splice(i, 1)[0]);
      else
        i++;
    }
    return output;
  }
}
