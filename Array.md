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