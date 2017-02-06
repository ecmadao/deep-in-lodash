import toInteger from './toInteger.js';

/**
 * The opposite of `before`; this method creates a function that invokes
 * `func` once it's called `n` or more times.
 *
 * @since 0.1.0
 * @category Function
 * @param {number} n The number of calls before `func` is invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * const saves = ['profile', 'settings'];
 * const done = after(saves.length, () => console.log('done saving!'));
 *
 * forEach(saves, type => asyncSave({ 'type': type, 'complete': done }));
 * // => Logs 'done saving!' after the two async saves have completed.
 */

 // after 函数返回了一个 func，形成了一个作用域闭包，借此在内部储存了 n 参数
 // 在每次调用的时候 n 会递减，直至为 0 时，调用回调函数
function after(n, func) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  n = toInteger(n);
  return function(...args) {
    if (--n < 1) {
      return func.apply(this, args);
    }
  };
}

export default after;
