import baseFlatten from './.internal/baseFlatten.js';

/** Used as references for various `Number` constants. */
// 指定递归深度为无穷次
const INFINITY = 1 / 0;

/**
 * Recursively flattens `array`.
 *
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @see flatMap, flatMapDeep, flatMapDepth, flatten, flattenDepth
 * @example
 *
 * flattenDeep([1, [2, [3, [4]], 5]]);
 * // => [1, 2, 3, 4, 5]
 */
function flattenDeep(array) {
  const length = array == null ? 0 : array.length;
  // 会持续进行递归，直至检查到元素不可被 flatten
  return length ? baseFlatten(array, INFINITY) : [];
}

export default flattenDeep;
