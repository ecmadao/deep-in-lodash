// arrayFilter(array, predicate) 根据 predicate 方法对 array 进行筛选
import arrayFilter from './.internal/arrayFilter.js';
// arrayMap(array, iteratee) 通过 iteratee 方法对 array 进行遍历
import arrayMap from './.internal/arrayMap.js';
// 获取某个 Object 里指定 key 的 value
import baseProperty from './.internal/baseProperty.js';
// baseTimes(n, iteratee) 重复调用 n 次 iteratee 方法，并返回由 iteratee 调用结果组成的 Array
import baseTimes from './.internal/baseTimes.js';
import isArrayLikeObject from './isArrayLikeObject.js';

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMax = Math.max;

/**
 * This method is like `zip` except that it accepts an array of grouped
 * elements and creates an array regrouping the elements to their pre-zip
 * configuration.
 *
 * @since 1.2.0
 * @category Array
 * @param {Array} array The array of grouped elements to process.
 * @returns {Array} Returns the new array of regrouped elements.
 * @see unzipWith, zip, zipObject, zipObjectDeep, zipWith
 * @example
 *
 * const zipped = zip(['a', 'b'], [1, 2], [true, false]);
 * // => [['a', 1, true], ['b', 2, false]]
 *
 * unzip(zipped);
 * // => [['a', 'b'], [1, 2], [true, false]]
 */

// 举个栗子，unzip([['a', 'b'], [1, 2], 3, [true]])
function unzip(array) {
  // array = [['a', 'b'], [1, 2], 3, [true]]
  if (!(array && array.length)) {
    return [];
  }
  let length = 0;
  // 筛选出 array 中仍是 Array 类型的元素，并获取 length 的最大值
  // array = [['a', 'b'], [1, 2], [true]]
  // length = 2
  array = arrayFilter(array, group => {
    if (isArrayLikeObject(group)) {
      length = nativeMax(group.length, length);
      return true;
    }
  });
  // 重复 length 次，返回一个 Array。该 Array 中的每个元素都是 baseTimes 第二个参数调用之后返回的结果。
  // 例如，第一次调用时，index = 0，则针对 array 进行遍历时，其中的每个元素都会调用 baseProperty(0) 方法，本质上是获取每个元素的 index 位于 0 的元素，返回一个 Array，遍历完成之后返回 ['a', 1, true]
  // 最终 return [['a', 1, true], ['b', 2, undefined]]
  return baseTimes(length, index => arrayMap(array, baseProperty(index)));
}

export default unzip;
