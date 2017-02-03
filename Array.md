## Array Funcs

### `compact`

以一个 Array 为参数，筛选出其中合法的值（排除 `false`、`null`、`0`、`""`、`undefined` 以及 `NaN`）

#### Usage

```javascript
_.compact([0, 1, false, 2, '', 3]);
// => [1, 2, 3]
```

#### Source Code

```javascript
function compact(array) {
  let index = -1;
  const length = array == null ? 0 : array.length;
  let resIndex = 0;
  const result = [];

  while (++index < length) {
    const value = array[index];
    if (value) {
      result[resIndex++] = value;
    }
  }
  return result;
}
```

值得一看的基本知识点：[++someVariable Vs. someVariable++ in Javascript](http://stackoverflow.com/questions/3469885/somevariable-vs-somevariable-in-javascript)

### `concat`

将 Array 和之后的任意多个参数合并，返回一个新的 Array

#### Usage

```javascript
var array = [1];
var other = _.concat(array, 2, [3], [[4]]);
 
console.log(other);
// => [1, 2, 3, [4]]
 
// 不会修改原有 Array
console.log(array);
// => [1]
```

####  Source Code

```javascript
import arrayPush from './.internal/arrayPush.js';
import baseFlatten from './.internal/baseFlatten.js';
import copyArray from './.internal/copyArray.js';

function concat(array, ...values) {
  return arrayPush(Array.isArray(array) ? copyArray(array) : [array], baseFlatten(args, 1));
}
```

```javascript
// arrayPush 私有方法
// 两个参数都是 Array；将第二个参数的元素依次 push 到第一个 Array 中
// 即数组原生方法里的 push
function arrayPush(array, values) {
  let index = -1;
  const length = values.length;
  const offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}
```

```javascript
// baseFlatten 私有方法

import arrayPush from './arrayPush.js';
import isFlattenable from './isFlattenable.js';

// 将一个 Array 扁平化
// 如果 Array 有多层的嵌套，比如 [[[1], [2]], [3], 4]，则根据 depth 的值，通过递归进行处理
// 如果 depth 大于等于可递归的层数，则最终返回 [1, 2, 3, 4]
function baseFlatten(array, depth, predicate, isStrict, result) {
  let index = -1;
  const length = array.length;

  // 是否可继续进行递归的判断之一，isFlattenable 用于判断一个值是否是可以被扁平化（Object 或者 Array）
  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    const value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // 进行递归，并将 result 代入，以便所有的值都放入同一个 Array 中
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}
```

```javascript
// copyArray 私有方法
// 用于拷贝一个 Array
function copyArray(source, array) {
  let index = -1;
  const length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}
```

### `difference`

筛选出第一个 Array 中有，但其他 Array 中都没有的参数，返回值为元素组成的 Array

#### Usage

```javascript
_.difference([2, 1], [2, 3]);
// => [1]

_.difference([2, 1], [2, 3], [1, 4]);
// => []
```

####  Source Code

```javascript
import baseDifference from './.internal/baseDifference.js';
import baseFlatten from './.internal/baseFlatten.js';
import isArrayLikeObject from './isArrayLikeObject.js';

function difference(array, ...values) {
  return isArrayLikeObject(array)
  	// 将除第一个参数之后的参数扁平化为一个数组之后，通过 baseDifference 获取差值
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
}
```

```javascript
// isArrayLikeObject 私有方法
function isArrayLikeObject(value) {
  // 既是一个类 Object 对象也是一个类 Array 对象
  return isObjectLike(value) && isArrayLike(value);
}
// 检查 value 是否是一个类对象类型的数据。它不应该是 null，且类型应该是 object
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}
// 检查一个 value 是否是类数组的数据。它不是 function，且有 value.length 值，并且 value.length >= 0 && value.length <= Number.MAX_SAFE_INTEGER
function isArrayLike(value) {
  // 注：function 有 length 属性，且默认情况下 length 为 0
  return value != null && isLength(value.length) && !isFunction(value);
}
```

`baseDifference` 方法较为复杂一些，但其本质是比较筛选出两个 Array 中的不同元素，返回一个由它们组成的新的 Array。不过在 `baseDifference` 内针对这些比较做了很多处理工作。

```javascript
/**
 * 不支持比较多个 Array 的基本 `difference` 方法
 *
 * @私有方法
 * @param {Array} array —— 要检查的 Array
 * @param {Array} values —— array 中的各元素不能在 values 里
 * @param {Function} [iteratee] 针对两个 Array 中的每个元素进行调用
 * @param {Function} [comparator] 自定义比较的方法
 * @returns {Array} 返回由筛选出的元素组成的新 Array
 */
baseDifference(array, values, iteratee, comparator)
```

如上，`baseDifference` 可以：

- 单纯的比较两个 Array 中的差值
- 在比较时，对每个 Array 中的元素都代入某种方法进行转换（通过代入 `iteratee` 参数）
- 如果 `values` 的长度小于 `LARGE_ARRAY_SIZE` ，即 200，则可以正常比较，即查看 `array` 中的各个元素是否在 `values` 里
  - 在比较时
    - 没有自定义比较方法，则通过内置的 `arrayIncludes(array, value)` 私有方法进行比较，仅查看 `value` 是否在 `array` 中
    - 有自定义比较方法，则通过内置的  `arrayIncludesWith(array, value, comparator)` 私有方法进行比较，依次将 `array` 中的每个值代入 `comparator(value, target value in array)` 中进行比较
- 否则当长度大于 200 时，则通过 `cacheHas` 方法和 `SetCache` 对象进行比较
  - 本质上是将两个 Array 的比较，转换为了查看 `array` 中的各个元素，是否存在一个对象里（作为 `key` 而存在）
  - 首先，通过 `SetCache` 对象，将 `values` 里的每个元素以键值对的形式储存在 `this.__data__` 中。
  - `this.__data__` 实质上是一个 `MapCache` 对象，它把传入的各个元素根据 type 进行分类，然后将各元素和它对应的 value，储存在 `Hash` 对象或者 `ListCache` 对象中。
  - 最终，其本质就是把 `values` 数组转换为了一个 `key/value('__lodash_hash_undefined__')` 组成的键值对对象 

> [`baseDifference` 源码注释解读](./code/.internal/baseDifference.js)

### `differenceBy`

类似于 `difference` ，但指定了比较时一个类似 format 的方法。相当于 `baseDifference` 中声明了 `iteratee` 参数，在比较过程中，会将每个元素代入 `iteratee` 方法中，用返回的结果进行比较。

#### Usage

```javascript
_.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor);
// => [1.2]
 
// The `_.property` iteratee shorthand.
_.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x');
// => [{ 'x': 2 }]
```

#### Source Code

```javascript
// last 方法用于获取数组的最后一个元素
import last from './last.js';

function differenceBy(array, ...values) {
  let iteratee = last(values);
  // 如果没有传入比较的方法的话，则 differenceBy 仅作为一个 difference 方法使用
  if (isArrayLikeObject(iteratee)) {
    iteratee = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), iteratee)
    : [];
}
```

### `differenceWith`

类似于 `difference` ，但声明了 `comparator`方法。相当于 `baseDifference` 中代入了 `comparator` 参数，在比较过程中，将按照 `comparator` 方法作为比较的规则。

#### Usage

```javascript
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
 
_.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual);
// => [{ 'x': 2, 'y': 1 }]
```

#### Source Code

```javascript
function differenceWith(array, ...values) {
  let comparator = last(values);
  if (isArrayLikeObject(comparator)) {
    comparator = undefined;
  }
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true), undefined, comparator)
    : [];
}
```

### `drop`

从一个数组的开头开始，去除指定数目个元素（默认去除 1 个）

#### Usage

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

#### Source Code

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

### `dropRight`

相对于 `drop` 方法，`dropRight` 方法从数组的右侧开始分隔。除此以外其他特性和 `drop` 完全一样。

#### Usage

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

#### Source Code

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

### `dropWhile`

数组从左到右依次剔除元素，直到传入的判断方法返回 `false`

#### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.dropWhile(users, function(o) { return !o.active; });
// => objects for ['pebbles']
```

#### Source Code

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

### `dropRightWhile`

相对于 `dropRight` ，`dropRightWhile` 从右侧开始 `drop` ，知道指定的判断方法返回 false

#### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
_.dropRightWhile(users, function(o) { return !o.active; });
// => objects for ['barney']
```

#### Source Code

```javascript
function dropRightWhile(array, predicate) {
  return (array && array.length)
    ? baseWhile(array, predicate, true, true)
    : [];
}
```

### `fill`

用 `value` 填充一个数组从 `[start, end)` 里的元素。

#### Usage

```javascript
var array = [1, 2, 3];
 
_.fill(array, 'a');
console.log(array);
// => ['a', 'a', 'a']
 
_.fill(Array(3), 2);
// => [2, 2, 2]
 
_.fill([4, 6, 8, 10], '*', 1, 3);
// => [4, '*', '*', 10]
```

#### Source Code

```javascript
function baseFill(array, value, start, end) {
  const length = array.length;

  start = toInteger(start);
  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = (end === undefined || end > length) ? length : toInteger(end);
  if (end < 0) {
    end += length;
  }
  end = start > end ? 0 : toLength(end);
  while (start < end) {
    array[start++] = value;
  }
  return array;
}
```

`fill` 的内部其实很简单，就是遍历一个数组，把 `index` 从 `[start, end` 的元素改成 `value`（直接修改原数组）。而且，由例子可知，利用 `fill` 可以创建一个由指定 `value` 填充的新数组：

```javascript
_.fill(Array(3), 2);
// => [2, 2, 2]

//但我们也可以通过 ES6 API 来实现：
new Array(3).fill(0) // => [0, 0, 0]

// 可惜的是 ES6 fill 兼容性还不是很高，在安卓微信内就会报错。因此，还有一种完全兼容的写法：
Array.from(new Array(3), (item, index) => 0); // => [0, 0, 0]
```

### `findIndex`

由传入的判断方法，寻找符合该方法的第一个元素的 `index` 。当没有符合条件的元素时，返回 `-1`

#### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
_.findIndex(users, function(o) { return o.user == 'barney'; });
// => 0

// 相对于 findIndex，原生的 indexOf 只能简单的判断两个元素是否完全相等
```

#### Source Code

```javascript
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  const length = array.length;
  // 可以通过 fromIndex 参数来指定从哪个 index 开始
  // fromRight 则指定查找的方向
  let index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}
```

### `findLastIndex`

该方法类似于 `findIndex` ，但是是从右往左开始判断。

#### Usage

```javascript
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
_.findLastIndex(users, function(o) { return o.user == 'pebbles'; });
// => 2
```

#### Source Code

```javascript
const nativeMax = Math.max;
const nativeMin = Math.min;

function findLastIndex(array, predicate, fromIndex) {
  const length = array == null ? 0 : array.length;
  if (!length) {
    return -1;
  }
  let index = length - 1;
  if (fromIndex !== undefined) {
    index = toInteger(fromIndex);
    index = fromIndex < 0
      ? nativeMax(length + index, 0)
      : nativeMin(index, length - 1);
  }
  return baseFindIndex(array, predicate, index, true);
}
```

### `chunk`

将一个 Array 按照 `size` 参数进行分段，形成由多个 Array 组成的 Array

#### Usage

```javascript
// API
_.chunk(array, [size=1])

// example
_.chunk(['a', 'b', 'c', 'd'], 2);
// => [['a', 'b'], ['c', 'd']]
 
_.chunk(['a', 'b', 'c', 'd'], 3);
// => [['a', 'b', 'c'], ['d']]
```

#### Source Code