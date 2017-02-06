import toInteger from './toInteger.js';

/**
 * Creates a function that invokes `func`, with the `this` binding and arguments
 * of the created function, while it's called less than `n` times. Subsequent
 * calls to the created function return the result of the last `func` invocation.
 *
 * @since 3.0.0
 * @category Function
 * @param {number} n The number of calls at which `func` is no longer invoked.
 * @param {Function} func The function to restrict.
 * @returns {Function} Returns the new restricted function.
 * @example
 *
 * jQuery(element).on('click', before(5, addContactToList));
 * // => Allows adding up to 4 contacts to the list.
 */
function before(n, func) {
  let result;
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  // 形成闭包，储存 n
  n = toInteger(n);
  // 在 n > 0 之前，每次 func 都能够触发
  return function(...args) {
    if (--n > 0) {
      result = func.apply(this, args);
    }
    if (n <= 1) {
      func = undefined;
    }
    return result;
  };
}

export default before;
