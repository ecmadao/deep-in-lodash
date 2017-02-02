import isFunction from './isFunction.js';
import isLength from './isLength.js';

/**
 * 检查一个 value 是否是类数组的数据。它不是 function，且有 value.length 值，并且 value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER
 *
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * isArrayLike([1, 2, 3]);
 * // => true
 *
 * isArrayLike(document.body.children);
 * // => true
 *
 * isArrayLike('abc');
 * // => true
 *
 * isArrayLike(Function);
 * // => false
 */
function isArrayLike(value) {
  // 注：function 有 length 属性，且默认情况下 length 为 0
  return value != null && isLength(value.length) && !isFunction(value);
}

export default isArrayLike;
