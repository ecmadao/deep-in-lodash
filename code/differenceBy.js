import baseDifference from './.internal/baseDifference.js';
import baseFlatten from './.internal/baseFlatten.js';
import isArrayLikeObject from './isArrayLikeObject.js';
import last from './last.js';

/**
 * This method is like `difference` except that it accepts `iteratee` which
 * is invoked for each element of `array` and `values` to generate the criterion
 * by which they're compared. The order and references of result values are
 * determined by the first array. The iteratee is invoked with one argument:
 * (value).
 *
 * **Note:** Unlike `pullAllBy`, this method returns a new array.
 *
 * @since 4.0.0
 * @category Array
 * @param {Array} array — 需要检查的 Array
 * @param {...Array} [values] — 检查时需要剔除的元素
 * @param {Function} iteratee — 调用在每个元素上的方法
 * @returns {Array} 返回筛选过后的新 Array
 * @example
 *
 * differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
 * // => [1.2]
 */
function differenceBy(array, ...values) {
  // 获取最后一个参数作为比较的方法
  let iteratee = last(values);
  // 如果没有传入比较的方法的话，则 differenceBy 仅作为一个 difference 方法使用
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), iteratee)
    : [];
}

export default differenceBy;
