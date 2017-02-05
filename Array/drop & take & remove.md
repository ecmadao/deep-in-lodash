<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [drop & take & remove](#drop-&-take-&-remove)
  - [drop](#drop)
    - [`drop`](#drop)
      - [Usage](#usage)
      - [Source Code](#source-code)
    - [`dropWhile`](#dropwhile)
      - [Usage](#usage-1)
      - [Source Code](#source-code-1)
    - [`dropRight`](#dropright)
      - [Usage](#usage-2)
      - [Source Code](#source-code-2)
    - [`dropRightWhile`](#droprightwhile)
      - [Usage](#usage-3)
      - [Source Code](#source-code-3)
  - [take](#take)
    - [`take`](#take)
      - [Usage](#usage-4)
      - [Source Code](#source-code-4)
    - [`takeWhile`](#takewhile)
      - [Usage](#usage-5)
    - [`takeRight`](#takeright)
      - [Usage](#usage-6)
      - [Source Code](#source-code-5)
    - [`takeRightWhile`](#takerightwhile)
      - [Usage](#usage-7)
  - [remove](#remove)
    - [`remove`](#remove)
      - [Usage](#usage-8)
      - [Source Code](#source-code-6)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## drop & take & remove

### drop

> drop 系列方法用于从某个 Array 中丢弃一些（符合条件的）元素，但并**不会改变原有数组，而是返回新数组。**

#### `drop`

从一个数组的开头开始，去除指定数目个元素（默认去除 1 个）

##### Usage

```javascript
_.drop([1, 2, 3]);
// => [2, 3]
 
_.drop([1, 2, 3], 2);
// => [3]
 
_.drop([1, 2, 3], 5);
// => []
 
_.drop([1, 2, 3], 0);
// => [1, 2, 3]
```

##### Source Code

```javascript
// 两个主要方法：baseSlice & toInteger
import baseSlice from './.internal/baseSlice.js';
import toInteger from './toInteger.js';

function drop(array, n, guard) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  // 截取 index 从 n 开始，到数组结尾的元素
  return baseSlice(array, n < 0 ? 0 : n, length);
}
```

```javascript
// toInteger.js
// 转换为有限数
import toFinite from './toFinite.js';

function toInteger(value) {
  const result = toFinite(value);
  const remainder = result % 1;
  // 通过 result === result 可知不是 NaN
  // 返回去除了余数的值
  return result === result ? (remainder ? result - remainder : result) : 0;
}

// toFinite.js
import toNumber from './toNumber.js';
const INFINITY = 1 / 0;
const MAX_INTEGER = 1.7976931348623157e+308;

function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  // 将正负无穷值转换为最大正整数
  if (value === INFINITY || value === -INFINITY) {
    const sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  // 确保 toNumber 转换之后不会返回 NaN
  return value === value ? value : 0;
}

// toNumber.js
typeof value == 'number' // => return value
isSymbol // => return NaN
isObject // => 有 valueOf 方法则转换为 value.valueOf()
		 // => 仍是 Object，则强制转为 String `${value.valueOf()}`
typeof value != 'string' // => return value === 0 或者 +value
// => 之后，去除两端空白，检测二进制/八进制/十六进制
```

```javascript
// baseSlice
// 切割数组，获取 Array 中 index 从 start 到 end 的元素 [start, end]
function baseSlice(array, start, end) {
  let index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  const result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}
```

#### `dropWhile`

数组从左到右依次剔除元素，直到传入的判断方法返回 `false`

##### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.dropWhile(users, function(o) { return !o.active; });
// => objects for ['pebbles']
```

##### Source Code

```javascript
import baseWhile from './.internal/baseWhile.js';

function dropWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, predicate, true)
    : [];
}
```

```javascript
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
```

#### `dropRight`

相对于 `drop` 方法，`dropRight` 方法从数组的右侧开始分隔。除此以外其他特性和 `drop` 完全一样。

##### Usage

```javascript
_.dropRight([1, 2, 3]);
// => [1, 2]
 
_.dropRight([1, 2, 3], 2);
// => [1]
 
_.dropRight([1, 2, 3], 5);
// => []
 
_.dropRight([1, 2, 3], 0);
// => [1, 2, 3]
```

##### Source Code

```javascript
function dropRight(array, n, guard) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  n = length - n;
  // 截取 index 从 0 开始，到 length - n 的元素
  return baseSlice(array, 0, n < 0 ? 0 : n);
}
```

#### `dropRightWhile`

相对于 `dropRight` ，`dropRightWhile` 从右侧开始 `drop` ，知道指定的判断方法返回 false

##### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
_.dropRightWhile(users, function(o) { return !o.active; });
// => objects for ['barney']
```

##### Source Code

```javascript
function dropRightWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, predicate, true, true)
    : [];
}
```

### take

> take 系列方法类似于 drop，底层实现一样。但 take 是从某个 Array 中获取指定数目个（符合条件的）元素，且**不改变原数组。**

#### `take`

从数组的开始，选取指定数目的元素

##### Usage

```javascript
_.take([1, 2, 3]);
// => [1]
 
_.take([1, 2, 3], 2);
// => [1, 2]
```

##### Source Code

```javascript
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  // 获取 index 位于 [0, n] 的元素
  return baseSlice(array, 0, n < 0 ? 0 : n);
}
```

#### `takeWhile`

从 Array 左侧开始，仅返回符合指定条件的元素

##### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.takeWhile(users, function(o) { return !o.active; });
// => objects for ['barney', 'fred']
```

#### `takeRight`

从 Array 右侧开始，选取指定数目个元素

##### Usage

```javascript
_.takeRight([1, 2, 3]);
// => [3]
 
_.takeRight([1, 2, 3], 2);
// => [2, 3]
```

##### Source Code

```javascript
function takeWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, predicate)
    : [];
}
```

#### `takeRightWhile`

从 Array 右侧开始，返回符合指定条件的元素

##### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
_.takeRightWhile(users, function(o) { return !o.active; });
// => objects for ['fred', 'pebbles']
```
### remove

#### `remove`

> 删除一个 Array 中符合某种条件的元素，**修改原有数组，并返回被删除元素组成的 Array

##### Usage

```javascript
var array = [1, 2, 3, 4];
var evens = _.remove(array, function(n) {
  return n % 2 == 0;
});
 
console.log(array);
// => [1, 3]
 
console.log(evens);
// => [2, 4]
```

##### Source Code

```javascript
// 基本原理是，遍历 array，针对每个元素代入 predicate 方法，如果为 true，则记录其 index，最后获取所有符合条件的 index 组成的 Array，之后调用私有 basePullAt API 来修改原有数组
function remove(array, predicate) {
  const result = [];
  if (!(array && array.length)) {
    return result;
  }
  let index = -1;
  const indexes = [];
  const length = array.length;

  while (++index < length) {
    const value = array[index];
    if (predicate(value, index, array)) {
      result.push(value);
      indexes.push(index);
    }
  }
  // 作用为修改原有 array，从 array 中删除目标 index 代表的元素
  basePullAt(array, indexes);
  return result;
}
```

