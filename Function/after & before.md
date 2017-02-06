<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [after & before](#after-&-before)
  - [`after`](#after)
    - [Usage](#usage)
    - [Source Code](#source-code)
  - [`before`](#before)
    - [Usage](#usage-1)
    - [Source Code](#source-code-1)
  - [`once`](#once)
    - [Usage](#usage-2)
    - [Source Code](#source-code-2)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## after & before

### `after`

以一个数字（n）和回调函数（func）为参数；当重复调用 n 次之后，调用 func

#### Usage

```javascript
var saves = ['profile', 'settings'];
 
var done = _.after(saves.length, function() {
  console.log('done saving!');
});
 
_.forEach(saves, function(type) {
  asyncSave({ 'type': type, 'complete': done });
});
// 在两个异步函数完成之后，输出 'done saving!'
```

#### Source Code 

```javascript
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
```

### `before`

以一个数字（n）和回调函数（func）为参数；在调用次数小于 n 之前，每次回调函数都可以被触发；大于等于 n 次之后则无效。

#### Usage

```javascript
jQuery(element).on('click', _.before(5, addContactToList));
// 最多可以点击触发 4 次
```

#### Source Code

```javascript
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
```

### `once`

指定的回调函数只能被调用一次。其底层其实调用了 `before` API

#### Usage

```javascript
var initialize = _.once(createApplication);
initialize();
initialize(); // 不会被触发
```

#### Source Code

```javascript
function once(func) {
  return before(2, func);
}
```

