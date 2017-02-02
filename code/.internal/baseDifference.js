import SetCache from './SetCache.js';
import arrayIncludes from './arrayIncludes.js';
import arrayIncludesWith from './arrayIncludesWith.js';
import arrayMap from './arrayMap.js';
import cacheHas from './cacheHas.js';

/** 确保比较速度的一个优化。当数组的长度大于 200 时，通过转换为对象来比较 */
const LARGE_ARRAY_SIZE = 200;

/**
 * 不支持比较多个 Array 的基本 `difference` 方法
 *
 * @private
 * @param {Array} array —— 要检查的 Array
 * @param {Array} values —— array 中的各元素不能在 values 里
 * @param {Function} [iteratee] 针对两个 Array 中的每个元素进行调用
 * @param {Function} [comparator] 自定义比较的方法
 * @returns {Array} 返回由筛选出的元素组成的新 Array
 */
function baseDifference(array, values, iteratee, comparator) {
  let index = -1;
  // 在默认情况下，
  // 通过内置的 arrayIncludes(array, value) 私有方法进行比较，仅查看 value 是否在 array 中
  let includes = arrayIncludes;
  let isCommon = true;
  const length = array.length;
  const result = [];
  const valuesLength = values.length;

  if (!length) {
    return result;
  }
  // 在比较时，对每个 Array 中的元素都代入某种方法(iteratee)进行检查
  if (iteratee) {
    values = arrayMap(values, value => iteratee(value));
  }

  // 有自定义的比较方法时，
  // 则通过内置的  arrayIncludesWith(array, value, comparator) 私有方法进行比较，依次将 array 中的每个值代入 comparator(value, target value in array) 中进行比较
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }

  // 长度过大时，遍历比较的方式速度不快。
  // 因此，通过 SetCache 对象，本质上是将两个 Array 的比较，转换为了查看 array 中的各个元素，是否存在一个对象里（作为 key 而存在）
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    let value = array[index];
    const computed = iteratee == null ? value : iteratee(value);

    value = (comparator || value !== 0) ? value : 0;
    // 单纯的比较两个 Array 中的差值
    if (isCommon && computed === computed) {
      let valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    // arrayIncludesWith(values, computed, comparator)
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

export default baseDifference;
