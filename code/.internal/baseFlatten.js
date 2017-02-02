import arrayPush from './arrayPush.js';
import isFlattenable from './isFlattenable.js';

/**
 * 将一个 Array 扁平化
 * 如果 Array 有多层的嵌套，比如 [[[1], [2]], [3], 4]，则根据 depth 的值，通过递归进行处理
 * 如果 depth 大于等于可递归的层数，则最终可以返回 [1, 2, 3, 4]
 * The base implementation of `flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array — 要扁平化的 Array
 * @param {number} depth — 递归的深度
 * @param {boolean} [predicate=isFlattenable] 用于判断一个值是否是可以被扁平化
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] 返回的结果。在递归中会将上一层的 result 代入
 * @returns {Array} 返回的扁平化 Array
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  let index = -1;
  const length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    const value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // 进行递归，并将 result 代入，以便所有的结果都放入同一个 Array 中
        // 递归层数受 depth 限制
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

export default baseFlatten;
