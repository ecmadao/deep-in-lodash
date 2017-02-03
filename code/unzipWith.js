import apply from './.internal/apply.js';
import arrayMap from './.internal/arrayMap.js';
import unzip from './unzip.js';

/**
 * This method is like `unzip` except that it accepts `iteratee` to specify
 * how regrouped values should be combined. The iteratee is invoked with the
 * elements of each group: (...group).
 *
 * @since 3.8.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @param {Function} iteratee The function to combine
 *  regrouped values.
 * @returns {Array} Returns the new array of regrouped elements.
 * @example
 *
 * const zipped = zip([1, 2], [10, 20], [100, 200]);
 * // => [[1, 10, 100], [2, 20, 200]]
 *
 * unzipWith(zipped, add);
 * // => [3, 30, 300]
 */

// example
// unzipWith([[1, 10, 100], [2, 20, 200]], _.add)
function unzipWith(array, iteratee) {
  if (!(array && array.length)) {
    return [];
  }
  // 先获取 unzip 的结果
  // result = [[1, 2], [10, 20], [100, 200]]
  const result = unzip(array);
  // 然后进行遍历
  // iteratee = _.add
  // 三次 apply(iteratee, undefined, group) 分别返回 3, 30, 300
  // 最终 return [3, 30, 300]
  return arrayMap(result, group => apply(iteratee, undefined, group));
}

export default unzipWith;
