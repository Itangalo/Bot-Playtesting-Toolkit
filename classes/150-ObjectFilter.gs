/**
 * Class for creating and applying filters/conditions on object properties.
 * 
 * @param {object} equalCondition: Any equals condition to add when the filter is created.
 *
 * Conditions are added as either AND or OR conditions. The filter is fulfilled if all
 * AND condition are fulfilled and, if any are present, at least one OR condition.
 * The and() and or() methods tell the filter how to treat upcoming conditions. Default is AND.
 */
class ObjectFilter {
  constructor(equalsCondition = false) {
    this.andConditions = [];
    this.orConditions = [];
    this.and();

    if (equalsCondition)
      this.addEqualsCondition(equalsCondition);
  }

  /**
   * Switches the filter to stack AND conditions.
   */
  and() {
    this.addMode = 'andConditions';
    return this;
  }

  /**
   * Switches the filter to stack OR conditions.
   */
  or() {
    this.addMode = 'orConditions';
    return this;
  }

  /**
   * Adds a whole object filter as condition.
   */
  addFilterCondition(filter) {
    this[this.addMode].push(new ConditionFilter(this, filter));
    return this;
  }

  /**
   * Requires that the stated object property should match the stated value, or one of
   * several stated values. On the form {a: 3} or {a: [2, 3, 5]}.
   */
  addEqualsCondition(condition) {
    this[this.addMode].push(new ConditionEquals(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property should different from the stated value, or
   * from all of several stated values. On the form {a: 3} or {a: [2, 3, 5]}.
   */
  addNotEqualsCondition(condition) {    
    this[this.addMode].push(new ConditionNotEquals(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is an array and that it contains the stated value,
   * or one of the stated values. On the form {a: 3} or {a: [2, 3, 5]}.
   */
  addContainsCondition(condition) {
    this[this.addMode].push(new ConditionContains(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is an array and that it does not contain the stated
   * value, or any of the stated values. On the form {a: 3} or {a: [2, 3, 5]}.
   */
  addNotContainsCondition(condition) {
    this[this.addMode].push(new ConditionNotContains(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is undefined, null, false or an empty string/array.
   * Only property name is passed as condition.
   */
  addEmptyCondition(condition) {
    this[this.addMode].push(new ConditionEmpty(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is NOT undefined, null, false or an empty string/array.
   * Only property name is passed as condition.
   */
  addNotEmptyCondition(condition) {
    this[this.addMode].push(new ConditionNotEmpty(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is higher than the stated value.
   * On the form {a: 3}.
   */
  addGreaterThanCondition(condition) {    
    this[this.addMode].push(new ConditionGreaterThan(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is higher than or equal to the
   * stated value. On the form {a: 3}.
   */
  addGreaterOrEqualCondition(condition) {    
    this[this.addMode].push(new ConditionGreaterOrEqual(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is lower than the stated value.
   * On the form {a: 3}.
   */
  addLessThanCondition(condition) {    
    this[this.addMode].push(new ConditionLessThan(this, condition));
    return this;
  }

  /**
   * Requires that the stated object property is lower than or equal to the
   * stated value. On the form {a: 3}.
   */
  addLessOrEqualCondition(condition) {    
    this[this.addMode].push(new ConditionLessOrEqual(this, condition));
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
      if (!c.evaluate(obj)) return false;

    // All AND checks passed. If no OR checks exist, we are done.
    if (this.orConditions.length == 0)
      return true;

    // Check OR conditions.
    for (let c of this.orConditions)
      if (c.evaluate(obj)) return true;

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
   * Returns the first object in an array matching the condition, or false if none is found.
   */
  findFirstInArray(objectArray) {
    for (let o of objectArray)
      if (this.applyOnObject(o)) return o;
    return false;
  }

  /**
   * Removes the first matching object from an array and returns it, or false if none is found.
   */
  removeFirstFromArray(objectArray) {
    let output = this.removeFromArray(objectArray, 1);
    if (!output.length)
      return false;
    return output[0];
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


/**
 * Class for using another object filter as a condition.
 * Also base class for conditions, extended by other conditions.
 *
 * @param {ObjectFilter} filter: The ObjectFilter to which the condition belongs.
 * @param {object} conditionData: The object filter to use as condition.
 */
class ConditionFilter {
  constructor(filter, conditionData) {
    this.validateAndProcess(conditionData);
  }

  validateAndProcess(conditionData) {
    if (!(conditionData instanceof ObjectFilter))
      throw('Only object filters can be added as filter conditions.');
    this.filter = conditionData;
  }

  evaluate(obj) {
    return this.filter.applyOnObject(obj);
  }
}

/**
 * Class for equality or includes conditions in ObjectFilters.
 * 
 * @param {object} conditionData: Data describing the condition, on the form {a: 3} or {a: [2, 3, 5]}.
 */
class ConditionEquals extends ConditionFilter {
  validateAndProcess(conditionData) {
    if (typeof(conditionData) != 'object')
      throw('The condition data must be an object.');
    if (Object.keys(conditionData).length != 1)
      throw('The conditionData should contain one and only one property.');
    this.property = Object.keys(conditionData)[0];
    this.values = conditionData[this.property];
    if (this.values === undefined || typeof(this.values) == 'string' || typeof(this.values.includes) != 'function')
      this.values = [this.values];
  }

  evaluate(obj) {
    return this.values.includes(obj[this.property]);
  }
}

/**
 * Class for inequality or not-includes conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3} or {a: [2, 3, 5]}.
 */
class ConditionNotEquals extends ConditionEquals {
  evaluate(obj) {
    return !this.values.includes(obj[this.property]);
  }
}

/**
 * Class for checking if an array property conatains any of the stated values, for conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3} or {a: [2, 3, 5]}.
 */
class ConditionContains extends ConditionEquals {
  evaluate(obj) {
    if (obj[this.property] === undefined || obj[this.property][0] === undefined)
      return false;
    for (let v of this.values)
      if (obj[this.property].includes(v))
        return true;
    return false;
  }
}

/**
 * Class for checking if an array property conatains any of the stated values, for conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3} or {a: [2, 3, 5]}.
 */
class ConditionNotContains extends ConditionEquals {
  evaluate(obj) {
    if (obj[this.property] === undefined || obj[this.property][0] === undefined)
      return true;
    for (let v of this.values)
      if (obj[this.property].includes(v))
        return false;
    return true;
  }
}

/**
 * Class for 'empty' conditions in ObjectFilters.
 * Returns true if the given property is undefined, null, false, an empty array or an empty string.
 *
 * @param {object} conditionData: The name of the property which should be empty.
 */
class ConditionEmpty extends ConditionEquals {
  validateAndProcess(conditionData) {
    if (typeof(conditionData) != 'string')
      throw('The condition data must be a string.');
    this.property = conditionData;
  }

  evaluate(obj) {
    if (compareObjects(obj[this.property], []))
      return true;
    if ([undefined, null, false, ''].includes(obj[this.property]))
      return true;
    return false;
  }
}

/**
 * Class for 'not empty' conditions in ObjectFilters.
 * Returns false if the given property is undefined, null, false, an empty array or an empty string.
 *
 * @param {object} conditionData: The name of the property which should be empty.
 */
class ConditionNotEmpty extends ConditionEmpty {
  evaluate(obj) {
    if (compareObjects(obj[this.property], []))
      return false;
    if ([undefined, null, false, ''].includes(obj[this.property]))
      return false;
    return true;
  }
}

/**
 * Class for greater-than conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3}.
 */
class ConditionGreaterThan extends ConditionEquals {
  validateAndProcess(conditionData) {
    if (typeof(conditionData) != 'object')
      throw('The conditionData must be an object.');
    if (Object.keys(conditionData).length != 1)
      throw('The conditionData should contain one and only one property.');
    this.property = Object.keys(conditionData)[0];
    this.value = conditionData[this.property];
    if (isNaN(this.value) || this.value == null || this.value == undefined)
      throw('Tried to add paramter ' + this.value + ' as condition, but number is required.');
    this.value = parseFloat(this.value);
  }

  evaluate(obj) {
    return (obj[this.property] > this.value);
  }
}

/**
 * Class for greater-or-equal-to conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3}.
 */
class ConditionGreaterOrEqual extends ConditionGreaterThan {
  evaluate(obj) {
    return (obj[this.property] >= this.value);
  }
}

/**
 * Class for less-than conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3}.
 */
class ConditionLessThan extends ConditionGreaterThan {
  evaluate(obj) {
    return (obj[this.property] < this.value);
  }
}

/**
 * Class for less-or-equal-to conditions in ObjectFilters.
 *
 * @param {object} conditionData: Data describing the condition, on the form {a: 3}.
 */
class ConditionLessOrEqual extends ConditionGreaterThan {
  evaluate(obj) {
    return (obj[this.property] <= this.value);
  }
}
