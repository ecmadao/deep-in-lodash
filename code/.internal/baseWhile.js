import baseSlice from './baseSlice.js';

/**
 * 该私有方法主要针对两个 API：`dropWhile` 和 `takeWhile`
 * `dropWhile` 会一直丢弃数组中的元素，直到判断的方法返回 false，最终返回剩余的元素组成的 Array
 * `takeWhile` 则返回由丢弃的元素组成的数组
 * 两者的区别由 isDrop 参数决定，为 true 则 drop，否则 take
 *
 * @private
 * @param {Array} array — 被执行 drop 的数组
 * @param {Function} predicate — 每次循环时要执行的判断方法
 * @param {boolean} [isDrop] — 判断是 drop 还是 take
 * @param {boolean} [fromRight] — 判断从左侧还是右侧开始
 * @returns {Array} Returns the slice of `array`.
 */
function baseWhile(array, predicate, isDrop, fromRight) {
  const length = array.length;
  let index = fromRight ? length : -1;

  // 通过 while 求出当 predicate 返回 false 时 index 的值
  while ((fromRight ? index-- : ++index < length) &&
    predicate(array[index], index, array)) {}

  /**
   * drop(array, n) => baseSlice(array, n, array.length)
   * dropRight(array, n) => baseSlice(array, array.length - n)
   * take(array, n) => baseSlice(array, 0, n)
   * takeRight(array, n) => baseSlice(array, array.length - n, array.length)
   */
  return isDrop
    ? baseSlice(array, (fromRight ? 0 : index), (fromRight ? index + 1 : length))
    : baseSlice(array, (fromRight ? index + 1 : 0), (fromRight ? length : index));
}

export default baseWhile;
