import baseDifference from './baseDifference.js';
import baseFlatten from './baseFlatten.js';
import baseUniq from './baseUniq.js';

/**
 * The base implementation of methods like `xor` which accepts an array of
 * arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of values.
 */
function baseXor(arrays, iteratee, comparator) {
  const length = arrays.length;
  // 如果实际上在 xor 里只传入了一个数组，则只需要通过 baseUniq 筛选出不重复的元素就行
  if (length < 2) {
    return length ? baseUniq(arrays[0]) : [];
  }
  let index = -1;
  const result = Array(length);

  // 将 arrays 中的每个 array，依次和其他 array 对比，利用 baseDifference API 获取到该 array 相对其他数组独有的元素，然后赋值给 result[index]
  while (++index < length) {
    const array = arrays[index];
    let othIndex = -1;

    while (++othIndex < length) {
      if (othIndex != index) {
        result[index] = baseDifference(result[index] || array, arrays[othIndex], iteratee, comparator);
      }
    }
  }
  // 最后将结果扁平化之后去除重复值
  return baseUniq(baseFlatten(result, 1), iteratee, comparator);
}

export default baseXor;
