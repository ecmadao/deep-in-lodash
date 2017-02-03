/**
 * 重复调用 n 次 iteratee 方法，并返回由 iteratee 结果组成的 Array
 * The base implementation of `times` without support for max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  let index = -1;
  const result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

export default baseTimes;
