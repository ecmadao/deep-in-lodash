import isObject from './isObject.js';
import toNumber from './toNumber.js';

/* Built-in method references for those with the same name as other `lodash` methods. */
const nativeMax = Math.max;
const nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `debounce` and `throttle`.
 *
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * const debounced = debounce(batchLog, 250, { 'maxWait': 1000 });
 * const source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */

/**
 * 当事件重复触发的事件间隔小于指定时间时，回调函数不会被触发
 * @method debounce
 * @param  {[type]} func    指定的回调函数
 * @param  {[type]} wait    事件触发的间隔时间；小于该时间则即便重复触发事件，回调函数也不会执行
 * @param  {[type]} options 配置参数
 *
 * options:
 *    - leading = false: 触发连续多个事件（ 时间间隔小于 wait ），只有第一个事件的回调会被触发
 *    - trailing = true: 触发连续多个事件（ 时间间隔小于 wait ），只有最后一个事件的回调会被触发
 *    - maxWait: 回调函数可被延迟调用的最长时间
 *
 * **注：**
 *    - 如果 leading 和 trailing 都是 true，则只有当在一串事件流中，事件至少被触发一次时，才会在事件结尾处再被触发调用一次
 *    - 如果 leading 是 false 且 wait 为 0，则回调函数的调用被延迟至下一次事件触发，类似于 setTimeout(func, 0)
 */

function debounce(func, wait, options) {
  let lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime;

  let lastInvokeTime = 0;
  let leading = false;
  let maxing = false;
  let trailing = true;

  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  // 调用回调函数。调用时使用的作用域为 lastThis，调用之后将作用域和参数清空，并记录调用时的时间戳
  function invokeFunc(time) {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  // 第一个事件被触发
  function leadingEdge(time) {
    // 令上次调用时间 = time, 相当于将已等待时间设置为 0
    lastInvokeTime = time;
    // 设置定时器，等待 wait 之后触发过期函数
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  // 回调函数还能等待多久
  // 返回 (wait - 已等待时间) 或者 (maxWait - 已等待时间)
  function remainingWait(time) {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  // 判断是否是在事件的末尾且可以调用回调函数
  function shouldInvoke(time) {
    // 当前时间距上一次事件触发过了多久
    const timeSinceLastCall = time - lastCallTime;
    // 当前时间距上一次回调函数调用过了多久
    const timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (
      lastCallTime === undefined // 事件被 cancel
      || (timeSinceLastCall >= wait) // 两个事件触发的间隔超过 wait
      || (timeSinceLastCall < 0) // activity has stopped
      || (maxing && timeSinceLastInvoke >= maxWait) // 有最大等待时间，且函数调用的时间间隔已经超过的最大等待时间
    );
  }

  // 通过 timeout 等待过后的过期函数
  // 检查是否处于事件末尾、可以执行回调的状态(shouldInvoke)。如果是，则尝试通过 trailingEdge 进行调用
  // 否则认为事件还在被触发，继续设置定时器
  function timerExpired() {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // 重新开始计时器，但等待的时间将会越来越短
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  // 一串事件流的末尾，最后一次触发（之后事件被 cancel，或者事件的时间间隔大于等待时间）
  function trailingEdge(time) {
    timerId = undefined;

    // 在调用过 invokeFunc 函数之后，回调函数可以被触发，但作用域及参数将会被清空，
    // 即 lastArgs = lastThis = undefined
    // 因此，如果设置 leading 为 true，则在事件流的开头就调用 invokeFunc，之后事件至少再被触发一次，才能保证有 lastArgs 参数
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  // 取消对事件流的监听
  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(Date.now());
  }

  function debounced(...args) {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

export default debounce;
