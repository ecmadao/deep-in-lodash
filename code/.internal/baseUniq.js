import SetCache from './SetCache.js';
import arrayIncludes from './arrayIncludes.js';
import arrayIncludesWith from './arrayIncludesWith.js';
import cacheHas from './cacheHas.js';
import createSet from './createSet.js';
import setToArray from './setToArray.js';

/** Used as the size to enable large array optimizations. */
const LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `uniqBy`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
// array = [1, 1, 2], baseUniq(array)
function baseUniq(array, iteratee, comparator) {
  let index = -1;
  let includes = arrayIncludes;
  let isCommon = true;

  const length = array.length;
  const result = [];
  let seen = result;

  // 如果自定义了比较的方法，则通过 arrayIncludesWith API，在比较时代入自定义的方法
  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  // 当数组长度大于 LARGE_ARRAY_SIZE 时，传统的遍历方法速度不快
  else if (length >= LARGE_ARRAY_SIZE) {
    // 将数组转为 Set 的时候，会自动去除数组中重复的元素。但如果自定义了数组的转换方法，则不能再单纯的使用 Set API
    const set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    // 则需以数组的各元素作 key，将数组转换为 Object，然后通过查看 key 是否在 Object 中来判断是否重复
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  // length = 3, index = -1, result = [], seen = [] = result
  outer:
  while (++index < length) {
    // value = 1, computed = 1
    // value = 1, computed = 1
    // value = 2, computed = 2
    let value = array[index];
    const computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      // seenIndex = 0, seen = []
      // seenIndex = 1, seen = [1]
      // seenIndex = 1, seen = [1]
      let seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          // result = [1], seen = [1]
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      // result = [1], seen = [1]
      // result = [1, 2], seen = [1, 2]
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

export default baseUniq;
