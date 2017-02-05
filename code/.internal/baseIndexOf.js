import baseFindIndex from './baseFindIndex.js';
import baseIsNaN from './baseIsNaN.js';
import strictIndexOf from './strictIndexOf.js';

/**
 * The base implementation of `indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  // 如果 value 不是 NaN，则通过 strictIndexOf 获取 index
  // 否则使用 baseFindIndex 方法，同时把 baseIsNaN 代入，以判断数组中的元素是否是 NaN
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

export default baseIndexOf;
