import setToArray from './setToArray.js';

/** Used as references for various `Number` constants. */
const INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */

// 首先进行了检查，如果没有 Set API，或者 API 不符合预期，则返回一个空函数
// Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY is used to
// check if set is available
const createSet = (Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY)
  ? values => new Set(values)
  : () => {};

export default createSet;
