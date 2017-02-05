import baseFlatten from './.internal/baseFlatten.js';
import baseUniq from './.internal/baseUniq.js';
import isArrayLikeObject from './isArrayLikeObject.js';

/**
 * Creates an array of unique values, in order, from all given arrays using
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of combined values.
 * @see difference, unionBy, unionWith, without, xor, xorBy
 * @example
 *
 * union([2], [1, 2]);
 * // => [2, 1]
 */

 // 利用 baseFlatten API 将传入的多个数组扁平化为一个
 // 例如，
 // union([1], [1, 2])
function union(...arrays) {
  // arrays = [[1], [1, 2]]
  // baseFlatten(arrays, 1, isArrayLikeObject, true)
  // ===> [1, 1, 2]
  // baseUniq([1, 1, 2])
  // ===> [1, 2]
  return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
}

export default union;
