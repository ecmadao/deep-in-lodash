<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Func with delay](#func-with-delay)
  - [`delay`](#delay)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`defer`](#defer)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)
  - [`debounce` 和 `throttle`](#debounce-%E5%92%8C-throttle)
    - [`debounce`](#debounce)
      - [Usage](#usage-2)
      - [Source Code](#source-code-2)
    - [`throttle`](#throttle)
      - [Usage](#usage-3)
      - [Source Code](#source-code-3)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Func with delay

### `delay`

最基本的 `deplay` API，内部通过 `setTimeout` 来延迟调用回调函数

#### Usage

```javascript
_.delay(function(text) {
  console.log(text);
}, 1000, 'later'); // 1 秒后输出 'later'
```

#### Source Code

```javascript
function delay(func, wait, ...args) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  return setTimeout(() => func(...args), toNumber(wait) || 0);
}
```

### `defer`

延迟一秒触发指定的函数

#### Usage

```javascript
_.defer(function(text) {
  console.log(text);
}, 'deferred');
// => 1s 后输出 'deferred'
```

#### Source Code

```javascript
function defer(func, ...args) {
  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  return setTimeout(() => func(...args), 1);
}
```

### `debounce` 和 `throttle`

总体而言，

- `debounce`：通过设置一个时间间隔，强迫一个回调函数在事件连续触发，且事件的时间间隔小于设定的时间时，该回调函数不会被持续调用。即**除非在指定的一段时间内没有调用回调函数，否则即便事件连续触发，其回调函数也不会重复调用。**
- `throttle`：限制一个函数在一段时间内的调用次数。比如，在 10s 内触发 1000 次事件，但你设定了每个回调函数的时间间隔是 100 毫秒，则最终将会调用 100 次回调。即 **`throttle` 定义了一段时间内回调函数可以被调用的最大次数。**

扩展阅读：

- [The Difference Between Throttling and Debouncing](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)
- [Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)

#### `debounce`

除非在指定的一段时间内没有调用回调函数，否则即便事件连续触发，其回调函数也不会重复调用。

##### Usage

```javascript
// 如果在 150 ms 内连续改变窗口大小，calculateLayout 回调函数并不会被触发
jQuery(window).on('resize', _.debounce(calculateLayout, 150));
```

##### Source Code

```javascript
/**
 * 当事件重复触发的事件间隔小于指定时间时，回调函数不会被触发
 * @method debounce
 * @param  {[type]} func    指定的回调函数
 * @param  {[type]} wait    事件触发的间隔时间；小于该时间则即便重复触发事件，回调函数也不会执行
 * @param  {[type]} options 配置参数
 *
 * options:
 *    - leading = false: 触发连续多个事件（时间间隔小于 wait），只有第一个事件的回调会被触发
 *    - trailing = true: 触发连续多个事件（时间间隔小于 wait），只有最后一个事件的回调会被触发
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
    // 令上次调用时间 = time，相当于将已等待时间设置为 0
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

  // 根据时间差来判断是否可以调用回调函数
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
  // 如果可以执行回调（shouldInvoke），则尝试通过 trailingEdge 进行调用
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
```

#### `throttle`

定义了一段时间内回调函数可以被调用的最大次数。

##### Usage

```javascript
// 在 window 连续持续滚动的过程中，每 100 毫秒触发一次 updatePosition 回调
jQuery(window).on('scroll', _.throttle(updatePosition, 100));

// 点击事件的回调函数在 5 分钟内只会被触发一次
const throttled = throttle(renewToken, 300000, { 'trailing': false });
jQuery(element).on('click', throttled);
```

##### Source Code

```javascript
function throttle(func, wait, options) {
  let leading = true;
  let trailing = true;

  if (typeof func != 'function') {
    throw new TypeError('Expected a function');
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}
```

`throttle` 的常见运用场景是，针对某个连续触发的事件流，限制其每个事件回调函数的调用频率。我们也可以通过 `setTimeout` / `clearTimeout` 完成一个简陋版：

```javascript
// 比如在 React 中，
// 修改窗口大小，在窗口改变大小的同时需要将宽、高等参数设置到 state 中
// 此时如果连续的调用，则比较影响性能。因此需要一个定时器来限制调用的频率
initialResizeListener() {
  $(window).resize(() => {
    // 在连续不断触发 resize 的过程中，如果有 timer 则说明刚执行完上一个回调，且正在执行下一个回调
    // 因此，取消并重新设置定时器
    if (this.timer) {
      clearTimeout(this.timer);
    }
    // 如果 resize 事件之间的触发间隔超过了 100ms，则可以触发 resetState 方法
    this.timer = setTimeout(this.resetState, 100);
  });
}
```

