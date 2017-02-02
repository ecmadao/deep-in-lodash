import baseDifference from './.internal/baseDifference.js';
import baseFlatten from './.internal/baseFlatten.js';
import isArrayLikeObject from './isArrayLikeObject.js';

/**
 * 筛选出属于第一个 array，但不属于其他 array 的元素，并将所有的元素组成一个新的 Array 后返回
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order and references of result values are
 * determined by the first array.
 *
 * **Note:** Unlike `pullAll`, this method returns a new array.
 *
 * @since 0.1.0
 * @category Array
 * @param {Array} array — 需要检查的 Array
 * @param {...Array} [values] — 检查时需要剔除的元素
 * @returns {Array} 返回筛选过后的新 Array
 * @see union, unionBy, unionWith, without, xor, xorBy, xorWith,
 * @example
 *
 * difference([2, 1], [2, 3]);
 * // => [1]
 */
function difference(array, ...values) {
  // 将除第一个参数之后的参数扁平化为一个数组之后，通过 baseDifference 获取差值
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
}

export default difference;
